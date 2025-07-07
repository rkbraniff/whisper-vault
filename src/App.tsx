// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Messenger from './pages/Messenger';
import ThreadView from './components/ThreadView';

export default function App() {
  return (
    <BrowserRouter>
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/thread/:id" element={<ThreadView messages={[]} userId={null} />} />
          {/* Fallback: Messenger for legacy/testing */}
          <Route path="/messenger" element={<Messenger />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
