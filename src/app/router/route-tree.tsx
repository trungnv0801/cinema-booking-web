import { type ComponentType, lazy, Suspense } from 'react'

import type { RouteObject } from 'react-router-dom'

import { CheckoutLayout } from '@/contexts/guest/layouts/CheckoutLayout'
import { MinimalLayout } from '@/contexts/guest/layouts/MinimalLayout'
import { PublicLayout } from '@/contexts/guest/layouts/PublicLayout'
import { StatusLayout } from '@/contexts/guest/layouts/StatusLayout'
import { RedirectIfAuthenticated, RequireAuth } from '@/entities/session'
import { DEV_UI_GALLERY_PATH, ROUTES, STAFF_BASE_PATH } from '@/shared/routing/registry'

import { BlankScreen } from './BlankScreen'

function screen<Name extends string>(
  load: () => Promise<Record<Name, ComponentType>>,
  name: Name,
): NonNullable<RouteObject['lazy']> {
  return async () => ({ Component: (await load())[name] })
}

export const routeTree: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME.path, element: <BlankScreen /> },
      { path: ROUTES.MOVIES.path, element: <BlankScreen /> },
      { path: ROUTES.MOVIE_DETAIL.path, element: <BlankScreen /> },
      { path: ROUTES.SHOWTIMES.path, element: <BlankScreen /> },
      { path: ROUTES.BOOKING_RESULT.path, element: <BlankScreen /> },
      { path: ROUTES.ORDER_PICKUP.path, element: <BlankScreen /> },
      {
        path: ROUTES.SERVER_ERROR.path,
        lazy: screen(() => import('@/contexts/guest/pages/ServerErrorScreen'), 'ServerErrorScreen'),
      },
      {
        path: ROUTES.STAFF_403.path,
        lazy: screen(() => import('@/contexts/staff/pages/ForbiddenScreen'), 'ForbiddenScreen'),
      },
      {
        element: <RequireAuth loginPath={ROUTES.LOGIN.path} />,
        children: [
          { path: ROUTES.TICKETS.path, element: <BlankScreen /> },
          { path: ROUTES.TICKET_DETAIL.path, element: <BlankScreen /> },
          { path: ROUTES.TICKET_CANCEL.path, element: <BlankScreen /> },
          { path: ROUTES.ACCOUNT.path, element: <BlankScreen /> },
          { path: ROUTES.ACCOUNT_POINTS.path, element: <BlankScreen /> },
        ],
      },
      {
        path: '*',
        lazy: screen(() => import('@/contexts/guest/pages/NotFoundScreen'), 'NotFoundScreen'),
      },
    ],
  },

  {
    element: <CheckoutLayout />,
    children: [
      { path: ROUTES.BOOKING_SEATS.path, element: <BlankScreen /> },
      { path: ROUTES.BOOKING_CONCESSIONS.path, element: <BlankScreen /> },
      { path: ROUTES.BOOKING_CONFIRM.path, element: <BlankScreen /> },
    ],
  },

  {
    element: <MinimalLayout />,
    children: [
      {
        element: <RedirectIfAuthenticated resolveTarget={() => ROUTES.HOME.path} />,
        children: [
          {
            path: ROUTES.LOGIN.path,
            lazy: screen(() => import('@/contexts/guest/pages/LoginScreen'), 'LoginScreen'),
          },
          { path: ROUTES.REGISTER.path, element: <BlankScreen /> },
        ],
      },
      { path: ROUTES.FORGOT_PASSWORD.path, element: <BlankScreen /> },
      { path: ROUTES.RESET_PASSWORD.path, element: <BlankScreen /> },
    ],
  },

  {
    element: <StatusLayout />,
    children: [{ path: ROUTES.VERIFY_EMAIL.path, element: <BlankScreen /> }],
  },
  {
    path: `${STAFF_BASE_PATH}/*`,
    lazy: screen(() => import('@/contexts/staff/StaffApp'), 'StaffApp'),
  },
]

if (import.meta.env.DEV) {
  const UiGallery = lazy(() =>
    import('@/shared/ui/dev/UiGallery').then((m) => ({ default: m.UiGallery })),
  )
  routeTree.push({
    path: DEV_UI_GALLERY_PATH,
    element: (
      <Suspense fallback={null}>
        <UiGallery />
      </Suspense>
    ),
  })
}
