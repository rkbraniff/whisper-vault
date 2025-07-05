import sodium from 'libsodium-wrappers-sumo';

await sodium.ready;

/** Convert Ed25519 key-pair to X25519. */
function ed25519ToX25519(privEd: Uint8Array, pubEd: Uint8Array) {
  const privX = sodium.crypto_sign_ed25519_sk_to_curve25519(privEd);
  const pubX  = sodium.crypto_sign_ed25519_pk_to_curve25519(pubEd);
  return { privX, pubX };
}

/**
 * Derive a shared secret with X25519 Diffie–Hellman.
 * `senderPrivEd` – 64-byte Ed25519 secret key (seed + pub).
 * `receiverPubEd` – 32-byte Ed25519 public key.
 */
export async function deriveSharedKey(
  senderPrivEd: Uint8Array,
  receiverPubEd: Uint8Array
): Promise<Uint8Array> {
  const { privX } = ed25519ToX25519(senderPrivEd, receiverPubEd);
  const { pubX }  = ed25519ToX25519(senderPrivEd, receiverPubEd);

  // DH: sender private X25519 * receiver public X25519
  return sodium.crypto_scalarmult(privX, pubX);
}

/** Generate a fresh X25519 key-pair for forward secrecy. */
export async function rotateEphemeral(): Promise<{
  newPriv: Uint8Array;
  newPub: Uint8Array;
}> {
  const { privateKey: newPriv, publicKey: newPub } =
    sodium.crypto_box_keypair(); // X25519 pair
  return { newPriv, newPub };
}
