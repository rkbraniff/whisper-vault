import ChatBubble from "./ChatBubble";
import type { Message } from "../types/types";

/**
 * ChatThread component - The Chamber of Whispers
 * Renders the sacred scroll of messages with mythic aesthetics
 */
export default function ChatThread({
  messages,
  userId,
}: {
  messages: Message[];
  userId: string | null;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Cathedral Atmosphere Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-deep/5 via-transparent to-ember/5 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 bg-gradient-to-t from-whisper-dim/5 to-transparent pointer-events-none" />
      
      {/* Main chat scrollable area */}
      <div className="flex-1 flex flex-col justify-end overflow-y-auto px-2 py-4 lg:px-8 lg:py-8 max-w-2xl w-full mx-auto relative z-10">
        {messages.length === 0 ? (
          <div className="text-center mt-16 lg:mt-32 animate-fade-in">
            {/* Grand Empty State */}
            <div className="mb-12">
              <div className="text-violet-deep text-6xl lg:text-8xl mb-8 animate-pulse-breath">
                ◊
              </div>
              <h2 className="text-whisper font-sigil text-2xl lg:text-3xl mb-6 tracking-wide">
                The Sacred Vault Awaits
              </h2>
              <p className="text-whisper-dim font-ritual text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                Within these obsidian walls, your whispers shall be sealed with cryptographic sigils,
                protected by the ancient art of libsodium encryption. Each message becomes a sacred
                relic, bound in mathematical perfection.
              </p>
            </div>
            
            {/* Mystical Call to Action */}
            <div className="text-shadow font-whisper text-sm lg:text-base opacity-75">
              Speak your first secret into the void, and let it be transformed into eternal cipher...
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} userId={userId} />
            ))}
            
            {/* Scroll indicator */}
            <div className="text-center py-4">
              <div className="text-whisper-dim text-xs font-ritual opacity-50">
                — end of whispered secrets —
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
