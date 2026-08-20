import { useTranslation } from 'react-i18next'
import { type Location, useLocation, useNavigate } from 'react-router-dom'

import { LoginForm } from '@/entities/session'
import { ROUTES } from '@/shared/routing/registry'

import styles from './LoginScreen.module.scss'

export function LoginScreen() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const location = useLocation()

  const from = (location.state as { from?: Location } | null)?.from
  const redirectTo = from ? `${from.pathname}${from.search}${from.hash}` : ROUTES.HOME.path

  return (
    <main className={styles.screen}>
      <h1 className={styles.title}>{t('login.title')}</h1>
      <p className={styles.lead}>{t('login.lead')}</p>

      <div className={styles.formWrapper}>
        <LoginForm onSuccess={() => navigate(redirectTo, { replace: true })} />
      </div>
    </main>
  )
}
