import { clsx } from 'clsx'

import styles from './Skeleton.module.scss'

export interface SkeletonProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'rect' | 'circle'
  className?: string
}

export function Skeleton({ width, height, variant = 'rect', className }: SkeletonProps) {
  return (
    <span
      className={clsx(styles.skeleton, styles[variant], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
