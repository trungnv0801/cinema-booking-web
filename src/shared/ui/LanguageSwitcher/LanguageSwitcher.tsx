import { useTranslation } from 'react-i18next'

import { clsx } from 'clsx'

import { type AppLocale, setLocale, SUPPORTED_LOCALES } from '@/shared/i18n'

import styles from './LanguageSwitcher.module.scss'

const LOCALE_CODE: Record<AppLocale, string> = { en: 'EN', vi: 'VN' }

export function LanguageSwitcher({ className }: { className?: string }) {
  const { t, i18n } = useTranslation('common')
  const current = i18n.language as AppLocale

  return (
    <div className={clsx(styles.switcher, className)} role="group" aria-label={t('language.label')}>
      {SUPPORTED_LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          className={styles.option}
          data-active={current === locale || undefined}
          aria-pressed={current === locale}
          aria-label={t(`language.${locale}`)}
          onClick={() => setLocale(locale)}
        >
          {LOCALE_CODE[locale]}
        </button>
      ))}
    </div>
  )
}
