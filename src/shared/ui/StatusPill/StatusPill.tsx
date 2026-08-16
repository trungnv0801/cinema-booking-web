import { clsx } from 'clsx'

import { getStatusTone, type StatusTone } from './status-tone'

import styles from './StatusPill.module.scss'

export interface StatusPillProps {
  children: React.ReactNode
  tone?: StatusTone
  status?: string
  className?: string
}

export function StatusPill({ children, tone, status, className }: StatusPillProps) {
  const resolvedTone = tone ?? (status ? getStatusTone(status) : 'neutral')

  return <span className={clsx(styles.pill, styles[resolvedTone], className)}>{children}</span>
}
