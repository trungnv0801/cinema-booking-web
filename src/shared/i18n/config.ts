export const SUPPORTED_LOCALES = ['en', 'vi'] as const
export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_STORAGE_KEY = 'halcyon-locale'

export const INTL_LOCALE: Record<AppLocale, string> = { en: 'en-US', vi: 'vi-VN' }

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return value === 'en' || value === 'vi'
}
