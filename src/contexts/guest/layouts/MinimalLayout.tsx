import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'

import styles from './MinimalLayout.module.scss'

export function MinimalLayout() {
  const { t } = useTranslation('common')

  return (
    <div className={styles.shell}>
      <div className={styles.imagePane} aria-hidden="true">
        <p className={styles.tagline}>{t('footer.tagline')}</p>
      </div>
      <div className={styles.formPane}>
        <div className={styles.top}>
          <span className={styles.wordmark}>{t('brand.name')}</span>
          <LanguageSwitcher />
        </div>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
