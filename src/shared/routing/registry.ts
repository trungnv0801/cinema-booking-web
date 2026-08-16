import type { Role } from '@/shared/types/domain'

export type LayoutId =
  | 'PublicLayout'
  | 'CheckoutLayout'
  | 'MinimalLayout'
  | 'StatusLayout'
  | 'AdminLayout'
  | 'CounterLayout'
  | 'BlankLayout'

export interface RouteDef {
  path: string
  layout: LayoutId
  roles?: Role[]
  cinemaScoped?: boolean
}

export const ROUTES = {
  HOME: { path: '/', layout: 'PublicLayout' },
  MOVIES: { path: '/movies', layout: 'PublicLayout' },
  MOVIE_DETAIL: { path: '/movies/:slug', layout: 'PublicLayout' },
  SHOWTIMES: { path: '/showtimes', layout: 'PublicLayout' },
  BOOKING_RESULT: { path: '/booking/result', layout: 'PublicLayout' },
  TICKETS: { path: '/tickets', layout: 'PublicLayout', roles: ['CUSTOMER'] },
  TICKET_DETAIL: { path: '/tickets/:code', layout: 'PublicLayout', roles: ['CUSTOMER'] },
  TICKET_CANCEL: { path: '/tickets/:code/cancel', layout: 'PublicLayout', roles: ['CUSTOMER'] },
  ORDER_PICKUP: { path: '/orders/:code', layout: 'PublicLayout' },
  ACCOUNT: { path: '/account', layout: 'PublicLayout', roles: ['CUSTOMER'] },
  ACCOUNT_POINTS: { path: '/account/points', layout: 'PublicLayout', roles: ['CUSTOMER'] },

  BOOKING_SEATS: { path: '/booking/:screeningId/seats', layout: 'CheckoutLayout' },
  BOOKING_CONCESSIONS: { path: '/booking/:bookingCode/concession', layout: 'CheckoutLayout' },
  BOOKING_CONFIRM: { path: '/booking/:bookingCode/confirm', layout: 'CheckoutLayout' },

  LOGIN: { path: '/login', layout: 'MinimalLayout' },
  REGISTER: { path: '/register', layout: 'MinimalLayout' },
  FORGOT_PASSWORD: { path: '/forgot-password', layout: 'MinimalLayout' },
  RESET_PASSWORD: { path: '/reset-password', layout: 'MinimalLayout' },
  VERIFY_EMAIL: { path: '/verify-email', layout: 'StatusLayout' },
  SERVER_ERROR: { path: '/500', layout: 'PublicLayout' },

  STAFF_LOGIN: { path: '/staff/login', layout: 'BlankLayout' },
  STAFF_403: { path: '/staff/403', layout: 'PublicLayout' },

  STAFF_POS: {
    path: '/staff/pos',
    layout: 'CounterLayout',
    roles: ['CASHIER', 'ADMIN'],
    cinemaScoped: true,
  },
  STAFF_POS_CONCESSION: {
    path: '/staff/pos/concession',
    layout: 'CounterLayout',
    roles: ['CASHIER', 'ADMIN'],
    cinemaScoped: true,
  },
  STAFF_SCANNER: {
    path: '/staff/scanner',
    layout: 'CounterLayout',
    roles: ['CASHIER', 'ADMIN'],
    cinemaScoped: true,
  },
  STAFF_CLOSE_SHIFT: {
    path: '/staff/pos/close-shift',
    layout: 'CounterLayout',
    roles: ['CASHIER', 'ADMIN'],
    cinemaScoped: true,
  },
  STAFF_LOOKUP: {
    path: '/staff/pos/lookup',
    layout: 'CounterLayout',
    roles: ['CASHIER', 'ADMIN'],
    cinemaScoped: true,
  },

  STAFF_MOVIES: { path: '/staff/movies', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_MOVIE_NEW: { path: '/staff/movies/new', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_MOVIE_EDIT: { path: '/staff/movies/:id', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_CINEMAS: { path: '/staff/cinemas', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_CINEMA_EDIT: { path: '/staff/cinemas/:id', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_AUDITORIUMS: {
    path: '/staff/cinemas/:id/auditoriums',
    layout: 'AdminLayout',
    roles: ['ADMIN'],
  },
  STAFF_SEAT_MAP: { path: '/staff/auditoriums/:id/seats', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_SCHEDULE: {
    path: '/staff/schedule',
    layout: 'AdminLayout',
    roles: ['ADMIN'],
    cinemaScoped: true,
  },
  STAFF_PRICING: { path: '/staff/pricing', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_REPORTS_DAILY: {
    path: '/staff/reports/daily',
    layout: 'AdminLayout',
    roles: ['CASHIER', 'ADMIN'],
    cinemaScoped: true,
  },
  STAFF_REPORTS_ANALYTICS: {
    path: '/staff/reports/analytics',
    layout: 'AdminLayout',
    roles: ['ADMIN'],
    cinemaScoped: true,
  },
  STAFF_BOOKINGS: {
    path: '/staff/bookings',
    layout: 'AdminLayout',
    roles: ['CASHIER', 'ADMIN'],
    cinemaScoped: true,
  },
  STAFF_BOOKING_DETAIL: {
    path: '/staff/bookings/:code',
    layout: 'AdminLayout',
    roles: ['CASHIER', 'ADMIN'],
    cinemaScoped: true,
  },
  STAFF_REFUNDS: {
    path: '/staff/refunds',
    layout: 'AdminLayout',
    roles: ['CASHIER', 'ADMIN'],
    cinemaScoped: true,
  },
  STAFF_TEAM: { path: '/staff/team', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_AUDIT: { path: '/staff/audit', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_PROMOTIONS: { path: '/staff/promotions', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_PROMOTION_FORM: { path: '/staff/promotions/:id', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_PRODUCTS: { path: '/staff/products', layout: 'AdminLayout', roles: ['ADMIN'] },
  STAFF_INVENTORY: {
    path: '/staff/inventory',
    layout: 'AdminLayout',
    roles: ['ADMIN'],
    cinemaScoped: true,
  },
} as const satisfies Record<string, RouteDef>

export type RouteName = keyof typeof ROUTES

export const DEV_UI_GALLERY_PATH = '/__dev/ui'

export const STAFF_BASE_PATH = '/staff'

export function staffRelativePath(path: string): string {
  const prefix = `${STAFF_BASE_PATH}/`
  return path.startsWith(prefix) ? path.slice(prefix.length) : path
}
