import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import WhispersPane from '../components/Dashboard/WhispersPane';
import SigilsPane from '../components/Dashboard/SigilsPane';
import KeysLocksPane from '../components/Dashboard/KeysLocksPane';
import SendWhisperFAB from '../components/Dashboard/SendWhisperFAB';

export default function Dashboard() {
  const nav = useNavigate();
  return (
    <motion.div
      className="min-h-screen bg-obsidian text-textPale font-body"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex gap-4 mb-6">
        <button className="bg-violetDeep px-4 py-2 rounded" onClick={() => nav('/signup')}>Sign Up</button>
        <button className="bg-ember px-4 py-2 rounded" onClick={() => nav('/2fa')}>2FA</button>
        <button className="bg-gray-700 px-4 py-2 rounded" onClick={() => nav('/messenger')}>Messenger</button>
        <button className="bg-gray-700 px-4 py-2 rounded" onClick={() => nav('/')}>Home</button>
      </div>
      <div className="grid lg:grid-cols-3 gap-6 p-6 lg:p-8">
        <WhispersPane className="col-span-2" />
        <SigilsPane />
        <KeysLocksPane className="lg:col-span-3" />
        <SendWhisperFAB />
      </div>
    </motion.div>
  );
}
