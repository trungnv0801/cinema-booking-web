import { isAdmin, type SessionUser } from '@/entities/session'
import { ROUTES } from '@/shared/routing/registry'

export function getStaffLandingPath(user: SessionUser | null): string {
  if (isAdmin(user)) return ROUTES.STAFF_REPORTS_DAILY.path
  if (user) return ROUTES.STAFF_POS.path
  return ROUTES.STAFF_LOGIN.path
}

export function getExitCounterModePath(user: SessionUser | null): string {
  return isAdmin(user) ? ROUTES.STAFF_REPORTS_DAILY.path : ROUTES.STAFF_BOOKINGS.path
}
