import { useState } from "react";
import { motion } from "framer-motion";

/**
 * VaultGate - Landing lock screen for WhisperVault
 * Sigil-based login: username, password, and (optional) gesture canvas
 * "Rite Mode" ceremonial toggle (stretch goal)
 */
export default function VaultGate() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [riteMode, setRiteMode] = useState(false);
  // Placeholder for gesture canvas state

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian relative overflow-hidden">
      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-noise z-0" aria-hidden="true" />
      {/* Cathedral sigil */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 flex flex-col items-center z-10"
      >
        <div className="text-ember text-6xl md:text-7xl font-sigil drop-shadow-lg select-none">◊</div>
        <h1 className="text-whisper font-sigil text-3xl md:text-4xl font-bold tracking-widest mt-4 mb-2 text-center">
          WhisperVault
        </h1>
        <div className="text-whisper-dim font-ritual text-base md:text-lg text-center max-w-xl">
          Enter the sacred vault. Your whispers are sealed by cryptographic sigils.
        </div>
      </motion.div>
      {/* Login form */}
      <motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        className="bg-obsidian-light/80 border border-violet-deep/20 rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-6 w-full max-w-md z-10"
        onSubmit={e => { e.preventDefault(); /* handle login */ }}
      >
        <label className="flex flex-col gap-2">
          <span className="font-ritual text-whisper-dim text-sm">Sigil Name</span>
          <input
            type="text"
            className="rounded-xl px-4 py-3 bg-obsidian border border-violet-deep/30 text-whisper font-whisper focus:ring-2 focus:ring-ember/60 focus:border-ember/60 transition-all outline-none"
            placeholder="Enter your sigil name"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-ritual text-whisper-dim text-sm">Secret Phrase</span>
          <input
            type="password"
            className="rounded-xl px-4 py-3 bg-obsidian border border-violet-deep/30 text-whisper font-whisper focus:ring-2 focus:ring-ember/60 focus:border-ember/60 transition-all outline-none"
            placeholder="Enter your secret phrase"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        {/* Gesture canvas placeholder */}
        <div className="h-16 bg-gradient-to-br from-violet-deep/10 to-ember/10 rounded-xl flex items-center justify-center text-whisper-dim font-ritual text-xs select-none">
          (Gesture canvas coming soon)
        </div>
        {/* Rite Mode toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={riteMode}
            onChange={e => setRiteMode(e.target.checked)}
            className="accent-ember w-5 h-5 rounded focus:ring-ember/60 border-violet-deep/30"
          />
          <span className="font-ritual text-whisper-dim text-sm">Rite Mode (ceremonial login)</span>
        </label>
        <button
          type="submit"
          className="mt-2 py-3 rounded-xl bg-violet-deep text-whisper font-whisper font-semibold text-lg shadow hover:bg-violet-deep/90 focus:outline-none focus:ring-2 focus:ring-ember/60 focus:ring-offset-2 transition-all"
        >
          Enter the Vault
        </button>
      </motion.form>
      {/* Footer */}
      <div className="mt-12 text-center text-whisper-dim font-ritual text-xs z-10">
        &copy; {new Date().getFullYear()} WhisperVault • Cathedral of Secrecy
      </div>
    </div>
  );
}
