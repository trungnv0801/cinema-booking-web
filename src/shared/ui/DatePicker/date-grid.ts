export interface CalendarCell {
  date: Date
  inCurrentMonth: boolean
}

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6

const FALLBACK_WEEK_START: Record<string, WeekStart> = {
  en: 0,
  vi: 1,
}

const DEFAULT_WEEK_START: WeekStart = 1

interface WeekInfo {
  firstDay: number
}

type LocaleWithWeekInfo = Intl.Locale & {
  getWeekInfo?: () => WeekInfo
  weekInfo?: WeekInfo
}

export function getWeekStart(locale: string): WeekStart {
  try {
    const resolved = new Intl.Locale(locale) as LocaleWithWeekInfo
    const info = resolved.getWeekInfo?.() ?? resolved.weekInfo
    if (info && typeof info.firstDay === 'number') {
      return (info.firstDay % 7) as WeekStart
    }
    const fallback = FALLBACK_WEEK_START[resolved.language]
    if (fallback !== undefined) return fallback
  } catch {
    // Malformed locale tag — fall through to the default.
  }
  return DEFAULT_WEEK_START
}

export function buildCalendarGrid(viewDate: Date, weekStart: WeekStart = 0): CalendarCell[] {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstOfMonth = new Date(year, month, 1)
  const leadingDays = (firstOfMonth.getDay() - weekStart + 7) % 7
  const gridStart = new Date(year, month, 1 - leadingDays)

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
    return { date, inCurrentMonth: date.getMonth() === month }
  })
}

const SUNDAY_REFERENCE = new Date(2024, 0, 7)

export function getWeekdayDates(weekStart: WeekStart = 0): Date[] {
  return Array.from(
    { length: 7 },
    (_, i) =>
      new Date(
        SUNDAY_REFERENCE.getFullYear(),
        SUNDAY_REFERENCE.getMonth(),
        SUNDAY_REFERENCE.getDate() + ((weekStart + i) % 7),
      ),
  )
}

export function isSameDay(a?: Date | null, b?: Date | null): boolean {
  return !!a && !!b && a.toDateString() === b.toDateString()
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return stripTime(a).getTime() < stripTime(b).getTime()
}

export function isAfterDay(a: Date, b: Date): boolean {
  return stripTime(a).getTime() > stripTime(b).getTime()
}

function stripTime(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}
