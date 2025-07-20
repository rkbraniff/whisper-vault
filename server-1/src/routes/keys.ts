import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth, require2FA } from '../middleware/auth.js';
export const keysRouter = Router();

// POST /api/keys - set public key
keysRouter.post('/', requireAuth, require2FA, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'unauthorized' });
  const { publicKey } = req.body;
  await prisma.user.update({ where: { id: req.user.id }, data: { publicKey } });
  res.status(204).end();
});

// GET /api/keys/:userId - get public key
keysRouter.get('/:userId', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.userId },
    select: { publicKey: true }
  });
res.json({ publicKey: user?.publicKey ?? null });
});

