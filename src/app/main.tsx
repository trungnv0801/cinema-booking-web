import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import { App } from './App'

import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@/shared/styles/main.scss'

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_ENABLE_MOCKS === 'false') return
  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

function render() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void enableMocking()
  .catch((error: unknown) => {
    console.error('Failed to start the mock service worker; continuing without mocks.', error)
  })
  .then(render)
