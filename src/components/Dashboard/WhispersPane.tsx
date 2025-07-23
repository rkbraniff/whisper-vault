import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useListThreads } from '../../api/threads';

interface Thread {
  id: string;
  title: string;
  last: string;
}

interface WhispersPaneProps {
  className?: string;
}

const WhispersPane: React.FC<WhispersPaneProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const listThreads = useListThreads();
  const { data: threads, isLoading, isError, error } = useQuery<Thread[], Error>({
    queryKey: ['threads'],
    queryFn: listThreads,
  });

  let content;
  if (isLoading) {
    content = <li className="text-whisper-dim">Loading threads...</li>;
  } else if (isError) {
    let msg = 'Failed to load threads.';
    if (error?.message?.includes('401')) {
      msg = 'You must be signed in to view your threads.';
    }
    content = <li className="text-red-500">{msg}</li>;
  } else if (!threads || threads.length === 0) {
    content = <li className="text-whisper-dim">No threads yet.</li>;
  } else {
    content = threads.slice(0, 10).map((thread) => (
      <li key={thread.id}>
        <button
          className="w-full text-left rounded-lg px-3 py-2 hover:bg-violetDeep/10 focus:outline-none focus:ring-2 focus:ring-ember transition"
          aria-label={`Open thread: ${thread.title}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              navigate(`/thread/${thread.id}`);
            }
          }}
          onClick={() => navigate(`/thread/${thread.id}`)}
        >
          <div className="font-semibold truncate">{thread.title}</div>
          <div className="text-xs text-whisper-dim truncate">{thread.last}</div>
        </button>
      </li>
    ));
  }

  return (
    <section
      className={`rounded-2xl bg-obsidian-light/60 border border-violetDeep/30 glow-violet p-6 ${className}`}
      aria-label="Recent Whispers"
    >
      <div className="text-lg font-semibold mb-4">Whispers</div>
      <ul className="space-y-2">{content}</ul>
    </section>
  );
};

export default WhispersPane;
