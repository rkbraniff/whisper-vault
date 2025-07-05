import sodium from 'libsodium-wrappers-sumo';

await sodium.ready;

/**
 * Encrypt a message with XChaCha20-Poly1305 (libsodium secret-box).
 */
export function encrypt(
  sharedKey: Uint8Array,
  plaintext: Uint8Array
): { nonce: Uint8Array; ciphertext: Uint8Array } {
  // 24-byte nonce for XChaCha20
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

  const ciphertext = sodium.crypto_secretbox_easy(plaintext, nonce, sharedKey);
  return { nonce, ciphertext };
}

/**
 * Decrypt a message encrypted with `encrypt`.
 * Throws if authentication fails.
 */
export function decrypt(
  sharedKey: Uint8Array,
  nonce: Uint8Array,
  ciphertext: Uint8Array
): Uint8Array {
  const plaintext = sodium.crypto_secretbox_open_easy(
    ciphertext,
    nonce,
    sharedKey
  );
  if (!plaintext) throw new Error('Decryption failed or tampered ciphertext');
  return plaintext;
}
