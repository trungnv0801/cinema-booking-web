import type { Role } from '@/shared/types/domain'

export interface MockUser {
  id: string
  fullName: string
  email: string
  phone: string
  password: string
  roles: Role[]
  cinemaIds: string[]
}

export const MOCK_USERS: Record<string, MockUser> = {
  'demo@halcyoncinemas.com': {
    id: 'user-customer',
    fullName: 'Alex Rivera',
    email: 'demo@halcyoncinemas.com',
    phone: '0912345678',
    password: 'password',
    roles: ['CUSTOMER'],
    cinemaIds: [],
  },
  'cashier@halcyoncinemas.com': {
    id: 'user-cashier',
    fullName: 'Jamie Chen',
    email: 'cashier@halcyoncinemas.com',
    phone: '0923456789',
    password: 'password',
    roles: ['CASHIER'],
    cinemaIds: ['cinema-mb'],
  },
  'admin@halcyoncinemas.com': {
    id: 'user-admin',
    fullName: 'Morgan Blake',
    email: 'admin@halcyoncinemas.com',
    phone: '0934567890',
    password: 'password',
    roles: ['ADMIN'],
    cinemaIds: [],
  },
}

function base64url(value: object): string {
  return btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function createMockJwt(user: MockUser): string {
  const header = { alg: 'none', typ: 'JWT' }
  const payload = {
    sub: user.id,
    roles: user.roles,
    cinemaIds: user.cinemaIds,
    exp: Math.floor(Date.now() / 1000) + 900,
  }
  return `${base64url(header)}.${base64url(payload)}.mock-signature`
}

export function findUserByToken(token: string | null): MockUser | null {
  if (!token) return null
  const [, payloadSegment] = token.split('.')
  if (!payloadSegment) return null
  try {
    const payload = JSON.parse(atob(payloadSegment.replace(/-/g, '+').replace(/_/g, '/'))) as {
      sub: string
    }
    return Object.values(MOCK_USERS).find((user) => user.id === payload.sub) ?? null
  } catch {
    return null
  }
}
