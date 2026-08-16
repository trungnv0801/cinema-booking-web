import { initReactI18next } from 'react-i18next'

import i18n from 'i18next'

import { type AppLocale, isAppLocale, LOCALE_STORAGE_KEY } from './config'
import en_auth from './locales/en/auth.json'
import en_booking from './locales/en/booking.json'
import en_common from './locales/en/common.json'
import en_errors from './locales/en/errors.json'
import en_staffCommon from './locales/en/staff-common.json'
import vi_auth from './locales/vi/auth.json'
import vi_booking from './locales/vi/booking.json'
import vi_common from './locales/vi/common.json'
import vi_errors from './locales/vi/errors.json'
import vi_staffCommon from './locales/vi/staff-common.json'

export { type AppLocale, INTL_LOCALE, isAppLocale, SUPPORTED_LOCALES } from './config'

function detectInitialLocale(): AppLocale {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (isAppLocale(fromUrl)) return fromUrl

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (isAppLocale(stored)) return stored

  return navigator.language.slice(0, 2) === 'vi' ? 'vi' : 'en'
}

export function setLocale(locale: AppLocale): void {
  void i18n.changeLanguage(locale)
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)

  const url = new URL(window.location.href)
  url.searchParams.set('lang', locale)
  window.history.replaceState(window.history.state, '', url)
}

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: en_common,
      errors: en_errors,
      auth: en_auth,
      booking: en_booking,
      'staff-common': en_staffCommon,
    },
    vi: {
      common: vi_common,
      errors: vi_errors,
      auth: vi_auth,
      booking: vi_booking,
      'staff-common': vi_staffCommon,
    },
  },
  lng: detectInitialLocale(),
  fallbackLng: 'en',
  ns: ['common', 'errors', 'auth', 'booking', 'staff-common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export default i18n
