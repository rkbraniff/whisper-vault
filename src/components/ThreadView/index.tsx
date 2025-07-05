// Ensure GlyphMessage.tsx exists in the same folder, or update the path if it's elsewhere
import GlyphMessage from "./GlyphMessage.tsx";
import type { Message } from "../../types/types";
import { useState } from "react";

/**
 * ThreadView - Individual conversation view for WhisperVault
 * Renders messages as <GlyphMessage /> components
 * Handles encrypted state (blurred until hovered/focused)
 * Shows metadata popover on hover
 */
export default function ThreadView({
  messages,
  userId,
}: {
  messages: Message[];
  userId: string | null;
}) {
  // Track which message is focused/hovered for decryption effect
  const [focusedId, setFocusedId] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-obsidian via-obsidian-light to-obsidian overflow-hidden">
      <div className="flex-1 flex flex-col justify-end space-y-4 p-4 lg:p-8 max-w-2xl w-full mx-auto overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center mt-16 lg:mt-32 animate-fade-in">
            <div className="mb-12">
              <div className="text-violet-deep text-6xl lg:text-8xl mb-8 animate-pulse-breath">◊</div>
              <h2 className="text-whisper font-sigil text-2xl lg:text-3xl mb-6 tracking-wide">No Whispers Yet</h2>
              <p className="text-whisper-dim font-ritual text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
                This thread is silent. Begin the ritual and send your first encrypted whisper.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.map((msg) => (
              <GlyphMessage
                key={msg.id}
                message={msg}
                userId={userId}
                encrypted={focusedId !== msg.id}
                onFocus={() => setFocusedId(msg.id)}
                onBlur={() => setFocusedId(null)}
                onMouseEnter={() => setFocusedId(msg.id)}
                onMouseLeave={() => setFocusedId(null)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
