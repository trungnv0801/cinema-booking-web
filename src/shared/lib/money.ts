import { type AppLocale, INTL_LOCALE } from '@/shared/i18n/config'

export function formatVnd(amountVnd: number, locale: AppLocale): string {
  if (!Number.isInteger(amountVnd)) {
    console.error(`formatVnd received a non-integer VND amount: ${amountVnd}`)
  }

  const formatted = new Intl.NumberFormat(INTL_LOCALE[locale], {
    maximumFractionDigits: 0,
  }).format(Math.round(amountVnd))

  return `${formatted} ₫`
}
