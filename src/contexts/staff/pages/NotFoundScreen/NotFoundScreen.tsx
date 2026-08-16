import { useTranslation } from 'react-i18next'

import { getStaffLandingPath } from '@/contexts/staff/lib/staff-landing'
import { isStaff, useSessionUser } from '@/entities/session'
import { ROUTES } from '@/shared/routing/registry'
import { StatusScreen, type StatusScreenAction, TicketStubArt } from '@/shared/ui/StatusScreen'

export function NotFoundScreen() {
  const { t } = useTranslation(['common', 'errors'])
  const user = useSessionUser()

  const back: StatusScreenAction = isStaff(user)
    ? { label: t('actions.backToConsole'), to: getStaffLandingPath(user) }
    : { label: t('actions.backToHome'), to: ROUTES.HOME.path }

  return (
    <StatusScreen
      art={<TicketStubArt code="404" />}
      title={t('errors:notFound.title')}
      description={t('errors:notFound.consoleDescription')}
      actions={[back]}
    />
  )
}
