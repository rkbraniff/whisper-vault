import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
export interface JWTPayload extends JwtPayload { id: string; email: string; twoPass?: boolean }

declare module 'express-serve-static-core' {
  interface Request {
    user?: JWTPayload;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'no token' });
  try {
    const secret = process.env.JWT_SECRET as string;
    req.user = jwt.verify(token, secret) as JWTPayload;
    next();
  } catch {
    return res.status(401).json({ error: 'invalid token' });
  }
}

export function require2FA(req: Request, res: Response, next: NextFunction) {
  if (req.user?.twoPass) return res.status(401).json({ error: '2fa incomplete' });
  next();
}
