import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router-dom'

import { Calendar, Home, Ticket, User } from 'lucide-react'

import { BranchPicker } from '@/contexts/guest/widgets/BranchPicker'
import { HeaderSearch } from '@/contexts/guest/widgets/HeaderSearch'
import { useCinemas } from '@/entities/cinema'
import { useAuth } from '@/entities/session/lib/useAuth'
import { ROUTES } from '@/shared/routing/registry'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'

import styles from './PublicLayout.module.scss'

export function PublicLayout() {
  const { t } = useTranslation(['common', 'auth'])
  const { isAuthenticated, user } = useAuth()
  const { data: cinemas } = useCinemas()

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main">
        {t('skipToContent')}
      </a>

      <header className={styles.header}>
        <div className={styles.container}>
          <Link to={ROUTES.HOME.path} className={styles.wordmark}>
            <BrandMark />
            {t('brand.short')}
          </Link>

          <nav className={styles.mainNav} aria-label="Primary">
            <NavLink to={ROUTES.HOME.path} end className={navLinkClassName}>
              {t('nav.guest.home')}
            </NavLink>
            <NavLink to={ROUTES.MOVIES.path} className={navLinkClassName}>
              {t('nav.guest.movies')}
            </NavLink>
            <NavLink to={ROUTES.SHOWTIMES.path} className={navLinkClassName}>
              {t('nav.guest.showtimes')}
            </NavLink>
            {isAuthenticated && (
              <NavLink to={ROUTES.TICKETS.path} className={navLinkClassName}>
                {t('nav.guest.myTickets')}
              </NavLink>
            )}
          </nav>

          <div className={styles.headerTools}>
            <HeaderSearch />
            <BranchPicker />
            <LanguageSwitcher />
            <Link
              to={isAuthenticated ? ROUTES.ACCOUNT.path : ROUTES.LOGIN.path}
              className={styles.avatar}
              aria-label={isAuthenticated ? t('nav.guest.account') : t('auth:signIn')}
            >
              {isAuthenticated ? getInitials(user?.fullName) : <User size={18} />}
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <Link to={ROUTES.HOME.path} className={styles.footerWordmark}>
                <BrandMark />
                {t('brand.short')}
              </Link>
              <p>{t('footer.tagline')}</p>
            </div>

            <div>
              <h4>{t('footer.branches')}</h4>
              {(cinemas ?? []).map((cinema) => (
                <Link key={cinema.id} to={ROUTES.SHOWTIMES.path}>
                  {cinema.name}
                </Link>
              ))}
            </div>

            <div>
              <h4>{t('footer.explore')}</h4>
              <Link to={ROUTES.MOVIES.path}>{t('nav.guest.movies')}</Link>
              <Link to={ROUTES.SHOWTIMES.path}>{t('nav.guest.showtimes')}</Link>
              <a href="#">{t('footer.promotions')}</a>
            </div>

            <div>
              <h4>{t('footer.support')}</h4>
              <a href="#">{t('footer.faq')}</a>
              <a href="#">{t('footer.contact')}</a>
              <a href="#">{t('footer.refunds')}</a>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>{t('footer.legal', { year: new Date().getFullYear() })}</span>
            <span className={styles.footerBottomLinks}>
              <a href="#">{t('footer.terms')}</a>
              <a href="#">{t('footer.privacy')}</a>
            </span>
          </div>
        </div>
      </footer>

      <nav className={styles.tabbar} aria-label="Primary">
        <NavLink to={ROUTES.HOME.path} end className={tabLinkClassName}>
          <Home size={21} />
          <span>{t('nav.guest.home')}</span>
        </NavLink>
        <NavLink to={ROUTES.SHOWTIMES.path} className={tabLinkClassName}>
          <Calendar size={21} />
          <span>{t('nav.guest.showtimes')}</span>
        </NavLink>
        {isAuthenticated && (
          <NavLink to={ROUTES.TICKETS.path} className={tabLinkClassName}>
            <Ticket size={21} />
            <span>{t('nav.guest.myTickets')}</span>
          </NavLink>
        )}
        <NavLink
          to={isAuthenticated ? ROUTES.ACCOUNT.path : ROUTES.LOGIN.path}
          className={tabLinkClassName}
        >
          <User size={21} />
          <span>{isAuthenticated ? t('nav.guest.account') : t('auth:signIn')}</span>
        </NavLink>
      </nav>
    </div>
  )
}

function BrandMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2.5" />
      <path d="M2 9h20M7 4v5M17 4v5" />
    </svg>
  )
}

function getInitials(fullName?: string) {
  if (!fullName) return <User size={18} />
  const parts = fullName.trim().split(/\s+/)
  const initials = (parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '')
  return initials.toUpperCase()
}

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
}

function tabLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.tabLink} ${styles.tabLinkActive}` : styles.tabLink
}
