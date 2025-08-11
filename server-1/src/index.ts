import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

// --- CORS allowlist ---
const allowList = (process.env.CLIENT_ORIGIN ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// Matches preview URLs like:
// https://whisper-vault-<anything>-rkbraniffs-projects.vercel.app
const vercelPreview = /^https:\/\/whisper-vault-[\w-]+-rkbraniffs-projects\.vercel\.app$/;

const corsOrigin: cors.CorsOptions['origin'] = (origin, cb) => {
  console.log('[CORS preflight] origin:', origin);
  if (!origin) return cb(null, true); // curl/Postman
  const ok = allowList.includes(origin) || vercelPreview.test(origin);
  if (ok) return cb(null, origin);     // <-- echo the exact origin
  return cb(new Error(`CORS blocked: ${origin}`));
};

const corsOpts: cors.CorsOptions = {
  origin: corsOrigin,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204
};
import helmet from 'helmet';
import { authRouter } from './routes/auth.js';
import { messagesRouter } from './routes/messages.js';
import { keysRouter } from './routes/keys.js';
import { threadsRouter } from './routes/threads.js';
import { meRouter } from './routes/me.js';
import { contactsRouter } from './routes/contacts.js';
import { registerChatHandlers } from './sockets/chat.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => callback(null, true), // Allow all origins for Socket.IO (or implement allowList logic here if needed)
    methods: ['GET', 'POST'],
    credentials: true
  },
});

app.use(cors(corsOpts));
// make sure preflight gets the headers even on unmatched routes
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/keys', keysRouter);
app.use('/api/threads', threadsRouter);
app.use('/api/me', meRouter);
app.use('/api/contacts', contactsRouter);
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
        hasEmail: !!process.env.SMTP_HOST && !!process.env.SMTP_USER,
        hasTwilio: !!process.env.TWILIO_SID
      }
    };

    // Test database connection
    try {
      const { prisma } = await import('./lib/prisma.js');
      await prisma.$queryRaw`SELECT 1`;
      health.database = 'connected';
    } catch (dbError) {
      console.error('[HEALTH] Database connection error:', dbError);
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