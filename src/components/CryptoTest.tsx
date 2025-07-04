import { useEffect, useState } from "react";
import {
  generateKeyPair,
  encryptMessage,
  decryptMessage,
  deriveSharedKey,
  encryptWithSharedKey,
  decryptWithSharedKey,
} from "../crypto/crypto";
import sodium from "libsodium-wrappers";

export default function CryptoTest() {
  const [publicKey, setPublicKey] = useState<Uint8Array | null>(null);
  const [privateKey, setPrivateKey] = useState<Uint8Array | null>(null);
  const [message, setMessage] = useState("");
  const [encrypted, setEncrypted] = useState<Uint8Array | null>(null);
  const [encryptedBase64, setEncryptedBase64] = useState<string | null>(null);
  const [decrypted, setDecrypted] = useState<string | null>(null);
  const [useSharedKey, setUseSharedKey] = useState(false);
  const [bobPublicKey, setBobPublicKey] = useState<Uint8Array | null>(null);
  const [bobPrivateKey, setBobPrivateKey] = useState<Uint8Array | null>(null);

  useEffect(() => {
    generateKeyPair().then(({ publicKey, privateKey }) => {
      setPublicKey(publicKey);
      setPrivateKey(privateKey);
    });

    generateKeyPair().then(({ publicKey, privateKey }) => {
      setBobPublicKey(publicKey);
      setBobPrivateKey(privateKey);
    });
  }, []);

  async function handleEncrypt() {
    let encryptedData: Uint8Array;

    if (publicKey && privateKey) {
      try {
        if (useSharedKey && bobPublicKey) {
          console.log("Encrypting with:", {
            alicePrivate: privateKey,
            bobPubic: bobPublicKey,
          });
          const aliceSharedKey = await deriveSharedKey(privateKey, bobPublicKey);
          const bobSharedKey = await deriveSharedKey(bobPrivateKey!, publicKey!);
          const same = sodium.memcmp(aliceSharedKey, bobSharedKey)
          console.log("Shared keys match?", same);
          if (!same) {
            console.warn("Shared keys do NOT match!")
          }
          encryptedData = await encryptWithSharedKey(message, aliceSharedKey);
        } else {
          encryptedData = await encryptMessage(message, publicKey, privateKey);
        }

        setEncrypted(encryptedData);
        await sodium.ready;
        const b64 = sodium.to_base64(encryptedData);
        setEncryptedBase64(b64);
      } catch (err) {
        console.error("Encryption failed", err);
      }
    }
  }

  async function handleDecrypt() {
    if (publicKey && privateKey && encrypted) {
      let clear: string;

      try {
        if (useSharedKey && bobPrivateKey && publicKey) {
          console.log("Decrypting with:", {
            bobPrivate: bobPrivateKey,
            alicePublic: publicKey,
          });
          const sharedKey = await deriveSharedKey(bobPrivateKey, publicKey);
          clear = await decryptWithSharedKey(encrypted, sharedKey);
        } else {
          clear = await decryptMessage(encrypted, publicKey, privateKey);
        }
        setDecrypted(clear);
      } catch (err) {
        console.error("Decryption Failed:", err);
      }
    }
  }

  return (
    <div className="p-6 text-white space-y-4 bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold">🧪 Crypto Test</h2>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        className="w-full p-2 text-black rounded"
      />

      <div className="flex gap-4">
        <button
          onClick={handleEncrypt}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded"
        >
          Encrypt
        </button>
        <button
          onClick={handleDecrypt}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
        >
          Decrypt
        </button>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useSharedKey}
            onChange={(e: {
              target: { checked: boolean | ((prevState: boolean) => boolean) };
            }) => setUseSharedKey(e.target.checked)}
          />
          Use Shared Key
        </label>
      </div>

      <div>
        <h3 className="font-semibold">🔒 Encrypted:</h3>
        <pre className="whitespace-pre-wrap break-all text-sm">
          {encryptedBase64 ?? "..."}
        </pre>
      </div>

      <div>
        <h3 className="font-semibold">🔓 Decrypted:</h3>
        <p>{decrypted ?? "..."}</p>
      </div>
    </div>
  );
}
