import { http, HttpResponse } from 'msw'

import { createMockJwt, findUserByToken, MOCK_USERS } from '../fixtures/users'
import { API_BASE, problem } from '../problem'
import { getMockSessionUser, setMockSessionUser } from '../session'

function getBearerToken(request: Request): string | null {
  const header = request.headers.get('Authorization')
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length)
}

export const authHandlers = [
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { identifier: string; password: string }
    const user = MOCK_USERS[body.identifier]

    if (!user || user.password !== body.password) {
      return problem({
        status: 401,
        code: 'INVALID_CREDENTIALS',
        title: 'Incorrect email or password',
      })
    }

    setMockSessionUser(user.email)

    return HttpResponse.json({
      accessToken: createMockJwt(user),
      expiresIn: 900,
      user: { id: user.id, fullName: user.fullName, roles: user.roles },
    })
  }),

  http.post(`${API_BASE}/auth/refresh`, () => {
    const user = getMockSessionUser()
    if (!user) {
      return problem({ status: 401, code: 'UNAUTHENTICATED', title: 'No refresh session' })
    }
    return HttpResponse.json({ accessToken: createMockJwt(user), expiresIn: 900 })
  }),

  http.post(`${API_BASE}/auth/logout`, () => {
    setMockSessionUser(null)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as {
      fullName: string
      email: string
      phone: string
      password: string
    }
    if (MOCK_USERS[body.email]) {
      return problem({ status: 409, code: 'EMAIL_ALREADY_EXISTS', title: 'Registration conflict' })
    }
    const id = crypto.randomUUID()
    MOCK_USERS[body.email] = {
      id,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      password: body.password,
      roles: ['CUSTOMER'],
      cinemaIds: [],
    }
    return HttpResponse.json({ id, email: body.email, emailVerified: false }, { status: 201 })
  }),

  http.post(`${API_BASE}/auth/forgot-password`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${API_BASE}/auth/reset-password`, () => new HttpResponse(null, { status: 204 })),
  http.post(`${API_BASE}/auth/verify-email`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${API_BASE}/me`, ({ request }) => {
    const token = getBearerToken(request)
    if (!token) return problem({ status: 401, code: 'UNAUTHENTICATED', title: 'Token missing' })
    if (token === 'expired-token') {
      return problem({ status: 401, code: 'TOKEN_EXPIRED', title: 'Access token expired' })
    }

    const user = findUserByToken(token)
    if (!user) return problem({ status: 401, code: 'UNAUTHENTICATED', title: 'Token missing' })

    return HttpResponse.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      emailVerified: true,
      roles: user.roles,
      cinemaIds: user.cinemaIds,
    })
  }),

  http.patch(`${API_BASE}/me`, async ({ request }) => {
    const token = getBearerToken(request)
    const user = findUserByToken(token)
    if (!user) return problem({ status: 401, code: 'UNAUTHENTICATED', title: 'Token missing' })

    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({
      id: user.id,
      fullName: (body.fullName as string) ?? user.fullName,
      email: user.email,
      phone: (body.phone as string) ?? user.phone,
      emailVerified: true,
      roles: user.roles,
      cinemaIds: user.cinemaIds,
    })
  }),
]
