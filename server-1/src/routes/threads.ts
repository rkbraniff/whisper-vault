import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, require2FA } from '../middleware/auth.js';

const router = Router();

// GET /api/threads
router.get('/', requireAuth, require2FA, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' });
  const threads = await prisma.thread.findMany({
    where: { participants: { some: { id: req.user.id } } },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    include: { lastMessage: true }
  });
  res.json(threads);
});

// POST /api/threads
router.post('/', requireAuth, require2FA, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' });
  const { title, participants } = req.body;
  const thread = await prisma.thread.create({
    data: {
      title,
      participants: { connect: participants.map((id: string) => ({ id })) }
    }
  });
  res.status(201).json(thread);
});

// POST /api/threads/:id/messages
router.post('/:id/messages', requireAuth, require2FA, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' });
  const { ciphertext, nonce } = req.body;
  const msg = await prisma.message.create({
    data: {
      threadId: req.params.id,
      senderId: req.user.id,
      ciphertext,
      nonce
    }
  });
  res.status(201).json(msg);
});

export default router;
