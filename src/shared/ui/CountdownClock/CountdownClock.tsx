import { clsx } from 'clsx'

import styles from './CountdownClock.module.scss'

export interface CountdownClockProps {
  remainingSeconds: number
  urgentThreshold?: number
  label?: string
  className?: string
}

export function CountdownClock({
  remainingSeconds,
  urgentThreshold = 60,
  label,
  className,
}: CountdownClockProps) {
  const clamped = Math.max(0, remainingSeconds)
  const minutes = Math.floor(clamped / 60)
  const seconds = clamped % 60
  const formatted = `${minutes}:${String(seconds).padStart(2, '0')}`
  const isExpired = clamped === 0
  const urgent = !isExpired && clamped <= urgentThreshold

  return (
    <span
      className={clsx(
        styles.clock,
        urgent && styles.urgent,
        isExpired && styles.expired,
        className,
      )}
      role="timer"
      aria-live="polite"
      aria-label={label ? `${label}: ${formatted}` : formatted}
    >
      {formatted}
    </span>
  )
}
