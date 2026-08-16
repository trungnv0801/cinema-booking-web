import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { TopBarShell } from '@/shared/ui/TopBarShell'

import styles from './StatusLayout.module.scss'

export function StatusLayout() {
  const { t } = useTranslation('common')

  return (
    <TopBarShell brand={<span className={styles.wordmark}>{t('brand.name')}</span>}>
      <Outlet />
    </TopBarShell>
  )
}
