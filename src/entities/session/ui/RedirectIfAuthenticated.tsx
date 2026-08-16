import { Navigate, Outlet } from 'react-router-dom'

import { type SessionUser, useSessionStore } from '../model/session.store'

export function RedirectIfAuthenticated({
  resolveTarget,
}: {
  resolveTarget: (user: SessionUser) => string
}) {
  const status = useSessionStore((s) => s.status)
  const user = useSessionStore((s) => s.user)

  if (status === 'loading') return null
  if (status === 'authenticated' && user) return <Navigate to={resolveTarget(user)} replace />

  return <Outlet />
}
