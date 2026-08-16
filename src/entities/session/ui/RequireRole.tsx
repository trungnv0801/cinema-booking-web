import { Navigate, Outlet } from 'react-router-dom'

import type { ForbiddenState } from '@/shared/routing/forbidden-state'
import type { Role } from '@/shared/types/domain'

import { canAccessRoute } from '../model/selectors'
import { useSessionStore } from '../model/session.store'

export function RequireRole({
  roles,
  loginPath,
  forbiddenPath,
}: {
  roles: Role[]
  loginPath: string
  forbiddenPath: string
}) {
  const user = useSessionStore((s) => s.user)
  const status = useSessionStore((s) => s.status)

  if (status === 'loading') return null

  if (status !== 'authenticated' || !user) {
    return <Navigate to={loginPath} replace />
  }

  if (!canAccessRoute(user, { roles })) {
    const state: ForbiddenState = { requiredRoles: roles }
    return <Navigate to={forbiddenPath} state={state} replace />
  }

  return <Outlet />
}
