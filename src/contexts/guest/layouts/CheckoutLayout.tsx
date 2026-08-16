import { useEffect, useRef } from 'react'

import { useTranslation } from 'react-i18next'
import { Outlet, useLocation } from 'react-router-dom'

import { clsx } from 'clsx'

import { useHoldCountdown } from '@/entities/booking/lib/useHoldCountdown'
import { useCheckoutStore } from '@/entities/booking/model/checkout.store'
import { ROUTES } from '@/shared/routing/registry'
import { CountdownClock } from '@/shared/ui'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'

import styles from './CheckoutLayout.module.scss'

const STEP_ORDER = ['seats', 'concessions', 'confirm', 'payment'] as const
type Step = (typeof STEP_ORDER)[number]

function getActiveStep(pathname: string): Step | null {
  if (pathname.includes('/seats')) return 'seats'
  if (pathname.includes('/concession')) return 'concessions'
  if (pathname.includes('/confirm')) return 'confirm'
  return null
}

export function CheckoutLayout() {
  const { t } = useTranslation(['common', 'booking'])
  const location = useLocation()
  const activeStep = getActiveStep(location.pathname)
  const activeIndex = activeStep ? STEP_ORDER.indexOf(activeStep) : 0

  const holdGroup = useCheckoutStore((s) => s.holdGroup)
  const { remainingSeconds } = useHoldCountdown(holdGroup)
  const pendingTeardown = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (pendingTeardown.current !== null) {
      clearTimeout(pendingTeardown.current)
      pendingTeardown.current = null
    }
    return () => {
      pendingTeardown.current = setTimeout(() => {
        pendingTeardown.current = null
        void useCheckoutStore.getState().teardownHold()
      }, 0)
    }
  }, [])

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <a href={ROUTES.HOME.path} className={styles.wordmark}>
            {t('brand.name')}
          </a>

          <ol className={styles.steps}>
            {STEP_ORDER.map((step, index) => (
              <li
                key={step}
                className={clsx(styles.step, index === activeIndex && styles.stepActive)}
              >
                {t(`booking:steps.${step}`)}
              </li>
            ))}
          </ol>

          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${((activeIndex + 1) / STEP_ORDER.length) * 100}%` }}
            />
          </div>

          <div className={styles.actions}>
            <LanguageSwitcher />
            {holdGroup && (
              <CountdownClock
                remainingSeconds={remainingSeconds}
                label={t('booking:holdCountdown')}
              />
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
