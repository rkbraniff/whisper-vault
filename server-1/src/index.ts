import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import { authRouter } from './routes/auth.js';
import { messagesRouter } from './routes/messages.js';
import { keysRouter } from './routes/keys.js';
import { threadsRouter } from './routes/threads.js';
import { meRouter } from './routes/me.js';
import { registerChatHandlers } from './sockets/chat.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN || 'https://whisper-vault-al0bunu88m-rkbraniffs-projects.vercel.app',
        methods: ['GET', 'POST'],
    },
});

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || 'https://whisper-vault-al0bunu88m-rkbraniffs-projects.vercel.app',
    credentials: true
}));
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/keys', keysRouter);
app.use('/api/threads', threadsRouter);
app.use('/api/me', meRouter);
// Note: Static file serving for uploads disabled in serverless environment
// TODO: Implement cloud storage for file uploads

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  try {
    const health = {
      ok: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      database: 'unknown',
      env_vars: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasJWT: !!process.env.JWT_SECRET,
        hasEmail: !!process.env.EMAIL_HOST && !!process.env.EMAIL_USER,
        hasTwilio: !!process.env.TWILIO_SID
      }
    };

    // Test database connection
    try {
      const { prisma } = await import('./lib/prisma.js');
      await prisma.$queryRaw`SELECT 1`;
      health.database = 'connected';
    } catch (dbError) {
      health.database = 'error';
      health.ok = false;
    }

    res.json(health);
  } catch (error) {
    res.status(500).json({ 
      ok: false, 
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    });
  }
});

io.on('connection', (socket) => {
    registerChatHandlers(io, socket);
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error details:', err);
  
  // In production, don't expose internal error details
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'internal' });
  } else {
    res.status(500).json({ 
      error: 'internal',
      details: err.message,
      stack: err.stack
    });
  }
});

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// For Vercel serverless deployment
export default app;