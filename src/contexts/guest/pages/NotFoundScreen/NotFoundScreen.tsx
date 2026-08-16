import { useTranslation } from 'react-i18next'

import { ROUTES } from '@/shared/routing/registry'
import { StatusScreen, TicketStubArt } from '@/shared/ui/StatusScreen'

export function NotFoundScreen() {
  const { t } = useTranslation(['common', 'errors'])

  return (
    <StatusScreen
      art={<TicketStubArt code="404" />}
      title={t('errors:notFound.title')}
      description={t('errors:notFound.description')}
      actions={[
        { label: t('actions.backToHome'), to: ROUTES.HOME.path },
        { label: t('errors:notFound.browse'), to: ROUTES.MOVIES.path },
      ]}
    />
  )
}
