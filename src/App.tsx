// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Messenger from './pages/Messenger';
import ThreadView from './components/ThreadView';
import SignUp from './pages/SignUp';
import TwoFactor from './pages/TwoFactor';
import NavBar from './components/NavBar';
import SignIn from './pages/SignIn';
import ConfirmEmail from './pages/ConfirmEmail';

export default function App() {
  // Use different basename for Vercel vs GitHub Pages
  // Check for Vercel environment or hostname
  const isVercel = import.meta.env.VITE_VERCEL || 
                   (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'));
  const basename = isVercel ? '/' : '/whispervault/';
  
  return (
    <BrowserRouter basename={basename}>
      <NavBar />
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 pt-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/thread/:id" element={<ThreadView messages={[]} userId={null} />} />
          <Route path="/messenger" element={<Messenger />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/2fa" element={<TwoFactor />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/confirm/:token" element={<ConfirmEmail />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
