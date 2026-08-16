import type { Role } from '@/shared/types/domain'

export interface ForbiddenState {
  requiredRoles: Role[]
}
