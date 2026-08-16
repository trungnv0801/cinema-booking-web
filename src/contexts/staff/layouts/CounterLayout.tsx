import { useTranslation } from 'react-i18next'
import { Link, Outlet } from 'react-router-dom'

import { clsx } from 'clsx'
import { ArrowLeft } from 'lucide-react'

import { LiveClock } from '@/contexts/staff/widgets/LiveClock'
import { useSessionStore } from '@/entities/session/model/session.store'
import { ROUTES } from '@/shared/routing/registry'
import { Button } from '@/shared/ui'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'

import { getExitCounterModePath } from '../lib/staff-landing'

import styles from './CounterLayout.module.scss'

export function CounterLayout() {
  const { t } = useTranslation(['common', 'staff-common'])
  const user = useSessionStore((s) => s.user)

  return (
    <div className={clsx('staff', styles.shell)}>
      <header className={styles.topbar}>
        <div className={styles.left}>
          <span className={styles.wordmark}>{t('brand.name')}</span>
          <Link to={getExitCounterModePath(user ?? null)} className={styles.exitLink}>
            <ArrowLeft size={16} />
            {t('nav.staff.exitCounterMode')}
          </Link>
        </div>

        <div className={styles.center}>{user?.fullName}</div>

        <div className={styles.right}>
          <LanguageSwitcher />
          <LiveClock />
          <Button variant="outline" size="sm" asChild>
            <Link to={ROUTES.STAFF_CLOSE_SHIFT.path}>{t('nav.staff.closeShift')}</Link>
          </Button>
        </div>
      </header>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
