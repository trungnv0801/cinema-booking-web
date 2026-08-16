import { clsx } from 'clsx'
import type { ReactNode } from 'react'

import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'

import styles from './TopBarShell.module.scss'

export interface TopBarShellProps {
  brand: ReactNode
  children: ReactNode
  className?: string
}

export function TopBarShell({ brand, children, className }: TopBarShellProps) {
  return (
    <div className={clsx(styles.shell, className)}>
      <div className={styles.top}>
        {brand}
        <LanguageSwitcher />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
