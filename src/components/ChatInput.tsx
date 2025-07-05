import { useState } from "react";

/**
 * ChatInput component - The Whisper Forge
 * Where secrets are crafted before being sealed and sent
 *
 * Props:
 * - onSend: function to handle message sending
 *
 * Features:
 * - Ritual-like compose experience
 * - Breathing hover effects
 * - Seal message button with ember glow
 */
export default function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [text, setText] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  function handleSend() {
    if (!text.trim()) return;
    onSend(text);
    setText("");
    setIsComposing(false);
  }

  function handleFocus() {
    setIsComposing(true);
  }

  function handleBlur() {
    if (!text.trim()) {
      setIsComposing(false);
    }
  }

  return (
    <div className="bg-gradient-to-r from-obsidian-light to-obsidian border-t border-violet-deep/30 p-6 lg:p-8">
      {/* Mystical Atmosphere */}
      {isComposing && (
        <div className="absolute inset-0 bg-gradient-to-r from-violet-deep/5 via-ember/5 to-violet-deep/5 animate-pulse-breath pointer-events-none" />
      )}
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-end gap-4">
          {/* The Sacred Input Scroll - Enhanced Size */}
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={isComposing ? 4 : 2}
              className="
                w-full p-6 rounded-2xl resize-none
                bg-obsidian border-2 border-violet-deep/40
                text-whisper placeholder-shadow
                font-whisper text-base leading-relaxed
                focus:outline-none focus:border-violet-deep focus:ring-4 focus:ring-violet-deep/20
                transition-all duration-500 ease-in-out
                hover:border-violet-deep/60 hover:shadow-lg hover:shadow-violet-deep/10
                min-h-[80px]
              "
              placeholder={isComposing ? "Inscribe your whisper upon the void...\n\nPress Enter to seal and send, Shift+Enter for new line" : "What mysteries shall you entrust to the vault?"}
            />
            
            {/* Character Count */}
            {isComposing && text.length > 0 && (
              <div className="absolute bottom-2 right-4 text-xs text-whisper-dim font-ritual">
                {text.length} glyphs inscribed
              </div>
            )}
            
            {/* Subtle Inner Glow */}
            {isComposing && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-deep/5 to-ember/5 pointer-events-none" />
            )}
          </div>
          
          {/* The Seal of Binding - Enhanced */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="
                px-10 py-6 rounded-2xl
                bg-gradient-to-r from-ember via-ember-dim to-ember
                text-obsidian font-whisper font-semibold text-lg
                disabled:opacity-40 disabled:cursor-not-allowed
                hover:scale-105 hover:shadow-xl hover:shadow-ember/40
                active:scale-95
                transition-all duration-300 ease-in-out
                border border-ember/50
                relative overflow-hidden
                min-w-[140px]
              "
              aria-label="Seal and dispatch your whisper to the void"
            >
              <span className="relative z-10 tracking-wide">Seal & Send</span>
              
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-ember/30 to-ember-dim/30 animate-pulse-breath" />
            </button>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                className="p-3 rounded-xl bg-violet-deep/20 text-violet-deep hover:bg-violet-deep/30 transition-colors"
                title="Encrypt with custom key"
              >
                🔐
              </button>
              <button
                className="p-3 rounded-xl bg-violet-deep/20 text-violet-deep hover:bg-violet-deep/30 transition-colors"
                title="Set message timer"
              >
                ⏱️
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ritual Inscription - Enhanced */}
      {isComposing && (
        <div className="max-w-4xl mx-auto mt-6 text-center animate-fade-in">
          <div className="text-sm text-whisper-dim font-ritual italic opacity-90 mb-2">
            "Your words shall be bound by the sacred mathematics of libsodium, sealed with the sigil of perfect secrecy"
          </div>
          <div className="flex items-center justify-center gap-4 text-xs">
            <span className="text-violet-deep flex items-center gap-1">
              🔒 End-to-end encrypted
            </span>
            <span className="text-ember flex items-center gap-1">
              🛡️ Forward secrecy
            </span>
            <span className="text-whisper-dim flex items-center gap-1">
              👤 Perfect anonymity
            </span>
          </div>
        </div>
      )}
    </div>
  );
}