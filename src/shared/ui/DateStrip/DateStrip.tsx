import { useTranslation } from 'react-i18next'

import { clsx } from 'clsx'

import { buildDateStripDays, isSameDate } from './date-strip'

import styles from './DateStrip.module.scss'

const PROMO_DAY_OF_WEEK = 3

export interface DateStripProps {
  value: Date
  onChange: (date: Date) => void
  startDate?: Date
  days?: number
  locale?: string
  className?: string
  'aria-label'?: string
}

export function DateStrip({
  value,
  onChange,
  startDate,
  days = 14,
  locale,
  className,
  'aria-label': ariaLabel,
}: DateStripProps) {
  const { t, i18n } = useTranslation('common')
  const resolvedLocale = locale ?? i18n.language
  const resolvedAriaLabel = ariaLabel ?? t('datePicker.chooseDate')

  const weekdayFormatter = new Intl.DateTimeFormat(resolvedLocale, { weekday: 'short' })
  const dayFormatter = new Intl.DateTimeFormat(resolvedLocale, { day: 'numeric' })
  const dateList = buildDateStripDays(startDate ?? new Date(), days)

  return (
    <div className={clsx(styles.strip, className)} role="group" aria-label={resolvedAriaLabel}>
      {dateList.map((date) => {
        const selected = isSameDate(date, value)
        const isPromoDay = date.getDay() === PROMO_DAY_OF_WEEK

        return (
          <button
            type="button"
            key={date.toISOString()}
            className={clsx(styles.day, selected && styles.selected)}
            aria-pressed={selected}
            onClick={() => onChange(date)}
          >
            <span className={styles.weekday}>{weekdayFormatter.format(date)}</span>
            <span className={styles.dayNumber}>{dayFormatter.format(date)}</span>
            {isPromoDay && (
              <span className={styles.promoDot} aria-hidden="true">
                <span className="visually-hidden">{t('promo.marqueeWednesdays')}</span>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
