import type { RouteDef } from '@/shared/routing/registry'
import { ROUTES } from '@/shared/routing/registry'

export interface StaffNavItem {
  route: RouteDef
  labelKey: string
}

export interface StaffNavGroup {
  titleKey: string
  items: StaffNavItem[]
}

export const STAFF_NAV_GROUPS: StaffNavGroup[] = [
  {
    titleKey: 'nav.staff.groups.operations',
    items: [
      { route: ROUTES.STAFF_REPORTS_DAILY, labelKey: 'nav.staff.items.shiftReports' },
      { route: ROUTES.STAFF_BOOKINGS, labelKey: 'nav.staff.items.orders' },
      { route: ROUTES.STAFF_REFUNDS, labelKey: 'nav.staff.items.refunds' },
    ],
  },
  {
    titleKey: 'nav.staff.groups.content',
    items: [
      { route: ROUTES.STAFF_MOVIES, labelKey: 'nav.staff.items.movies' },
      { route: ROUTES.STAFF_SCHEDULE, labelKey: 'nav.staff.items.showtimes' },
      { route: ROUTES.STAFF_CINEMAS, labelKey: 'nav.staff.items.branches' },
      { route: ROUTES.STAFF_PRICING, labelKey: 'nav.staff.items.pricing' },
    ],
  },
  {
    titleKey: 'nav.staff.groups.system',
    items: [
      { route: ROUTES.STAFF_TEAM, labelKey: 'nav.staff.items.staff' },
      { route: ROUTES.STAFF_AUDIT, labelKey: 'nav.staff.items.auditLog' },
    ],
  },
]
