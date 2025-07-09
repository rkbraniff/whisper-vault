import request from 'supertest';
import { app } from '../src/index';

describe('Auth flow', () => {
  const email = `u${Date.now()}@ex.com`;
  let tempToken: string;

  it('registers a new user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email, password: 'hunter2!' })
      .expect(201);
  });

  it('login asks for 2FA', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'hunter2!' });
    expect(res.body.status).toBe('2fa_required');
    tempToken = res.body.tempToken;
  });

  // Add more tests for 2FA setup/verify as needed
});
