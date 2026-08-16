import { type AppLocale, INTL_LOCALE } from '@/shared/i18n/config'

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function parseAsLocalDate(iso: string): Date {
  return DATE_ONLY_PATTERN.test(iso) ? new Date(`${iso}T00:00:00`) : new Date(iso)
}

export function formatDate(
  iso: string,
  locale: AppLocale,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], options ?? { dateStyle: 'medium' }).format(
    parseAsLocalDate(iso),
  )
}

export function formatDateTime(iso: string, locale: AppLocale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parseAsLocalDate(iso))
}

export function formatTime(iso: string, locale: AppLocale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], { timeStyle: 'short' }).format(new Date(iso))
}
