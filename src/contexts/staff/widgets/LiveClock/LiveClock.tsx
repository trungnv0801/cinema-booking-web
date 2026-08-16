import { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'

import type { AppLocale } from '@/shared/i18n'
import { formatTime } from '@/shared/lib/datetime'

import styles from './LiveClock.module.scss'

export function LiveClock({ className }: { className?: string }) {
  const { i18n } = useTranslation()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className={className ? `${styles.clock} ${className}` : styles.clock}>
      {formatTime(now.toISOString(), i18n.language as AppLocale)}
    </span>
  )
}
