import { motion } from "framer-motion";
import type { Message } from "../../types/types";

/**
 * GlyphMessage - A single message in ThreadView
 * Handles encrypted state (blurred until hovered/focused)
 * Shows metadata popover on hover
 */
export default function GlyphMessage({
  message,
  userId,
  encrypted,
  onFocus,
  onBlur,
  onMouseEnter,
  onMouseLeave,
}: {
  message: Message;
  userId: string | null;
  encrypted: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const isMe = message.sender === userId;
  const timeString = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
      tabIndex={0}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      aria-live="polite"
    >
      <div className="relative max-w-md w-full">
        <div
          className={[
            "relative rounded-2xl px-5 py-4 shadow-xl ring-1 ring-inset ring-obsidian/40 font-whisper transition-all duration-500 ease-in-out",
            isMe
              ? "bg-gradient-to-br from-ember/90 via-ember-dim/80 to-obsidian/80 text-obsidian border border-ember/40"
              : "bg-gradient-to-br from-violet-deep/90 via-violet-soft/80 to-obsidian/80 text-whisper border border-violet-deep/40",
            encrypted ? "filter blur-sm grayscale opacity-60" : ""
          ].join(" ")}
          aria-label={isMe ? "Your whisper" : `Whisper from ${message.sender}`}
        >
          <div className="text-base leading-relaxed tracking-wide relative z-10">
            {message.content}
          </div>
          {/* Subtle Inner Glow */}
          <div
            className={[
              "absolute inset-0 rounded-2xl opacity-25 pointer-events-none mix-blend-lighten",
              isMe
                ? "bg-gradient-to-t from-ember/40 to-transparent"
                : "bg-gradient-to-t from-violet-deep/40 to-transparent"
            ].join(" ")}
            aria-hidden="true"
          />
        </div>
        {/* Metadata Popover */}
        <div
          className={[
            "absolute -top-10 px-4 py-2 rounded-xl text-xs font-ritual shadow-lg bg-obsidian-light/95 text-whisper-dim border border-violet-deep/30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 backdrop-blur-md z-20",
            isMe ? "right-4" : "left-4"
          ].join(" ")}
        >
          <div className="flex items-center space-x-2">
            <span>{timeString}</span>
            <span className="text-violet-deep">•</span>
            <span className="text-ember">encrypted</span>
            <span className="text-violet-deep">•</span>
            <span className="text-xs" role="img" aria-label="encrypted">🔒</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
