import { describe, it, expect } from 'vitest';
import * as identity from '../../server-1/src/crypto/identity';

describe('identity', () => {
  it('generates key pairs of correct length', async () => {
    const { publicKey, privateKey } = await identity.generateIdentity();
    expect(publicKey.length).toBe(32);
    expect(privateKey.length).toBe(64);
  });
});
