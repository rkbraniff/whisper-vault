import sodium from "libsodium-wrappers";

let ready: Promise<void> | null = null;

async function ensureReady() {
  if (!ready) {
    ready = sodium.ready;
    await ready;
  } else {
    await ready;
  }
}

export async function generateKeyPair(): Promise<{
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}> {
  await ensureReady();
  const keyPair = sodium.crypto_box_keypair();
  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

export async function encryptMessage(
  message: string,
  publicKey: Uint8Array,
  privateKey: Uint8Array
): Promise<Uint8Array> {
  await ensureReady();

  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const cipher = sodium.crypto_box_easy(message, nonce, publicKey, privateKey);
  const encrypted = new Uint8Array(nonce.length + cipher.length);

  encrypted.set(nonce, 0);
  encrypted.set(cipher, nonce.length);

  return encrypted;
}

export async function decryptMessage(
  encrypted: Uint8Array,
  publicKey: Uint8Array,
  privateKey: Uint8Array
): Promise<string> {
  await ensureReady();
  const nonceBytes = sodium.crypto_box_NONCEBYTES;
  const nonce = encrypted.slice(0, nonceBytes);
  const cipher = encrypted.slice(nonceBytes);
  const message = sodium.crypto_box_open_easy(
    cipher,
    nonce,
    publicKey,
    privateKey
  );
  return sodium.to_string(message);
}

export async function deriveSharedKey(
  myPrivateKey: Uint8Array,
  theirPublicKey: Uint8Array
): Promise<Uint8Array> {
  await ensureReady();
  return sodium.crypto_box_beforenm(theirPublicKey, myPrivateKey);
}

export async function encryptWithSharedKey(
  message: string,
  sharedKey: Uint8Array
): Promise<Uint8Array> {
  await ensureReady();
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const cipher = sodium.crypto_box_easy_afternm(message, nonce, sharedKey);
  const encrypted = new Uint8Array(nonce.length + cipher.length);

  encrypted.set(nonce, 0);
  encrypted.set(cipher, nonce.length);

  return encrypted;
}

export async function decryptWithSharedKey(
  encrypted: Uint8Array,
  sharedKey: Uint8Array
): Promise<string> {
  await ensureReady();

  const nonceBytes = sodium.crypto_box_NONCEBYTES;
  const nonce = encrypted.slice(0, nonceBytes);
  const cipher = encrypted.slice(nonceBytes);

  console.log("[decryptWithSharedKey]", {
    encryptedLength: encrypted.length,
    nonceLength: nonce.length,
    cipherLength: cipher.length,
    sharedKeyLength: sharedKey.length,
  });

  const message = sodium.crypto_box_open_easy_afternm(cipher, nonce, sharedKey);
  return sodium.to_string(message);
}


export async function getOrCreateIdentityKeyPair(): Promise<{
    publicKey: Uint8Array;
    privateKey: Uint8Array;
}> {
    await ensureReady();

    const savedPub = localStorage.getItem("identity_publicKey");
    const savedPriv = localStorage.getItem("identity_privateKey");

    if (savedPub && savedPriv) {
        return {
            publicKey: sodium.from_base64(savedPub),
            privateKey: sodium.from_base64(savedPriv)
        };
    }

    const { publicKey, privateKey } = sodium.crypto_kx_keypair();

    localStorage.setItem("identity_publicKey", sodium.to_base64(publicKey));
    localStorage.setItem("identity_privateKey", sodium.to_base64(privateKey));

    return { publicKey, privateKey };
}