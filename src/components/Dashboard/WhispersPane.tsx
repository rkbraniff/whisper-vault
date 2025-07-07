import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockThreads } from '../../mocks/threads';

interface WhispersPaneProps {
  className?: string;
}

const WhispersPane: React.FC<WhispersPaneProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  return (
    <section
      className={`rounded-2xl bg-obsidian-light/60 border border-violetDeep/30 shadow-xl p-6 ${className}`}
      aria-label="Recent Whispers"
    >
      <div className="text-lg font-semibold mb-4">Whispers</div>
      <ul className="space-y-2">
        {mockThreads.length === 0 ? (
          <li className="text-whisper-dim">No threads yet.</li>
        ) : (
          mockThreads.slice(0, 10).map((thread) => (
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
          ))
        )}
      </ul>
    </section>
  );
};

export default WhispersPane;
