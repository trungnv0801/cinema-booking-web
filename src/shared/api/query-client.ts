import { QueryClient } from '@tanstack/react-query'

import { isApiError } from '@/shared/api/types'

const DEFAULT_RETRY_DELAY_MS = 1000

function retryDelay(attemptIndex: number, error: unknown): number {
  if (isApiError(error) && error.code === 'RATE_LIMIT_EXCEEDED') {
    const retryAfter = error.extensions.retryAfter
    if (typeof retryAfter === 'string') {
      const seconds = Number(retryAfter)
      if (!Number.isNaN(seconds)) return seconds * 1000
      const dateMs = Date.parse(retryAfter)
      if (!Number.isNaN(dateMs)) return Math.max(dateMs - Date.now(), 0)
    }
  }
  return Math.min(DEFAULT_RETRY_DELAY_MS * 2 ** attemptIndex, 30_000)
}

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (isApiError(error)) {
    if (error.status === 429) return failureCount < 1
    if (error.status >= 400 && error.status < 500) return false
  }
  return failureCount < 1
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay,
      refetchOnWindowFocus: false,
      staleTime: 60_000,
    },
    mutations: {
      retry: 0,
    },
  },
})
