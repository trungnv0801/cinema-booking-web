import { useTranslation } from 'react-i18next'

import * as Dialog from '@radix-ui/react-dialog'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

import { IconButton } from '../IconButton'

import styles from './Drawer.module.scss'

export interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: 'left' | 'right'
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  closeLabel?: string
}

export function Drawer({
  open,
  onOpenChange,
  side = 'left',
  title,
  children,
  footer,
  closeLabel,
}: DrawerProps) {
  const { t } = useTranslation('common')
  const resolvedCloseLabel = closeLabel ?? t('actions.close')

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={clsx(styles.content, styles[side])}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close asChild>
              <IconButton aria-label={resolvedCloseLabel} size="sm" variant="ghost">
                <X size={18} />
              </IconButton>
            </Dialog.Close>
          </div>
          <div className={styles.body}>{children}</div>
          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
