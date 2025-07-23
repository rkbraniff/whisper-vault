import React from 'react';

interface KeysLocksPaneProps {
  className?: string;
}

const KeysLocksPane: React.FC<KeysLocksPaneProps> = ({ className = '' }) => {
  // TODO: Replace with real key
  const pubKey = 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890';
  const shortKey = pubKey.slice(0, 6) + '…' + pubKey.slice(-6);

  return (
    <section
      className={`rounded-2xl bg-obsidian-light/60 border border-violetDeep/30 glow-violet p-6 flex items-center justify-between ${className}`}
      aria-label="Identity Key"
    >
      <div>
        <div className="font-semibold mb-1">Identity Key</div>
        <div className="font-mono text-sm select-all">{shortKey}</div>
      </div>
      <button
        className="ml-4 px-4 py-2 rounded-lg bg-violetDeep text-white font-semibold glow-violet focus:outline-none focus:ring-2 focus:ring-ember"
        aria-label="Export PubKey"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { navigator.clipboard.writeText(pubKey); } }}
        onClick={() => { navigator.clipboard.writeText(pubKey); }}
      >
        Export PubKey
      </button>
    </section>
  );
};

export default KeysLocksPane;
