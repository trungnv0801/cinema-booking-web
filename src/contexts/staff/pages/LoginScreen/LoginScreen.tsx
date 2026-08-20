import { useTranslation } from 'react-i18next'
import { type Location, useLocation, useNavigate } from 'react-router-dom'

import { getStaffLandingPath } from '@/contexts/staff/lib/staff-landing'
import { useSessionStore } from '@/entities/session'

import { StaffLoginForm } from './StaffLoginForm'

import styles from './LoginScreen.module.scss'

export function LoginScreen() {
  const { t } = useTranslation('staff-common')
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: Location } | null)?.from

  const handleSuccess = () => {
    const redirectTo = from
      ? `${from.pathname}${from.search}${from.hash}`
      : getStaffLandingPath(useSessionStore.getState().user)
    navigate(redirectTo, { replace: true })
  }

  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>{t('login.title')}</h1>
      <p className={styles.lead}>{t('login.lead')}</p>

      <div className={styles.formWrapper}>
        <StaffLoginForm onSuccess={handleSuccess} />
      </div>
    </main>
  )
}
