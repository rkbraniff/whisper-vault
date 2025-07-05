import { describe, it, expect, beforeAll } from 'vitest';
import { encrypt, decrypt } from './cipher';
import sodium from 'libsodium-wrappers-sumo';

const key = new Uint8Array(32).fill(42); // dummy key
const message = Uint8Array.from(new TextEncoder().encode('hello'));

describe('cipher', () => {
  beforeAll(async () => {
    await sodium.ready;
  });

  it('encrypts and decrypts a message', () => {
    // Type checks
    expect(key instanceof Uint8Array).toBe(true);
    expect(message instanceof Uint8Array).toBe(true);
    // Log types and constructors
    // eslint-disable-next-line no-console
    console.log('key:', key.constructor.name, 'message:', message.constructor.name, 'key.length:', key.length, 'message.length:', message.length);
    const { nonce, ciphertext } = encrypt(key, message);
    // eslint-disable-next-line no-console
    console.log('nonce:', nonce.constructor.name, 'ciphertext:', ciphertext.constructor.name);
    const decrypted = decrypt(key, nonce, ciphertext);
    expect(new TextDecoder().decode(decrypted)).toBe('hello');
  });

  it('throws on tampered ciphertext', () => {
    const { nonce, ciphertext } = encrypt(key, message);
    ciphertext[0] ^= 0xff; // tamper
    expect(() => decrypt(key, nonce, ciphertext)).toThrow();
  });
});
