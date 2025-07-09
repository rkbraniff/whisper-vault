import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './globals.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'

const qc = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={qc}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
)
