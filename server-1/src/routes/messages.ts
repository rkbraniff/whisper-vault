import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../prisma/client'; // Adjust the import based on your Prisma client setup

const router = Router();

const messageSchema = z.object({
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  ciphertext: z.string(),
  nonce: z.string(),
});

router.post('/', async (req, res) => {
  try {
    const parsedData = messageSchema.parse(req.body);
    
    const message = await prisma.message.create({
      data: {
        senderId: parsedData.senderId,
        receiverId: parsedData.receiverId,
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

export default router;