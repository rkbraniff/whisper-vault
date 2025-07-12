import { Router, Request } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

// Extend Express Request type to include 'user'
import type { JWTPayload } from '../middleware/auth.js';
interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const meRouter = Router();
interface StorageDestinationCallback {
    (error: Error | null, destination: string): void;
}

interface StorageFilenameCallback {
    (error: Error | null, filename: string): void;
}

import type { Multer } from 'multer';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: StorageDestinationCallback) => cb(null, uploadDir),
    filename: (req: Request, file: Express.Multer.File, cb: StorageFilenameCallback) => {
        // Cast req to AuthenticatedRequest to access user property
        const userReq = req as AuthenticatedRequest;
        const ext: string = path.extname(file.originalname);
        if (!userReq.user) {
            return cb(new Error('User not authenticated'), '');
        }
        cb(null, `${userReq.user.id}${ext}`);
    }
});

const upload = multer({ storage });

meRouter.put('/avatar', requireAuth, upload.single('avatar'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const avatarUrl = `/uploads/${req.file.filename}`;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await prisma.user.update({ where: { id: req.user.id }, data: { avatarUrl } });
    res.json({ avatarUrl });
  } catch (err) {
    next(err);
  }
});


