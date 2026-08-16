import type { RouteDef } from '@/shared/routing/registry'
import type { Role } from '@/shared/types/domain'

import { useBranchStore } from './branch.store'
import { type SessionUser, useSessionStore } from './session.store'

export const STAFF_ROLES: Role[] = ['ADMIN', 'CASHIER']

export const ROLE_PRECEDENCE: Role[] = ['ADMIN', 'CASHIER', 'CUSTOMER']

export function hasAnyRole(user: SessionUser | null, roles: readonly Role[]): boolean {
  if (!user) return false
  return user.roles.some((role) => roles.includes(role))
}

export function isAdmin(user: SessionUser | null): boolean {
  return hasAnyRole(user, ['ADMIN'])
}

export function isStaff(user: SessionUser | null): boolean {
  return hasAnyRole(user, STAFF_ROLES)
}

export function primaryRole(user: SessionUser | null): Role | null {
  if (!user) return null
  return ROLE_PRECEDENCE.find((role) => user.roles.includes(role)) ?? null
}

export function orderRoles(roles: readonly Role[]): Role[] {
  return ROLE_PRECEDENCE.filter((role) => roles.includes(role))
}

export function canAccessRoute(user: SessionUser | null, route: Pick<RouteDef, 'roles'>): boolean {
  if (!route.roles) return true
  return hasAnyRole(user, route.roles)
}

export type CinemaScope = string[] | 'ALL'

export function cinemaScope(user: SessionUser | null): CinemaScope {
  if (isAdmin(user)) return 'ALL'
  return user?.cinemaIds ?? []
}

export function isBranchLocked(user: SessionUser | null): boolean {
  return !isAdmin(user)
}

export function useSessionUser(): SessionUser | null {
  return useSessionStore((s) => s.user)
}

export function useIsAdmin(): boolean {
  return isAdmin(useSessionUser())
}

export function useIsStaff(): boolean {
  return isStaff(useSessionUser())
}

export function useCanAccessRoute(route: Pick<RouteDef, 'roles'>): boolean {
  return canAccessRoute(useSessionUser(), route)
}

export interface BranchScope {
  /** `'ALL'` for admins, otherwise the cinema ids the user is assigned to. */
  allowed: CinemaScope
  /** The branch every scoped query should filter by. */
  selectedCinemaId: string | null
  isLocked: boolean
  setSelectedCinemaId: (cinemaId: string) => void
}

export function useBranchScope(): BranchScope {
  const user = useSessionUser()
  const preferred = useBranchStore((s) => s.selectedCinemaId)
  const setSelectedCinemaId = useBranchStore((s) => s.setSelectedCinemaId)

  const locked = isBranchLocked(user)
  const ownCinemaId = user?.cinemaIds[0] ?? null

  return {
    allowed: cinemaScope(user),
    selectedCinemaId: locked ? ownCinemaId : (preferred ?? ownCinemaId),
    isLocked: locked,
    setSelectedCinemaId,
  }
}
