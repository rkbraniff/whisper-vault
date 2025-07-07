import { motion } from 'framer-motion';
import WhispersPane from '../components/Dashboard/WhispersPane';
import SigilsPane from '../components/Dashboard/SigilsPane';
import KeysLocksPane from '../components/Dashboard/KeysLocksPane';
import SendWhisperFAB from '../components/Dashboard/SendWhisperFAB';

export default function Dashboard() {
  return (
    <motion.div
      className="min-h-screen bg-obsidian text-textPale font-body"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="grid lg:grid-cols-3 gap-6 p-6 lg:p-8">
        <WhispersPane className="col-span-2" />
        <SigilsPane />
        <KeysLocksPane className="lg:col-span-3" />
        <SendWhisperFAB />
      </div>
    </motion.div>
  );
}
