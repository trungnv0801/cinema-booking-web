import { MOCK_USERS, type MockUser } from './fixtures/users'

const SESSION_KEY = 'mock:session'

const ROLE_ALIASES: Record<string, string> = {
  customer: 'demo@halcyoncinemas.com',
  cashier: 'cashier@halcyoncinemas.com',
  admin: 'admin@halcyoncinemas.com',
}

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function getMockSessionUser(): MockUser | null {
  const email = storage()?.getItem(SESSION_KEY)
  return email ? (MOCK_USERS[email] ?? null) : null
}

export function setMockSessionUser(email: string | null): void {
  const store = storage()
  if (!store) return
  if (email) store.setItem(SESSION_KEY, email)
  else store.removeItem(SESSION_KEY)
}

export function applyMockSessionOverride(): void {
  if (typeof window === 'undefined') return

  const requested = new URLSearchParams(window.location.search).get('mockUser')
  if (requested !== null) {
    const value = requested.trim().toLowerCase()
    const isAnonymous = value === '' || value === 'none' || value === 'anonymous'
    setMockSessionUser(isAnonymous ? null : (ROLE_ALIASES[value] ?? requested))
  }

  Object.defineProperty(window, 'mockAuth', {
    value: {
      loginAs: (who: string) => {
        setMockSessionUser(ROLE_ALIASES[who] ?? who)
        window.location.reload()
      },
      logout: () => {
        setMockSessionUser(null)
        window.location.reload()
      },
      current: () => getMockSessionUser()?.email ?? null,
    },
    configurable: true,
  })
}
