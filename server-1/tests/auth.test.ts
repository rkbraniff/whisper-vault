import request from 'supertest';
import { app } from '../src/index';

describe('Auth flow', () => {
  const email = `u${Date.now()}@ex.com`;
  const password = 'hunter2!A';
  const firstName = 'Testy';
  const lastName = 'McTestface';
  let tempToken: string;
  let manualCode: string;

  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email, password, firstName, lastName })
      .expect(201);
    expect(res.body.status).toBe('confirmation_required');
  });

  it('confirms email and gets 2FA setup', async () => {
    // Simulate email confirmation by finding the user and hitting the confirm endpoint
    // (In a real test, you'd mock the email or query the DB)
    const { prisma } = await import('../src/lib/prisma.js');
    const user = await prisma.user.findUnique({ where: { email } });
    expect(user).toBeTruthy();
    const res = await request(app)
      .get(`/api/auth/confirm/${user!.confirmationToken}`)
      .expect(200);
    expect(res.body.qrImg).toBeTruthy();
    expect(res.body.manualCode).toBeTruthy();
    manualCode = res.body.manualCode;
    tempToken = res.body.tempToken;
  });

  it('verifies 2FA code', async () => {
    // Generate a valid TOTP code using the manualCode
    const speakeasy = await import('speakeasy');
    const code = speakeasy.totp({ secret: manualCode, encoding: 'base32' });
    const res = await request(app)
      .post('/api/auth/2fa/verify')
      .set('Authorization', `Bearer ${tempToken}`)
      .send({ code })
      .expect(200);
    expect(res.body.token).toBeTruthy();
  });
});
