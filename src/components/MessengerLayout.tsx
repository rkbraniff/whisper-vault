import type { ReactNode } from 'react';

interface Contact {
  id: string;
  name: string;
  avatarUrl?: string;
  status: 'online' | 'away' | 'offline';
}

interface ContactSidebarProps {
  contacts: Contact[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ContactSidebar({ contacts, selectedId, onSelect }: ContactSidebarProps) {
  return (
    <aside className="w-20 lg:w-80 h-full bg-obsidian-light border-r border-violet-deep/20 flex flex-col shadow-xl">
      <div className="p-4 lg:p-6 border-b border-violet-deep/10">
        <h2 className="hidden lg:block text-whisper font-sigil text-lg tracking-wide mb-2">Contacts</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`
              w-full flex items-center gap-3 px-2 py-2 lg:px-4 lg:py-3
              hover:bg-violet-deep/10 transition-colors
              ${selectedId === c.id ? 'bg-violet-deep/20' : ''}
            `}
          >
            <div className="relative">
              {c.avatarUrl ? (
                <img src={c.avatarUrl} alt={c.name} className="w-10 h-10 rounded-full object-cover border-2 border-violet-deep/30" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-deep to-violet-soft flex items-center justify-center text-whisper font-sigil text-lg">
                  {c.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-obsidian ${c.status === 'online' ? 'bg-green-500' : c.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'}`}></span>
            </div>
            <div className="hidden lg:block flex-1 text-left">
              <div className="text-whisper font-whisper text-base font-semibold truncate">{c.name}</div>
              <div className="text-whisper-dim text-xs font-ritual truncate">{c.status}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="p-2 lg:p-4 border-t border-violet-deep/10">
        <button className="w-full p-2 rounded-xl bg-violet-deep/20 text-whisper-dim hover:bg-violet-deep/30 transition-colors font-whisper text-sm font-semibold shadow">+ New Chat</button>
      </div>
    </aside>
  );
}

interface MessengerLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right?: ReactNode;
}

export function MessengerLayout({ left, center, right }: MessengerLayoutProps) {
  return (
    <div className="flex h-screen w-screen bg-obsidian overflow-hidden">
      {left}
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-obsidian to-obsidian-light">
        <div className="w-full max-w-2xl h-full flex flex-col shadow-2xl bg-obsidian-light rounded-2xl overflow-hidden border border-violet-deep/10">
          {center}
        </div>
      </main>
      {right}
    </div>
  );
}
