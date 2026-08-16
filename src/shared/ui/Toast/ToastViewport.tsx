import { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { clsx } from 'clsx'
import { X } from 'lucide-react'

import { IconButton } from '../IconButton'
import { type ToastItem, useToastStore } from './toast.store'

import styles from './Toast.module.scss'

export interface ToastViewportProps {
  dismissLabel?: string
}

export function ToastViewport({ dismissLabel }: ToastViewportProps) {
  const { t } = useTranslation('common')
  const resolvedDismissLabel = dismissLabel ?? t('actions.dismiss')
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className={styles.viewport} aria-live="polite" aria-atomic="false">
      {toasts.map((item) => (
        <Toast
          key={item.id}
          toast={item}
          dismissLabel={resolvedDismissLabel}
          onDismiss={() => dismiss(item.id)}
        />
      ))}
    </div>
  )
}

function Toast({
  toast: item,
  onDismiss,
  dismissLabel,
}: {
  toast: ToastItem
  onDismiss: () => void
  dismissLabel: string
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, item.duration ?? 4000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id])

  return (
    <div className={clsx(styles.toast, styles[item.variant ?? 'default'])} role="status">
      <div className={styles.content}>
        <p className={styles.title}>{item.title}</p>
        {item.description && <p className={styles.description}>{item.description}</p>}
      </div>
      {item.action && (
        <button
          type="button"
          className={styles.action}
          onClick={() => {
            item.action?.onClick()
            onDismiss()
          }}
        >
          {item.action.label}
        </button>
      )}
      <IconButton aria-label={dismissLabel} size="sm" variant="ghost" onClick={onDismiss}>
        <X size={14} />
      </IconButton>
    </div>
  )
}
