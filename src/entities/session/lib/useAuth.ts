import { useMutation } from '@tanstack/react-query'

import { useCheckoutStore } from '@/entities/booking/model/checkout.store'
import {
  getMe,
  login as loginRequest,
  type LoginRequest,
  logout as logoutRequest,
} from '@/entities/session/api'
import { useSessionStore } from '@/entities/session/model/session.store'
import { setAccessToken } from '@/shared/api/auth-token'
import { queryClient } from '@/shared/api/query-client'

export function useAuth() {
  const user = useSessionStore((s) => s.user)
  const status = useSessionStore((s) => s.status)
  const setSession = useSessionStore((s) => s.setSession)
  const clearSession = useSessionStore((s) => s.clearSession)

  const loginMutation = useMutation({
    mutationFn: (body: LoginRequest) => loginRequest(body),
    onSuccess: async (data) => {
      setAccessToken(data.accessToken)
      const me = await getMe()
      setSession({
        id: me.id,
        fullName: me.fullName,
        email: me.email,
        roles: me.roles,
        cinemaIds: me.cinemaIds,
      })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: logoutRequest,
    onSettled: async () => {
      setAccessToken(null)
      clearSession()
      await useCheckoutStore.getState().teardownHold()
      queryClient.clear()
    },
  })

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutateAsync,
  }
}
