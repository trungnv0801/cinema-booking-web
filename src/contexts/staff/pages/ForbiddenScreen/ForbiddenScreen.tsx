import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { getStaffLandingPath } from '@/contexts/staff/lib/staff-landing'
import { useCinemas } from '@/entities/cinema'
import { isAdmin, isStaff, orderRoles, primaryRole, useSessionUser } from '@/entities/session'
import { SUPPORT_EMAIL } from '@/shared/config'
import type { ForbiddenState } from '@/shared/routing/forbidden-state'
import { ROUTES } from '@/shared/routing/registry'
import type { Role } from '@/shared/types/domain'
import { StatusScreen, type StatusScreenAction, TicketStubArt } from '@/shared/ui/StatusScreen'

const ROLE_LABEL_KEY: Record<Role, string> = {
  ADMIN: 'staff-common:roles.admin',
  CASHIER: 'staff-common:roles.cashier',
  CUSTOMER: 'staff-common:roles.customer',
}

function readRequiredRoles(state: unknown): Role[] {
  const raw = (state as Partial<ForbiddenState> | null | undefined)?.requiredRoles
  if (!Array.isArray(raw)) return []
  return orderRoles(raw as Role[])
}

export function ForbiddenScreen() {
  const { t, i18n } = useTranslation(['common', 'errors', 'auth', 'staff-common'])
  const user = useSessionUser()
  const { state } = useLocation()
  const { data: cinemas } = useCinemas()

  const heldRole = primaryRole(user)
  const branch = cinemas?.find((cinema) => user?.cinemaIds.includes(cinema.id))

  let description: string
  if (!user || !heldRole) {
    description = t('errors:forbidden.descriptionAnonymous')
  } else {
    const have = t(ROLE_LABEL_KEY[heldRole])
    const needed = readRequiredRoles(state).map((role) => t(ROLE_LABEL_KEY[role]))

    let held: string
    if (isAdmin(user)) held = t('errors:forbidden.haveSystem', { have })
    else if (branch) held = t('errors:forbidden.haveBranch', { have, where: branch.name })
    else held = t('errors:forbidden.have', { have })

    description = needed.length
      ? `${t('errors:forbidden.requires', {
          needed: new Intl.ListFormat(i18n.language, { type: 'disjunction' }).format(needed),
        })} ${held}`
      : held
  }

  let back: StatusScreenAction
  if (!user) back = { label: t('auth:signIn'), to: ROUTES.STAFF_LOGIN.path }
  else if (isStaff(user)) {
    back = { label: t('actions.backToConsole'), to: getStaffLandingPath(user) }
  } else back = { label: t('actions.backToHome'), to: ROUTES.HOME.path }

  const actions: StatusScreenAction[] = [
    back,
    { label: t('errors:forbidden.contactAdmin'), href: `mailto:${SUPPORT_EMAIL}` },
  ]

  return (
    <StatusScreen
      art={<TicketStubArt code="403" />}
      title={t('errors:forbidden.title')}
      description={description}
      actions={actions}
    />
  )
}
