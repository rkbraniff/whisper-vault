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

const router = Router();

// --- Types ---
interface AuthJwtPayload extends JwtPayload {
  userId: string;
  twofa?: boolean;
}

// --- Helpers ---
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not set');
  return secret;
}

// --- Auth Middleware ---
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
router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').isLength({ min: 1 }),
  body('lastName').isLength({ min: 1 }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password, firstName, lastName } = req.body;
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return res.status(409).json({ error: 'email in use' });

      const hash = await bcrypt.hash(password, 12);
      const confirmationToken = crypto.randomBytes(32).toString('hex');
      // Generate 2FA secret and otpauth URL
      const secret = speakeasy.generateSecret({ name: process.env.TOTP_ISSUER || 'WhisperVault' });
      const user = await prisma.user.create({ data: { email, passwordHash: hash, firstName, lastName, confirmationToken, totpSecret: secret.base32 } });
      // Send confirmation email with QR code and manual code
      await sendConfirmationEmail(email, confirmationToken, secret.otpauth_url, secret.base32);
      // Respond with success message only (no temp token, no 2FA required yet)
      res.status(201).json({ status: 'confirmation_required', message: 'Registration successful! Please check your email to confirm your account.' });
    } catch (err) { next(err); }
  }
);

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const schema = z.object({ email: z.string().email(), password: z.string() });
    const { email, password } = schema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true, is2faEnabled: true, emailConfirmed: true }
    });
    if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.emailConfirmed) {
      return res.status(403).json({ error: 'Please confirm your email before logging in.' });
    }
    if (!user.is2faEnabled) {
      // Issue JWT
      const token = jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: '1h' });
      return res.json({ token });
    } else {
      // Issue temp token for 2FA
      const tempToken = jwt.sign({ userId: user.id, twofa: true }, getJwtSecret(), { expiresIn: '5m' });
      return res.json({ status: '2fa_required', tempToken });
    }
  } catch (e: any) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// 2FA verify
router.post('/2fa/verify', async (req: Request, res: Response) => {
  try {
    const schema = z.object({ code: z.string() });
    const { code } = schema.parse(req.body);
    const auth = req.headers.authorization?.split(' ')[1];
    if (!auth) return res.status(401).json({ error: 'No temp token' });
    let payload: AuthJwtPayload;
    try {
      payload = jwt.verify(auth, getJwtSecret()) as AuthJwtPayload;
    } catch {
      return res.status(401).json({ error: 'Invalid temp token' });
    }
    if (!payload.twofa) return res.status(401).json({ error: 'Not a 2FA token' });
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, totpSecret: true }
    });
    if (!user || !user.totpSecret) return res.status(401).json({ error: 'No 2FA setup' });
    const verified = speakeasy.totp.verify({ secret: user.totpSecret, encoding: 'base32', token: code, window: 1 });
    if (!verified) return res.status(401).json({ error: 'Invalid code' });
    const token = jwt.sign({ userId: user.id }, getJwtSecret(), { expiresIn: '1h' });
    res.json({ token });
  } catch (e: any) {
    res.status(400).json({ error: 'Invalid input' });
  }
});

// 2FA setup (protected route)
router.post('/2fa/setup', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const secret = speakeasy.generateSecret({ name: process.env.TOTP_ISSUER || 'WhisperVault' });
    // Optionally: store secret only after first verify
    // await prisma.user.update({ where: { id: userId }, data: { totpSecret: secret.base32, is2faEnabled: true } });
    res.json({ otpauth_url: secret.otpauth_url, base32: secret.base32 });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to generate 2FA secret' });
  }
});

// Email confirmation endpoint
router.get('/confirm/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  console.log('[CONFIRM] Received token:', token);
  // Use findFirst instead of findUnique for non-unique fields
  const user = await prisma.user.findFirst({ where: { confirmationToken: token } });
  console.log('[CONFIRM] User found:', user);
  if (!user) return res.status(400).json({ error: 'Invalid or expired confirmation token' });
  // Generate otpauth URL and QR code BEFORE clearing the token
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
  try {
    const updateResult = await prisma.user.update({ where: { id: user.id }, data: { emailConfirmed: true, confirmationToken: null } });
    console.log('[CONFIRM] User update result:', updateResult);
  } catch (err) {
    console.error('[CONFIRM] Error updating user:', err);
    return res.status(500).json({ error: 'Failed to update user confirmation status.' });
  }
  // Issue a temp token for 2FA verification after confirmation
  const tempToken = jwt.sign({ userId: user.id, twofa: true }, getJwtSecret(), { expiresIn: '10m' });
  res.json({ message: 'Email confirmed. Please set up 2FA.', qrImg, manualCode: user.totpSecret, tempToken });
});

// Resend confirmation email endpoint
router.post('/resend-confirmation', async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.emailConfirmed) return res.status(400).json({ error: 'Email already confirmed' });
  let token = user.confirmationToken;
  if (!token) {
    token = require('crypto').randomBytes(32).toString('hex');
    await prisma.user.update({ where: { id: user.id }, data: { confirmationToken: token } });
  }
  await sendConfirmationEmail(email, token);
  res.json({ message: 'Confirmation email sent' });
});

// Add endpoint to get QR code and manual code for a user by confirmation token (for use after confirmation)
router.get('/confirm-info/:token', async (req: Request, res: Response) => {
  const { token } = req.params;
  const user = await prisma.user.findUnique({ where: { confirmationToken: token } });
  if (!user) return res.status(400).json({ error: 'Invalid or expired confirmation token' });
  // Generate otpauth URL and QR code
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
});

export default router;