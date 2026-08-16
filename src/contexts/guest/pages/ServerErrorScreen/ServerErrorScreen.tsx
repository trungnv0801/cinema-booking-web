import { useTranslation } from 'react-i18next'

import { ROUTES } from '@/shared/routing/registry'
import { StatusScreen, TicketStubArt } from '@/shared/ui/StatusScreen'

export function ServerErrorScreen() {
  const { t } = useTranslation(['common', 'errors'])

  return (
    <StatusScreen
      art={<TicketStubArt code="500" />}
      title={t('errors:serverError.title')}
      description={t('errors:serverError.description')}
      actions={[
        { label: t('errors:serverError.reload'), onClick: () => window.location.reload() },
        { label: t('actions.backToHome'), to: ROUTES.HOME.path, variant: 'outline' },
      ]}
    />
  )
}
