process.env.DATABASE_URL = "postgresql://whisper:secretsigil@localhost:5432/whispervault_test";
import 'dotenv/config';
import request from 'supertest';
import { app } from '../src/index';

describe('Threads API', () => {
  it('returns 401 when unauthenticated', async () => {
    await request(app)
      .get('/api/threads')
      .expect(401);
  });

  // Add more tests for authenticated/2FA flows as needed
});
