import { useEffect } from 'react'

import { getMe } from '@/entities/session/api'
import { useSessionStore } from '@/entities/session/model/session.store'
import { setAccessToken } from '@/shared/api/auth-token'
import { refreshAccessToken } from '@/shared/api/refresh'
import { onSessionExpired } from '@/shared/api/session-expiry'
import { ROUTES, STAFF_BASE_PATH } from '@/shared/routing/registry'

onSessionExpired(() => {
  useSessionStore.getState().clearSession()
  const inStaffConsole = window.location.pathname.startsWith(STAFF_BASE_PATH)
  window.location.href = inStaffConsole ? ROUTES.STAFF_LOGIN.path : ROUTES.LOGIN.path
})

export function useSessionBootstrap(): void {
  const setSession = useSessionStore((s) => s.setSession)
  const clearSession = useSessionStore((s) => s.clearSession)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        await refreshAccessToken()
        const me = await getMe()
        if (cancelled) return
        setSession({
          id: me.id,
          fullName: me.fullName,
          email: me.email,
          roles: me.roles,
          cinemaIds: me.cinemaIds,
        })
      } catch {
        if (!cancelled) {
          setAccessToken(null)
          clearSession()
        }
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [setSession, clearSession])
}
