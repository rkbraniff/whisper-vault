import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import keyRoutes from './routes/keys.js';
import threadsRoutes from './routes/threads.js';
import { registerChatHandlers } from './sockets/chat.js';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN,
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/keys', keyRoutes);
app.use('/api/threads', threadsRoutes);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

io.on('connection', (socket) => {
    registerChatHandlers(io, socket);
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'internal' });
});

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export { app };