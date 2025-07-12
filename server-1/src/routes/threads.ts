
import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, require2FA } from '../middleware/auth.js';

export const threadsRouter = Router();

/* ---------- helpers ---------- */
const asInt = (v: string | string[]) => Number(Array.isArray(v) ? v[0] : v);

/* ---------- GET /api/threads ---------- */
threadsRouter.get('/', requireAuth, require2FA, async (req, res, next) => {
  try {
    const threads = await prisma.thread.findMany({
      where: { participants: { some: { id: req.user!.id } } },
      orderBy: { updatedAt: 'desc' },
      take: 20,
      include: {
        lastMessage: true,
        participants: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
      }
    });
    res.json(threads);
  } catch (err) {
    next(err);
  }
});

/* ---------- POST /api/threads ---------- */
threadsRouter.post('/', requireAuth, require2FA, async (req, res, next) => {
  try {
    const { title, participants }: { title: string; participants: string[] } = req.body;

    // ensure the creator is in the participants list
    if (!participants.includes(req.user!.id)) participants.push(req.user!.id);

    const thread = await prisma.thread.create({
      data: {
        title,
        participants: { connect: participants.map(id => ({ id })) }
      }
    });
    res.status(201).json(thread);
  } catch (err) {
    next(err);
  }
});

/* ---------- POST /api/threads/:id/messages ---------- */
threadsRouter.post('/:id/messages', requireAuth, require2FA, async (req, res, next) => {
  try {
    const threadId = asInt(req.params.id);
    const { ciphertext, nonce, receiverId }:
      { ciphertext: string; nonce: string; receiverId: string } = req.body;

    // make sure current user actually belongs to this thread
    const inThread = await prisma.thread.findFirst({
      where: {
        id: threadId,
        participants: { some: { id: req.user!.id } }
      },
      select: { id: true }
    });
    if (!inThread) return res.status(403).json({ error: 'forbidden' });

    const msg = await prisma.message.create({
      data: {
        threadId,
        senderId: req.user!.id,
        receiverId,
        ciphertext,
        nonce
      }
    });

    // update lastMessage pointer on the thread
    await prisma.thread.update({
      where: { id: threadId },
      data: { lastMessageId: msg.id, updatedAt: new Date() }
    });

    res.status(201).json(msg);
  } catch (err) {
    next(err);
  }
});


