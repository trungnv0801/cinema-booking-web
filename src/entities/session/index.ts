export { login, type LoginRequest, logout } from './api'
export { useAuth } from './lib/useAuth'
export { useSessionBootstrap } from './lib/useSessionBootstrap'
export { useBranchStore } from './model/branch.store'
export { useLoginModalStore } from './model/login-modal.store'
export {
  type BranchScope,
  canAccessRoute,
  type CinemaScope,
  cinemaScope,
  hasAnyRole,
  isAdmin,
  isBranchLocked,
  isStaff,
  orderRoles,
  primaryRole,
  ROLE_PRECEDENCE,
  STAFF_ROLES,
  useBranchScope,
  useCanAccessRoute,
  useIsAdmin,
  useIsStaff,
  useSessionUser,
} from './model/selectors'
export { type SessionStatus, type SessionUser, useSessionStore } from './model/session.store'
export { LoginForm } from './ui/LoginForm'
export { LoginModal } from './ui/LoginModal'
export { RedirectIfAuthenticated } from './ui/RedirectIfAuthenticated'
export { RequireAuth } from './ui/RequireAuth'
export { RequireRole } from './ui/RequireRole'
