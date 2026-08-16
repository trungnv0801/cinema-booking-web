import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useSessionStore } from '@/entities/session'
import { ROUTES } from '@/shared/routing/registry'

import { routeTree } from './route-tree'

import '@/shared/i18n'

function renderAt(path: string) {
  const router = createMemoryRouter(routeTree, { initialEntries: [path] })
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return { ...utils, router }
}

describe('the /staff bundle boundary', () => {
  beforeEach(() => {
    useSessionStore.setState({ user: null, status: 'anonymous' })
  })

  it('resolves a staff path through the lazy boundary instead of 404ing', async () => {
    useSessionStore.setState({
      status: 'authenticated',
      user: { id: 'u1', fullName: 'Cashier', roles: ['CASHIER'], cinemaIds: ['c1'] },
    })
    renderAt(ROUTES.STAFF_403.path)
    expect(await screen.findByText("You Don't Have Access to This Page")).toBeInTheDocument()
  })

  it('sends an anonymous visitor from a guarded staff route to the staff login', async () => {
    const { router } = renderAt(ROUTES.STAFF_POS.path)
    await waitFor(() => {
      expect(router.state.location.pathname).toBe(ROUTES.STAFF_LOGIN.path)
    })
  })

  it('bounces a signed-in cashier off an admin-only route to /staff/403', async () => {
    useSessionStore.setState({
      status: 'authenticated',
      user: { id: 'u1', fullName: 'Cashier', roles: ['CASHIER'], cinemaIds: ['c1'] },
    })
    const { router } = renderAt(ROUTES.STAFF_PRICING.path)
    await waitFor(() => {
      expect(router.state.location.pathname).toBe(ROUTES.STAFF_403.path)
    })
  })

  it('lets a signed-in admin reach an admin-only route', async () => {
    useSessionStore.setState({
      status: 'authenticated',
      user: { id: 'u1', fullName: 'Admin', roles: ['ADMIN'], cinemaIds: [] },
    })
    const { router } = renderAt(ROUTES.STAFF_PRICING.path)
    await screen.findByRole('navigation')
    expect(router.state.location.pathname).toBe(ROUTES.STAFF_PRICING.path)
  })

  it('lets a signed-in cashier reach a route shared with admin', async () => {
    useSessionStore.setState({
      status: 'authenticated',
      user: { id: 'u1', fullName: 'Cashier', roles: ['CASHIER'], cinemaIds: ['c1'] },
    })
    const { router } = renderAt(ROUTES.STAFF_REPORTS_DAILY.path)
    await screen.findByRole('navigation')
    expect(router.state.location.pathname).toBe(ROUTES.STAFF_REPORTS_DAILY.path)
  })

  it('still renders the guest tree, which must not pull the staff chunk in', async () => {
    renderAt(ROUTES.HOME.path)
    expect(await screen.findByRole('banner')).toBeInTheDocument()
  })
})
