import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'

import { createMockJwt, MOCK_USERS } from '@/mocks/fixtures/users'
import { API_BASE } from '@/mocks/problem'
import { server } from '@/mocks/server'

import { setAccessToken } from './auth-token'
import { apiClient } from './client'

interface MeResponse {
  id: string
}

describe('single-flight token refresh', () => {
  beforeEach(() => {
    setAccessToken('expired-token')
  })

  it('queues concurrent 401 TOKEN_EXPIRED responses behind exactly one refresh call', async () => {
    let refreshCallCount = 0
    server.use(
      http.post(`${API_BASE}/auth/refresh`, () => {
        refreshCallCount += 1
        const user = MOCK_USERS['demo@halcyoncinemas.com']!
        return HttpResponse.json({ accessToken: createMockJwt(user), expiresIn: 900 })
      }),
    )

    const responses = await Promise.all(
      Array.from({ length: 5 }, () => apiClient.get<MeResponse>('/me')),
    )

    expect(refreshCallCount).toBe(1)
    for (const response of responses) {
      expect(response.data.id).toBe(MOCK_USERS['demo@halcyoncinemas.com']!.id)
    }
  })

  it('does not attempt a refresh for a bare UNAUTHENTICATED 401', async () => {
    setAccessToken(null)

    let refreshCallCount = 0
    server.use(
      http.post(`${API_BASE}/auth/refresh`, () => {
        refreshCallCount += 1
        return HttpResponse.json({ accessToken: 'unused', expiresIn: 900 })
      }),
    )

    await expect(apiClient.get('/me')).rejects.toMatchObject({ code: 'UNAUTHENTICATED' })
    expect(refreshCallCount).toBe(0)
  })
})
