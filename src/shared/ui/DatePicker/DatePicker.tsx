import { useEffect, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { clsx } from 'clsx'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

import { IconButton } from '../IconButton'
import {
  buildCalendarGrid,
  getWeekdayDates,
  getWeekStart,
  isAfterDay,
  isBeforeDay,
  isSameDay,
} from './date-grid'

import styles from './DatePicker.module.scss'

export interface DatePickerProps {
  value?: Date | null
  onChange: (date: Date) => void
  locale?: string
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
  previousMonthLabel?: string
  nextMonthLabel?: string
  triggerLabel?: string
}

export function DatePicker({
  value,
  onChange,
  locale,
  minDate,
  maxDate,
  placeholder,
  disabled = false,
  invalid = false,
  previousMonthLabel,
  nextMonthLabel,
  triggerLabel,
}: DatePickerProps) {
  const { t, i18n } = useTranslation('common')
  const resolvedLocale = locale ?? i18n.language
  const resolvedPlaceholder = placeholder ?? t('datePicker.selectDate')
  const resolvedPreviousMonthLabel = previousMonthLabel ?? t('datePicker.previousMonth')
  const resolvedNextMonthLabel = nextMonthLabel ?? t('datePicker.nextMonth')
  const resolvedTriggerLabel = triggerLabel ?? t('datePicker.chooseDate')

  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(value ?? new Date())
  const [prevValue, setPrevValue] = useState(value)
  const rootRef = useRef<HTMLDivElement>(null)

  if (value !== prevValue) {
    setPrevValue(value)
    if (
      value &&
      (viewDate.getFullYear() !== value.getFullYear() || viewDate.getMonth() !== value.getMonth())
    ) {
      setViewDate(value)
    }
  }

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const weekStart = getWeekStart(resolvedLocale)
  const cells = buildCalendarGrid(viewDate, weekStart)
  const weekdayFormatter = new Intl.DateTimeFormat(resolvedLocale, { weekday: 'short' })
  const monthFormatter = new Intl.DateTimeFormat(resolvedLocale, { month: 'long', year: 'numeric' })
  const displayFormatter = new Intl.DateTimeFormat(resolvedLocale, { dateStyle: 'medium' })
  const weekdayLabels = getWeekdayDates(weekStart).map((date) => weekdayFormatter.format(date))

  function isDisabled(date: Date) {
    if (minDate && isBeforeDay(date, minDate)) return true
    if (maxDate && isAfterDay(date, maxDate)) return true
    return false
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={clsx(styles.trigger, invalid && styles.invalid)}
        disabled={disabled}
        aria-label={resolvedTriggerLabel}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Calendar size={16} className={styles.triggerIcon} />
        <span className={value ? undefined : styles.placeholder}>
          {value ? displayFormatter.format(value) : resolvedPlaceholder}
        </span>
      </button>

      {open && (
        <div className={styles.popover} role="dialog" aria-label={resolvedTriggerLabel}>
          <div className={styles.header}>
            <IconButton
              aria-label={resolvedPreviousMonthLabel}
              size="sm"
              variant="ghost"
              onClick={() =>
                setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
              }
            >
              <ChevronLeft size={16} />
            </IconButton>
            <span className={styles.monthLabel}>{monthFormatter.format(viewDate)}</span>
            <IconButton
              aria-label={resolvedNextMonthLabel}
              size="sm"
              variant="ghost"
              onClick={() =>
                setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
              }
            >
              <ChevronRight size={16} />
            </IconButton>
          </div>

          <div className={styles.weekdays}>
            {weekdayLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className={styles.grid}>
            {cells.map(({ date, inCurrentMonth }) => {
              const disabledCell = isDisabled(date)
              return (
                <button
                  type="button"
                  key={date.toISOString()}
                  className={clsx(
                    styles.day,
                    !inCurrentMonth && styles.outside,
                    isSameDay(date, value) && styles.selected,
                    isSameDay(date, new Date()) && styles.today,
                  )}
                  disabled={disabledCell}
                  aria-current={isSameDay(date, new Date()) ? 'date' : undefined}
                  aria-pressed={isSameDay(date, value)}
                  onClick={() => {
                    onChange(date)
                    setOpen(false)
                  }}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
