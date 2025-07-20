import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { prisma } from '../lib/prisma.js';
import { body, validationResult } from 'express-validator';
import { z } from 'zod';
import { sendConfirmationEmail } from '../lib/mailer.js';
import crypto from 'crypto';


export const authRouter = Router();
// DEBUG: Get current user's TOTP secret and otpauth URL (for troubleshooting only, remove in production)
authRouter.get('/debug/totp-secret', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({
    totpSecret: user.totpSecret,
    otpauthUrl: user.totpSecret ? speakeasy.otpauthURL({
      secret: user.totpSecret,
      label: user.email,
      issuer: process.env.TOTP_ISSUER || 'WhisperVault',
    }) : null
  });
});

interface AuthJwtPayload extends JwtPayload {
  userId: string;
  twofa?: boolean;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');
  return secret;
}

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization?.split(' ')[1];
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const payload = jwt.verify(auth, getJwtSecret()) as AuthJwtPayload;
    (req as any).userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Registration
authRouter.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').isLength({ min: 1 }),
  body('lastName').isLength({ min: 1 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password, firstName, lastName, phone } = req.body;
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ error: 'email in use' });

      const hash = await bcrypt.hash(password, 12);
      const confirmationToken = crypto.randomBytes(32).toString('hex');
      // Generate 2FA secret and otpauth URL
      const secret = speakeasy.generateSecret({ name: process.env.TOTP_ISSUER || 'WhisperVault' });
      const user = await prisma.user.create({ data: { email, passwordHash: hash, firstName, lastName, phone, confirmationToken, totpSecret: secret.base32, is2faEnabled: true } });
      // Send confirmation email with QR code and manual code
      if (process.env.NODE_ENV !== 'test') {
        await sendConfirmationEmail(email, confirmationToken, secret.otpauth_url, secret.base32);
      }
// Test-only helper route for looking up confirmationToken and totpSecret
if (process.env.NODE_ENV === 'test') {
  authRouter.get('/_test/lookup/:email', async (req, res) => {
    const u = await prisma.user.findUnique({
      where: { email: req.params.email },
      select: { confirmationToken: true, totpSecret: true },
    });
    res.json(u ?? {});
  });
}
      // Respond with success message only (no temp token, no 2FA required yet)
      res.status(201).json({ status: 'confirmation_required', message: 'Registration successful! Please check your email to confirm your account.' });
    } catch (err) { next(err); }
  }
);
authRouter.post('/login', async (req: Request, res: Response) => {
// Login
// (duplicate removed, see below)
  try {
    const schema = z.object({ email: z.string().email(), password: z.string() });
    const { email, password } = schema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        is2faEnabled: true,
        emailConfirmed: true,
        passwordHash: true
      }
    });
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.emailConfirmed) {
      return res.status(403).json({ error: 'Please confirm your email before logging in.' });
    }
    const { passwordHash, ...userSafe } = user;
    // Always require 2FA for all users
    const tempToken = jwt.sign({ userId: user.id, twofa: true }, getJwtSecret(), { expiresIn: '5m' });
    return res.json({ status: '2fa_required', tempToken });
  } catch (e: any) {
    console.error('LOGIN ERROR:', e);
    res.status(500).json({ error: 'internal' });
  }
});

// 2FA verify
authRouter.post('/2fa/verify', async (req: Request, res: Response) => {
  try {
    const schema = z.object({ code: z.string() });
    const { code } = schema.parse(req.body);
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return res.status(401).json({ error: 'No temp token' });
    let payload: AuthJwtPayload;
    try {
      payload = jwt.verify(auth, getJwtSecret()) as AuthJwtPayload;
    } catch {
      console.error('[2FA VERIFY] Invalid temp token:', auth);
      return res.status(401).json({ error: 'Invalid temp token' });
    }
    if (!payload.twofa) return res.status(401).json({ error: 'Not a 2FA token' });
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, totpSecret: true, email: true, firstName: true, lastName: true, phone: true }
    });
    if (!user || !user.totpSecret) {
      console.error('[2FA VERIFY] No user or no 2FA secret:', payload.userId, user);
      return res.status(401).json({ error: 'No 2FA setup' });
    }
    const verified = speakeasy.totp.verify({ secret: user.totpSecret, encoding: 'base32', token: code, window: 1 });
    if (!verified) {
      console.error('[2FA VERIFY] Invalid code for user:', payload.userId, code);
      return res.status(401).json({ error: 'Invalid code' });
    }
    const token = jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: '1h' });
    const { totpSecret, ...userSafe } = user;
    res.json({ token, user: userSafe });
  } catch (e: any) {
    console.error('[2FA VERIFY] Exception:', e);
      res.status(400).json({ error: 'Invalid input' });
    }
  });

// 2FA setup (protected route)
authRouter.post('/2fa/setup', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const secret = speakeasy.generateSecret({ name: process.env.TOTP_ISSUER || 'WhisperVault' });
    // Optionally: store secret only after first verify
    // await prisma.user.update({ where: { id: userId }, data: { totpSecret: secret.base32, is2faEnabled: true } });
      res.json({ otpauth_url: secret.otpauth_url, base32: secret.base32 });
    } catch (e) {
      res.status(500).json({ error: 'Failed to generate 2FA secret' });
    }
  });

// Email confirmation endpoint
authRouter.get('/confirm/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  console.log('[CONFIRM] Received token:', token);
  // Use findFirst instead of findUnique for non-unique fields
  const user = await prisma.user.findFirst({ where: { confirmationToken: token } });
  console.log('[CONFIRM] User found:', user);
  if (!user) return res.status(400).json({ error: 'Invalid or expired confirmation token' });
  // Mark email as confirmed and clear confirmationToken
  await prisma.user.update({
    where: { id: user.id },
    data: { emailConfirmed: true, confirmationToken: null }
  });
  // Generate otpauth URL and QR code for UI
  const otpauthUrl = speakeasy.otpauthURL({
    secret: user.totpSecret as string,
    label: user.email,
    issuer: process.env.TOTP_ISSUER || 'WhisperVault',
  });
  let qrImg = '';
  try {
    qrImg = await qrcode.toDataURL(otpauthUrl);
  } catch (err) {
    console.error('Error generating QR code:', err);
  }
  res.json({ status: 'confirmed', otpauthUrl, qrImg, manualCode: user.totpSecret });
});
// Resend confirmation email endpoint
authRouter.post('/resend-confirmation', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.emailConfirmed) return res.status(400).json({ error: 'Email already confirmed' });
  // Generate new confirmation token
  const confirmationToken = crypto.randomBytes(32).toString('hex');
  await prisma.user.update({ where: { id: user.id }, data: { confirmationToken } });
  // Generate otpauth URL for QR
  const otpauthUrl = speakeasy.otpauthURL({
    secret: user.totpSecret as string,
    label: user.email,
    issuer: process.env.TOTP_ISSUER || 'WhisperVault',
  });
  await sendConfirmationEmail(user.email, confirmationToken, otpauthUrl, user.totpSecret ?? undefined);
  res.json({ status: 'resent', message: 'Confirmation email resent.' });
});

// Get 2FA setup info (QR code and manual code) for authenticated user
authRouter.get('/2fa/setup-info', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.totpSecret) {
      return res.status(404).json({ error: 'No 2FA secret found for user.' });
    }
    const otpauthUrl = speakeasy.otpauthURL({
      secret: user.totpSecret,
      label: user.email,
      issuer: process.env.TOTP_ISSUER || 'WhisperVault',
    });
    let qrImg = '';
    try {
      qrImg = await qrcode.toDataURL(otpauthUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
    res.json({ qrImg, manualCode: user.totpSecret });
  } catch (e) {
    console.error('2FA SETUP-INFO ERROR:', e);
    res.status(500).json({ error: 'Failed to get 2FA setup info.' });
  }
});

// --- SMS 2FA code store ---
const smsCodes = new Map(); // userId -> code

// POST /api/auth/2fa/send-sms
authRouter.post('/2fa/send-sms', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error('[SEND SMS] No user found for userId:', userId);
      return res.status(400).json({ error: 'No user found.' });
    }
    if (!user.phone) {
      console.error('[SEND SMS] No phone number for user:', userId);
      return res.status(400).json({ error: 'No phone number on file.' });
    }
    // Generate a 6-digit code
    const code = (Math.floor(100000 + Math.random() * 900000)).toString();

    // Simulate SMS send delay
    setTimeout(() => smsCodes.delete(userId), 5 * 60 * 1000); // Code expires in 5 min
    res.json({ message: 'SMS code sent.' });
  } catch (e) {
    console.error('[SEND SMS ERROR]:', e);
    res.status(500).json({ error: 'Failed to send SMS code.' });
  }
});

// POST /api/auth/2fa/verify-sms
authRouter.post('/2fa/verify-sms', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { code } = req.body;
    const expected = smsCodes.get(userId);
    if (!expected) {
      console.error('[VERIFY SMS] No SMS code sent or code expired for user:', userId);
      return res.status(400).json({ error: 'No SMS code sent or code expired.' });
    }
    if (code !== expected) {
      console.error('[VERIFY SMS] Invalid SMS code for user:', userId, 'Expected:', expected, 'Got:', code);
      return res.status(401).json({ error: 'Invalid SMS code.' });
    }
    smsCodes.delete(userId);
    // Issue JWT
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      console.error('[VERIFY SMS] User not found for userId:', userId);
      return res.status(401).json({ error: 'User not found.' });
    }
    const token = jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: '1h' });
    const { passwordHash, ...userSafe } = user;
    res.json({ token, user: userSafe });
  } catch (e) {
    console.error('[VERIFY SMS ERROR]:', e);
    res.status(500).json({ error: 'Failed to verify SMS code.' });
  }
});


// (duplicate login route removed)

// (duplicate 2fa verify route removed)

// (duplicate 2fa setup route removed)

// (duplicate confirm route removed)
// --- Place SMS 2FA endpoints at the end, after all other routes ---

authRouter.use(authMiddleware);