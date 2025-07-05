import { motion } from "framer-motion";

/**
 * Floating Action Button - Send a Whisper
 */
export default function SendWhisperFAB({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, boxShadow: "0 0 16px #F5C97E77" }}
      whileTap={{ scale: 0.96 }}
      className="rounded-full bg-ember text-obsidian font-sigil text-2xl shadow-lg px-7 py-5 focus:outline-none focus:ring-2 focus:ring-ember/60 focus:ring-offset-2 transition-all border-2 border-ember/40"
      aria-label="Send a Whisper"
      onClick={onClick}
    >
      ✉️
    </motion.button>
  );
}
