import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Floating Action Button - Send a Whisper
 */
export default function SendWhisperFAB() {
  const navigate = useNavigate();
  return (
    <motion.button
      whileHover={{ scale: 1.08, boxShadow: "0 0 16px 4px #FF6A3D88, 0 0 32px 8px #FF6A3D44" }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-ember glow-ember flex items-center justify-center text-3xl text-white animate-pulse-ember focus:outline-none focus:ring-2 focus:ring-ember"
      aria-label="Send Whisper"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate("/thread/new");
        }
      }}
      onClick={() => navigate("/thread/new")}
    >
      <span aria-hidden="true">✦</span>
    </motion.button>
  );
}
