// Types ---------------------------------------------------

export interface ThreadSummary {
  id: string;
  title: string;
  last: string;
  ts: number;
}

export interface NewThreadBody {
  title: string;
  participants: string[];
}

export interface NewMessageBody {
  senderId: string;
  ciphertext: string;
  nonce: string;
}

// API helpers --------------------------------------------

export const listThreads = async (): Promise<ThreadSummary[]> =>
  fetch('/api/threads').then(r => r.json());

export const createThread = async (
  body: NewThreadBody
): Promise<ThreadSummary> =>
  fetch('/api/threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json());

export const getThread = async (
  id: string
): Promise<ThreadSummary & { messages: unknown[] }> =>
  fetch(`/api/threads/${id}`).then(r => r.json());

export const addMessage = async (
  id: string,
  msg: NewMessageBody
): Promise<void> =>
  fetch(`/api/threads/${id}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
  }).then(() => undefined);
