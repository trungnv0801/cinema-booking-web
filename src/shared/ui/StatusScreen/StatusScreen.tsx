import { Link } from 'react-router-dom'

import { clsx } from 'clsx'
import type { ReactNode } from 'react'

import { Button, type ButtonVariant } from '@/shared/ui'

import styles from './StatusScreen.module.scss'

interface StatusScreenActionBase {
  label: string
  variant?: ButtonVariant
}

export type StatusScreenAction = StatusScreenActionBase &
  (
    | { to: string; href?: never; onClick?: never }
    | { href: string; to?: never; onClick?: never }
    | { onClick: () => void; to?: never; href?: never }
  )

export interface StatusScreenProps {
  code?: string
  icon?: ReactNode
  art?: ReactNode
  tone?: 'accent' | 'error'
  title: string
  description: string
  actions: StatusScreenAction[]
  className?: string
}

export function StatusScreen({
  code,
  icon,
  art,
  tone = 'accent',
  title,
  description,
  actions,
  className,
}: StatusScreenProps) {
  return (
    <div className={clsx(styles.screen, className)}>
      <div className={styles.card}>
        {art ? (
          <div className={styles.art} aria-hidden="true">
            {art}
          </div>
        ) : (
          <>
            {icon && (
              <div
                className={clsx(styles.icon, tone === 'error' && styles.iconError)}
                aria-hidden="true"
              >
                {icon}
              </div>
            )}
            {code && <p className={styles.code}>{code}</p>}
          </>
        )}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <div className={styles.perforation} aria-hidden="true" />
        <div className={styles.actions}>
          {actions.map((action, index) => {
            const variant = action.variant ?? (index === 0 ? 'primary' : 'outline')

            if (action.onClick !== undefined) {
              return (
                <Button key={action.label} size="lg" variant={variant} onClick={action.onClick}>
                  {action.label}
                </Button>
              )
            }

            return (
              <Button key={action.label} asChild size="lg" variant={variant}>
                {action.to !== undefined ? (
                  <Link to={action.to}>{action.label}</Link>
                ) : (
                  <a href={action.href}>{action.label}</a>
                )}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
