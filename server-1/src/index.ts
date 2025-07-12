import 'dotenv/config';
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
import path from 'path';
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

app.use('/api/auth', authRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/keys', keysRouter);
app.use('/api/threads', threadsRouter);
app.use('/api/me', meRouter);
app.use('/uploads', express.static(path.resolve('uploads')));
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