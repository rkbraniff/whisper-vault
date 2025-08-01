process.env.DATABASE_URL = "postgresql://whisper:secretsigil@localhost:5432/whispervault_test";
import 'dotenv/config';
import request from 'supertest';
import { app } from '../src/index';

describe('Keys API', () => {
  it('returns null for missing public key', async () => {
    const res = await request(app)
      .get('/api/keys/nonexistentuserid');
    expect(res.body.publicKey).toBeNull();
  });

  // Add more tests for authenticated key set/get as needed
});
