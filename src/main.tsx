import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TransacoesProvider } from './context/TransacoesContext'

import './index.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TransacoesProvider>
      <App />
    </TransacoesProvider>
  </StrictMode>,
)
