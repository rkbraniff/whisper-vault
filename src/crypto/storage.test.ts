import { describe, it, expect } from 'vitest';
import { saveKey, loadKey } from '../../server-1/src/crypto/storage';

const key = new Uint8Array([1, 2, 3, 4, 5]);
const id = 'test-key';

describe('storage', () => {
  it('saves and loads a key', async () => {
    await saveKey(id, key);
    const loaded = await loadKey(id);
    expect(loaded).not.toBeNull();
    expect(Array.from(loaded!)).toEqual(Array.from(key));
  });

  it('returns null for missing key', async () => {
    const missing = await loadKey('no-such-key');
    expect(missing).toBeNull();
  });
});
