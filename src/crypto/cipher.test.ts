import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from '../../server-1/src/crypto/cipher';

const key = new Uint8Array(32).fill(42); // dummy key
const message = new TextEncoder().encode('hello world');

describe('cipher', () => {
  it('encrypts and decrypts a message', () => {
    const { nonce, ciphertext } = encrypt(key, message);
    const decrypted = decrypt(key, nonce, ciphertext);
    expect(new TextDecoder().decode(decrypted)).toBe('hello world');
  });

  it('throws on tampered ciphertext', () => {
    const { nonce, ciphertext } = encrypt(key, message);
    ciphertext[0] ^= 1; // tamper
    expect(() => decrypt(key, nonce, ciphertext)).toThrow();
  });
});
