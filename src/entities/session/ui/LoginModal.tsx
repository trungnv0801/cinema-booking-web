import { useTranslation } from 'react-i18next'

import { useLoginModalStore } from '@/entities/session/model/login-modal.store'
import { Modal } from '@/shared/ui'

import { LoginForm } from './LoginForm'

export function LoginModal() {
  const { t } = useTranslation('auth')
  const isOpen = useLoginModalStore((s) => s.isOpen)
  const close = useLoginModalStore((s) => s.close)

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && close()}
      title={t('login.title')}
      description={t('login.lead')}
      size="sm"
    >
      <LoginForm onSuccess={close} onNavigateAway={close} />
    </Modal>
  )
}
