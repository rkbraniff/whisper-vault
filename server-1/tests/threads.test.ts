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
