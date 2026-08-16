import { lazy, Suspense } from 'react'

import { Route, Routes } from 'react-router-dom'

import { RedirectIfAuthenticated, RequireAuth, RequireRole } from '@/entities/session'
import { ROUTES, staffRelativePath as rel } from '@/shared/routing/registry'

import { AdminLayout } from './layouts/AdminLayout'
import { BlankLayout } from './layouts/BlankLayout'
import { CounterLayout } from './layouts/CounterLayout'
import { getStaffLandingPath } from './lib/staff-landing'

const NotFoundScreen = lazy(() =>
  import('./pages/NotFoundScreen').then((m) => ({ default: m.NotFoundScreen })),
)

const BlankScreen = () => null

const LOGIN = ROUTES.STAFF_LOGIN.path
const FORBIDDEN = ROUTES.STAFF_403.path

export function StaffApp() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<BlankLayout />}>
          <Route
            element={
              <RedirectIfAuthenticated resolveTarget={(user) => getStaffLandingPath(user)} />
            }
          >
            <Route path={rel(ROUTES.STAFF_LOGIN.path)} element={<BlankScreen />} />
          </Route>
        </Route>

        <Route element={<RequireAuth loginPath={LOGIN} />}>
          <Route element={<CounterLayout />}>
            <Route
              element={
                <RequireRole
                  roles={['CASHIER', 'ADMIN']}
                  loginPath={LOGIN}
                  forbiddenPath={FORBIDDEN}
                />
              }
            >
              <Route path={rel(ROUTES.STAFF_POS.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_POS_CONCESSION.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_SCANNER.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_CLOSE_SHIFT.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_LOOKUP.path)} element={<BlankScreen />} />
            </Route>
          </Route>

          <Route element={<AdminLayout />}>
            <Route
              element={
                <RequireRole roles={['ADMIN']} loginPath={LOGIN} forbiddenPath={FORBIDDEN} />
              }
            >
              <Route path={rel(ROUTES.STAFF_MOVIES.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_MOVIE_NEW.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_MOVIE_EDIT.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_CINEMAS.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_CINEMA_EDIT.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_AUDITORIUMS.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_SEAT_MAP.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_SCHEDULE.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_PRICING.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_REPORTS_ANALYTICS.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_TEAM.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_AUDIT.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_PROMOTIONS.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_PROMOTION_FORM.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_PRODUCTS.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_INVENTORY.path)} element={<BlankScreen />} />
            </Route>

            <Route
              element={
                <RequireRole
                  roles={['CASHIER', 'ADMIN']}
                  loginPath={LOGIN}
                  forbiddenPath={FORBIDDEN}
                />
              }
            >
              <Route path={rel(ROUTES.STAFF_REPORTS_DAILY.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_BOOKINGS.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_BOOKING_DETAIL.path)} element={<BlankScreen />} />
              <Route path={rel(ROUTES.STAFF_REFUNDS.path)} element={<BlankScreen />} />
            </Route>

            <Route path="*" element={<NotFoundScreen />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
