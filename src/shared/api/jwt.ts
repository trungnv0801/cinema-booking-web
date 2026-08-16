import type { Role } from '@/shared/types/domain'

export interface JwtClaims {
  sub: string
  roles: Role[]
  cinemaIds: string[]
  exp: number
}

export function decodeJwt(token: string): JwtClaims | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as JwtClaims
  } catch {
    return null
  }
}
