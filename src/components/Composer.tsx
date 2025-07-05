import { useState } from "react";
import { motion } from "framer-motion";

/**
 * Composer - Write message component for WhisperVault
 * Textarea, optional voice-to-text, realtime character count
 * “Seal This Message” triggers lock animation and sets sealed=true
 */
export default function Composer({
  onSend,
  maxLength = 2048,
}: {
  onSend: (msg: string) => void;
  maxLength?: number;
}) {
  const [text, setText] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [sealed, setSealed] = useState(false);

  function handleSend() {
    if (!text.trim()) return;
    setSealed(true);
    setTimeout(() => {
      onSend(text);
      setText("");
      setSealed(false);
      setIsComposing(false);
    }, 600); // lock animation duration
  }

  return (
    <div className="relative w-full">
      {/* Lock animation overlay */}
      {sealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-obsidian/80 z-20 rounded-2xl"
        >
          <motion.div
            initial={{ scale: 0.7, rotate: -10 }}
            animate={{ scale: 1.1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-6xl text-ember drop-shadow-lg animate-pulse-breath"
            aria-label="Message sealed"
          >
            🔒
          </motion.div>
        </motion.div>
      )}
      <div className="bg-gradient-to-r from-obsidian-light to-obsidian border-t border-violet-deep/30 p-6 lg:p-8 rounded-2xl shadow-xl relative z-10">
        <div className="flex items-end gap-4">
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              onFocus={() => setIsComposing(true)}
              onBlur={() => !text.trim() && setIsComposing(false)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={isComposing ? 4 : 2}
              maxLength={maxLength}
              className="w-full p-6 rounded-2xl resize-none bg-obsidian border-2 border-violet-deep/40 text-whisper placeholder-shadow font-whisper text-base leading-relaxed focus:outline-none focus:border-violet-deep focus:ring-4 focus:ring-violet-deep/20 transition-all duration-500 ease-in-out hover:border-violet-deep/60 hover:shadow-lg hover:shadow-violet-deep/10 min-h-[80px]"
              placeholder={isComposing ? "Inscribe your whisper upon the void...\n\nPress Enter to seal and send, Shift+Enter for new line" : "What mysteries shall you entrust to the vault?"}
              disabled={sealed}
            />
            {/* Character Count */}
            {isComposing && text.length > 0 && (
              <div className="absolute bottom-2 right-4 text-xs text-whisper-dim font-ritual">
                {text.length} / {maxLength} glyphs
              </div>
            )}
            {/* Subtle Inner Glow */}
            {isComposing && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-deep/5 to-ember/5 pointer-events-none" />
            )}
          </div>
          {/* Voice-to-text button (placeholder) */}
          <button
            className="p-4 rounded-xl bg-violet-deep/20 text-violet-deep hover:bg-violet-deep/30 transition-colors font-sigil text-2xl"
            title="Voice to text (coming soon)"
            tabIndex={-1}
            disabled
          >
            🎤
          </button>
          {/* Seal This Message button */}
          <button
            onClick={handleSend}
            disabled={!text.trim() || sealed}
            className="px-8 py-5 rounded-2xl bg-gradient-to-r from-ember via-ember-dim to-ember text-obsidian font-whisper font-semibold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 hover:shadow-xl hover:shadow-ember/40 active:scale-95 transition-all duration-300 ease-in-out border border-ember/50 relative overflow-hidden min-w-[140px] focus:outline-none focus:ring-2 focus:ring-ember/60 focus:ring-offset-2"
            aria-label="Seal This Message"
          >
            <span className="relative z-10 tracking-wide">Seal &amp; Send</span>
            {/* Button Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-ember/30 to-ember-dim/30 animate-pulse-breath" />
          </button>
        </div>
      </div>
    </div>
  );
}
