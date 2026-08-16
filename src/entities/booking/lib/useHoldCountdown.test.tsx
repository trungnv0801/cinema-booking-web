import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { API_BASE } from '@/mocks/problem'
import { server } from '@/mocks/server'

import { useHoldCountdown } from './useHoldCountdown'

const HOLD_GROUP = 'hold-test-1'

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}

describe('useHoldCountdown', () => {
  it('re-seeds expiresAt from the server on visibilitychange, not from the original local value', async () => {
    let callCount = 0
    const firstExpiresAt = new Date(Date.now() + 300_000).toISOString()
    const secondExpiresAt = new Date(Date.now() + 30_000).toISOString()

    server.use(
      http.get(`${API_BASE}/holds/:holdGroup`, () => {
        callCount += 1
        const expiresAt = callCount === 1 ? firstExpiresAt : secondExpiresAt
        return HttpResponse.json({
          holdGroup: HOLD_GROUP,
          screeningId: 'screening-1',
          seats: [],
          expiresAt,
          remainingSeconds: Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000),
        })
      }),
    )

    const { result } = renderHook(() => useHoldCountdown(HOLD_GROUP), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.expiresAt).toBe(firstExpiresAt))
    expect(callCount).toBe(1)

    document.dispatchEvent(new Event('visibilitychange'))

    await waitFor(() => expect(result.current.expiresAt).toBe(secondExpiresAt))
    expect(callCount).toBe(2)
  })

  it('reports isExpired once the server returns 410 HOLD_EXPIRED', async () => {
    server.use(
      http.get(`${API_BASE}/holds/:holdGroup`, () =>
        HttpResponse.json(
          { code: 'HOLD_EXPIRED', status: 410, title: 'Hold expired', traceId: 't1' },
          { status: 410, headers: { 'Content-Type': 'application/problem+json' } },
        ),
      ),
    )

    const { result } = renderHook(() => useHoldCountdown(HOLD_GROUP), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isExpired).toBe(true))
  })
})
