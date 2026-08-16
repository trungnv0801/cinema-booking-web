import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { TopBarShell } from '@/shared/ui/TopBarShell'

import styles from './BlankLayout.module.scss'

export function BlankLayout() {
  const { t } = useTranslation('common')

  return (
    <TopBarShell
      className="staff"
      brand={
        <div className={styles.wordmark}>
          <span>{t('brand.name')}</span>
          <span className={styles.consoleLabel}>{t('nav.staff.consoleLabel')}</span>
        </div>
      }
    >
      <Outlet />
    </TopBarShell>
  )
}
