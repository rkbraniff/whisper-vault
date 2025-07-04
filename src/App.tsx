// src/App.tsx
import CryptoTest from './components/CryptoTest'
import Messenger from './pages/Messenger'

export default function App() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <Messenger />
    </main>
  )
}
