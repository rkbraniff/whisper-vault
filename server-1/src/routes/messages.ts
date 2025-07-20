import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';

export const messagesRouter = Router();

const messageSchema = z.object({
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  threadId: z.number(),
  ciphertext: z.string(),
  nonce: z.string(),
});

messagesRouter.post('/', async (req, res) => {
  try {
    const parsedData = messageSchema.parse(req.body);

    const message = await prisma.message.create({
      data: {
        senderId: parsedData.senderId,
        receiverId: parsedData.receiverId,
        threadId: parsedData.threadId,
        ciphertext: parsedData.ciphertext,
        nonce: parsedData.nonce,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

