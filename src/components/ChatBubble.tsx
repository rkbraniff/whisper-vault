import { motion, useReducedMotion, easeInOut, easeOut } from "framer-motion";
import type { Message } from "../types/types";

/**
 * ChatBubble component - A whisper rendered as a mystical scroll
 * Each message appears as a glyph block with ritual metadata
 *
 * Props:
 * - message: Message object (id, sender, content, timestamp)
 * - userId: string | null (current user's id)
 *
 * Styling follows the Mythic Aesthetic:
 * - User messages: ember-highlighted (your whispers)
 * - Others: violet-deep (received whispers)
 *
 * Animations:
 * - Entrance: fade in + slide up (8–12px)
 * - Hover: slow pulse scale and ember glow
 * - Respects prefers-reduced-motion
 */
export default function ChatBubble({
  message,
  userId,
}: {
  message: Message;
  userId: string | null;
}) {
  const isMe = message.sender === userId;
  const shouldReduceMotion = useReducedMotion();

  // Format timestamp for ritual metadata
  const timeString = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Animation variants
  const variants = {
    initial: shouldReduceMotion
      ? {}
      : { opacity: 0, y: 12 },
    animate: shouldReduceMotion
      ? {}
      : { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
    whileHover: shouldReduceMotion
      ? {}
      : {
          scale: 1.03,
          boxShadow: isMe
            ? "0 0 8px 0 #F5C97E59"
            : "0 0 8px 0 #5E4B8B59",
          transition: { duration: 0.4, ease: easeInOut },
        },
  };

  return (
    <motion.div
      className={`flex ${isMe ? "justify-end" : "justify-start"} group`}
      initial="initial"
      animate="animate"
      whileHover="whileHover"
      variants={variants}
      aria-live="polite"
    >
      <div className="relative max-w-md w-full">
        {/* Main Message Scroll */}
        <div
          className={[
            "relative rounded-2xl px-5 py-4 shadow-xl ring-1 ring-inset ring-obsidian/40 transition-all duration-500 ease-in-out font-whisper",
            "hover:shadow-ember-glow",
            isMe
              ? "bg-gradient-to-br from-ember/90 via-ember-dim/80 to-obsidian/80 text-obsidian border border-ember/40"
              : "bg-gradient-to-br from-violet-deep/90 via-violet-soft/80 to-obsidian/80 text-whisper border border-violet-deep/40"
          ].join(" ")}
          aria-label={isMe ? "Your whisper" : `Whisper from ${message.sender}`}
        >
          {/* Message Content */}
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
          {/* Noise Overlay */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-10 bg-noise" aria-hidden="true" />
        </div>
        {/* Ritual Metadata Tooltip */}
        <div
          className={[
            "absolute -top-10 px-4 py-2 rounded-xl text-xs font-ritual shadow-lg bg-obsidian-light/95 text-whisper-dim border border-violet-deep/30 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-300 backdrop-blur-md z-20",
            isMe ? "right-4" : "left-4"
          ].join(" ")}
        >
          <div className="flex items-center space-x-2">
            <span>{timeString}</span>
            <span className="text-violet-deep">•</span>
            <span className="text-ember">sealed</span>
            <span className="text-violet-deep">•</span>
            <span className="text-xs" role="img" aria-label="encrypted">🔒</span>
          </div>
        </div>
        {/* Ember Glow Animation for User Messages */}
        {isMe && (
          <div className="absolute inset-0 rounded-2xl animate-glow-ember opacity-20 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
}
