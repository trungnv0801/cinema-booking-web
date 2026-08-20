import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { AppRouter } from '@/app/router'
import { LoginModal } from '@/entities/session'
import { useSessionBootstrap } from '@/entities/session/lib/useSessionBootstrap'
import { queryClient } from '@/shared/api/query-client'
import { ToastViewport, TooltipProvider } from '@/shared/ui'

import '@/shared/i18n'

export function App() {
  useSessionBootstrap()

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRouter />
        <ToastViewport />
        <LoginModal />
      </TooltipProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
