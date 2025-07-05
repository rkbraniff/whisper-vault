import { useState, useEffect } from "react";
import ChatThread from "../components/ChatThread";
import ChatInput from "../components/ChatInput";
import type { Message } from "../types/types";
import { getOrCreateIdentityKeyPair } from "../crypto/crypto";
import sodium from "libsodium-wrappers";

const DUMMY_CONTACTS = [
  { id: '1', name: 'Meredith LG', avatar: '/avatar1.png', status: 'online' as const, lastMessage: 'Lemme get through today and se...' },
  { id: '2', name: 'My GoodTime Gal', avatar: '/avatar2.png', status: 'online' as const, lastMessage: 'You sent an attachment...' },
  { id: '3', name: 'Apparition 2025', avatar: '/avatar3.png', status: 'away' as const, lastMessage: 'Edward: Excellent - 16h' },
  { id: '4', name: 'Aaron Rose', avatar: '/avatar4.png', status: 'offline' as const, lastMessage: 'You: Crickets. I\'m plugging awa...' },
  // ...add more contacts as needed
];

function SidebarChats({ contacts, selectedId, onSelect }: any) {
  return (
    <div className="flex-1 overflow-y-auto p-2 bg-obsidian-light">
      <input
        className="w-full p-2 mb-3 rounded bg-obsidian text-whisper text-sm"
        placeholder="Search Messenger"
      />
      {contacts.map((chat: any) => (
        <button
          key={chat.id}
          onClick={() => onSelect(chat.id)}
          className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg mb-1 transition-colors
            ${selectedId === chat.id ? "bg-violet-deep/20" : "hover:bg-violet-deep/10"}`}
        >
          <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full object-cover" />
          <div className="flex-1 text-left min-w-0">
            <div className="text-whisper font-semibold truncate">{chat.name}</div>
            <div className="text-whisper-dim text-xs truncate">{chat.lastMessage}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function ChatHeader({ name, avatar, status }: { name: string; avatar: string; status: string }) {
  return (
    <div className="flex items-center gap-3">
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <div className="text-whisper font-semibold">{name}</div>
        <div className="text-whisper-dim text-xs">{status}</div>
      </div>
      <div className="ml-auto flex gap-2">
        <button className="p-2 rounded-full hover:bg-violet-deep/10"><span role="img" aria-label="call">📞</span></button>
        <button className="p-2 rounded-full hover:bg-violet-deep/10"><span role="img" aria-label="video">🎥</span></button>
        <button className="p-2 rounded-full hover:bg-violet-deep/10"><span role="img" aria-label="info">ℹ️</span></button>
      </div>
    </div>
  );
}

export default function Messenger() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string>('1');

  useEffect(() => {
    (async () => {
      try {
        await sodium.ready;
        const identity = await getOrCreateIdentityKeyPair();
        const id = sodium.to_base64(identity.publicKey);
        setUserId(id);
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize crypto:", error);
      }
    })();
  }, []);

  function handleSend(content: string) {
    if (!userId) return;
    const newMessage: Message = {
      content,
      sender: userId,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-obsidian">
        <div className="text-center animate-fade-in">
          <div className="text-violet-deep text-3xl mb-4 animate-pulse-breath">◊</div>
          <div className="text-whisper-dim font-ritual">Initializing the Vault...</div>
          <div className="text-shadow font-whisper text-sm mt-2">Generating your sigil keys</div>
        </div>
      </div>
    );
  }

  const selected = DUMMY_CONTACTS.find(c => c.id === selectedContact)!;

  return (
    <div className="flex h-screen w-screen bg-obsidian overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-80 bg-obsidian-light border-r border-violet-deep/20 flex flex-col">
        <SidebarChats contacts={DUMMY_CONTACTS} selectedId={selectedContact} onSelect={setSelectedContact} />
      </aside>
      {/* Main area */}
      <main className="flex-1 flex flex-col h-full">
        {/* Top header */}
        <div className="h-16 flex items-center px-6 border-b border-violet-deep/20 bg-obsidian-light shadow z-10">
          <ChatHeader name={selected.name} avatar={selected.avatar} status={selected.status} />
        </div>
        {/* Chat area + input */}
        <div className="flex-1 flex flex-col relative min-h-0">
          {/* Noise overlay for mythic atmosphere */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-noise z-0" aria-hidden="true" />
          {/* Scrollable chat thread */}
          <div className="flex-1 overflow-y-auto px-0 py-0 flex flex-col justify-end max-w-2xl mx-auto w-full z-10">
            <ChatThread messages={messages} userId={userId} />
          </div>
          {/* Sticky input at bottom */}
          <div className="sticky bottom-0 left-0 w-full bg-obsidian-light/95 border-t border-violet-deep/20 z-20">
            <div className="max-w-2xl mx-auto w-full p-4">
              <ChatInput onSend={handleSend} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
