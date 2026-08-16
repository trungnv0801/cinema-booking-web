import { useTranslation } from 'react-i18next'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

import { IconButton } from '../IconButton'

import styles from './Modal.module.scss'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeLabel?: string
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeLabel,
}: ModalProps) {
  const { t } = useTranslation('common')
  const resolvedCloseLabel = closeLabel ?? t('actions.close')

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={`${styles.content} ${styles[size]}`}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <IconButton aria-label={resolvedCloseLabel} size="sm" variant="ghost">
                <X size={18} />
              </IconButton>
            </Dialog.Close>
          </div>
          {description && (
            <Dialog.Description className={styles.description}>{description}</Dialog.Description>
          )}
          <div className={styles.body}>{children}</div>
          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
