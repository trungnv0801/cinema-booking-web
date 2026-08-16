import { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { NavLink, Outlet } from 'react-router-dom'

import { clsx } from 'clsx'
import { Bell, LogOut, Menu, Search, User } from 'lucide-react'

import { BranchSelector } from '@/contexts/staff/widgets/BranchSelector'
import { canAccessRoute, useAuth, useSessionUser } from '@/entities/session'
import { Drawer, IconButton, Input } from '@/shared/ui'
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher'

import { STAFF_NAV_GROUPS } from './nav-groups'

import styles from './AdminLayout.module.scss'

export function AdminLayout() {
  const { t } = useTranslation(['common', 'staff-common'])
  const user = useSessionUser()
  const { logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const visibleGroups = STAFF_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => canAccessRoute(user, item.route)),
  })).filter((group) => group.items.length > 0)

  return (
    <div className={clsx('staff', styles.shell)}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.wordmark}>{t('brand.name')}</span>
          <span className={styles.consoleLabel}>{t('nav.staff.consoleLabel')}</span>
        </div>
        <NavGroups groups={visibleGroups} onNavigate={() => undefined} />
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <IconButton
            className={styles.hamburger}
            aria-label={t('nav.staff.consoleLabel')}
            variant="ghost"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={20} />
          </IconButton>

          <div className={styles.topbarActions}>
            <Input
              className={styles.search}
              leftSlot={<Search size={16} />}
              rightSlot={<span className={styles.kbd}>⌘K</span>}
              placeholder={t('staff-common:searchPlaceholder')}
              aria-label={t('staff-common:searchPlaceholder')}
            />
            <BranchSelector className={styles.branchSelector} />
            <LanguageSwitcher />
            <IconButton aria-label="Notifications" variant="ghost">
              <Bell size={18} />
            </IconButton>
            <span className={styles.avatar}>
              <User size={16} />
              {user?.fullName}
            </span>
            <IconButton
              aria-label={t('auth:signOut')}
              variant="ghost"
              onClick={() => void logout().catch(() => undefined)}
            >
              <LogOut size={18} />
            </IconButton>
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        side="left"
        title={t('nav.staff.consoleLabel')}
      >
        <NavGroups groups={visibleGroups} onNavigate={() => setDrawerOpen(false)} />
        <div className={styles.drawerLanguage}>
          <LanguageSwitcher />
        </div>
      </Drawer>
    </div>
  )
}

function NavGroups({
  groups,
  onNavigate,
}: {
  groups: typeof STAFF_NAV_GROUPS
  onNavigate: () => void
}) {
  const { t } = useTranslation('common')

  return (
    <nav className={styles.nav} aria-label={t('nav.staff.consoleLabel')}>
      {groups.map((group) => (
        <div key={group.titleKey} className={styles.navGroup}>
          <p className={styles.navGroupTitle}>{t(group.titleKey)}</p>
          {group.items.map((item) => (
            <NavLink
              key={item.route.path}
              to={item.route.path}
              onClick={onNavigate}
              className={({ isActive }) => clsx(styles.navLink, isActive && styles.navLinkActive)}
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}
