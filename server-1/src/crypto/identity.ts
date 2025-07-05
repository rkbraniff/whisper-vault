import sodium from 'libsodium-wrappers-sumo';

/** Generate a new Ed25519 identity key-pair. */
export async function generateIdentity(): Promise<{
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}> {
  await sodium.ready;

  const { publicKey, privateKey } = sodium.crypto_sign_keypair();
  return { publicKey, privateKey };
}

/** Import a Base64-encoded private key and derive its public key. */
export async function importIdentity(
  privKeyB64: string
): Promise<{
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}> {
  await sodium.ready;

  const privateKey = sodium.from_base64(privKeyB64, sodium.base64_variants.URLSAFE_NO_PADDING);
  if (privateKey.length !== sodium.crypto_sign_SECRETKEYBYTES)
    throw new Error('Invalid secret-key length');

  const publicKey = privateKey.subarray(
    sodium.crypto_sign_SECRETKEYBYTES - sodium.crypto_sign_PUBLICKEYBYTES
  ); // last 32 bytes per libsodium spec

  return { publicKey, privateKey };
}

/** Helper: encode any Uint8Array to URL-safe Base64. */
export function toB64(bytes: Uint8Array): string {
  return sodium.to_base64(bytes, sodium.base64_variants.URLSAFE_NO_PADDING);
}
