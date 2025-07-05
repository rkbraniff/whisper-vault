import { openDB } from 'idb';

const DB_NAME = 'whispervault';
const STORE_NAME = 'keys';

async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME);
        },
    });
}

export async function saveKey(id: string, key: Uint8Array): Promise<void> {
    const db = await initDB();
    await db.put(STORE_NAME, key, id);
}

export async function loadKey(id: string): Promise<Uint8Array | null> {
    const db = await initDB();
    const key = await db.get(STORE_NAME, id);
    return key ? new Uint8Array(key) : null;
}