import { create } from 'zustand'

import type { Role } from '@/shared/types/domain'

export interface SessionUser {
  id: string
  fullName: string
  email?: string
  roles: Role[]
  cinemaIds: string[]
}

export type SessionStatus = 'loading' | 'anonymous' | 'authenticated'

interface SessionState {
  user: SessionUser | null
  status: SessionStatus
  setSession: (user: SessionUser) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  status: 'loading',
  setSession: (user) => set({ user, status: 'authenticated' }),
  clearSession: () => set({ user: null, status: 'anonymous' }),
}))
