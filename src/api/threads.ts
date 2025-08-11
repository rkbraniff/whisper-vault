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

import { useAuthedFetch } from './useAuthedFetch';

export const useListThreads = () => {
  const authedFetch = useAuthedFetch();
  return async (): Promise<ThreadSummary[]> => {
  const res = await authedFetch('/api/threads');
    if (!res.ok) throw new Error(`Failed to fetch threads: ${res.status}`);
    return res.json();
  };
};

import { apiFetch } from './api';

export const createThread = async (
  body: NewThreadBody
): Promise<ThreadSummary> =>
  apiFetch('/api/threads', {
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
