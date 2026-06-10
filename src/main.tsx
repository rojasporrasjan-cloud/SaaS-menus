import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppProviders } from '@app/providers/AppProviders'
import { AppRouter } from '@app/router/AppRouter'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found. Check index.html.')

createRoot(root).render(
  <StrictMode>
    <AppProviders>
      <AppRouter />
    </AppProviders>
  </StrictMode>,
)
