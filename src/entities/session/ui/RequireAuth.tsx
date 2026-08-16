import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useSessionStore } from '../model/session.store'

export function RequireAuth({ loginPath }: { loginPath: string }) {
  const status = useSessionStore((s) => s.status)
  const location = useLocation()

  if (status === 'loading') return null

  if (status !== 'authenticated') {
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  return <Outlet />
}
