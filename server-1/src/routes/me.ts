import { Router, Request } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

// Extend Express Request type to include 'user'
import type { JWTPayload } from '../middleware/auth.js';
interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const meRouter = Router();

// TODO: Implement cloud storage for avatar uploads in serverless environment
// For now, avatar uploads are disabled due to serverless file system limitations
meRouter.put('/avatar', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    // Return error for now - avatar uploads require cloud storage in serverless environment
    res.status(501).json({ 
      error: 'Avatar uploads not implemented yet',
      message: 'Avatar uploads require cloud storage integration for serverless deployment'
    });
  } catch (err) {
    next(err);
  }
});

// Get user profile
meRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        createdAt: true,
        emailConfirmed: true
      }
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json(user);
  } catch (err) {
    next(err);
  }
});


