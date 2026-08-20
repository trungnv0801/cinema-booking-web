import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { useSessionStore } from '@/entities/session'
import { getAccessToken, setAccessToken } from '@/shared/api/auth-token'

import { LoginScreen } from './LoginScreen'

import '@/shared/i18n'

function renderScreen() {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const router = createMemoryRouter(
    [
      { path: '/staff/login', element: <LoginScreen /> },
      { path: '/staff/pos', element: <p>POS</p> },
      { path: '/staff/reports/daily', element: <p>Daily report</p> },
    ],
    { initialEntries: ['/staff/login'] },
  )

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )

  return router
}

describe('Staff LoginScreen', () => {
  beforeEach(() => {
    setAccessToken(null)
    useSessionStore.getState().clearSession()
  })

  it('blocks submission and reports both fields when they are empty', async () => {
    const user = userEvent.setup()
    renderScreen()

    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByText('Enter your work email.')).toBeInTheDocument()
    expect(screen.getByText('Enter your password.')).toBeInTheDocument()
    expect(getAccessToken()).toBeNull()
  })

  it('shows the mapped API message when the credentials are rejected', async () => {
    const user = userEvent.setup()
    renderScreen()

    await user.type(screen.getByLabelText('Work email'), 'cashier@halcyoncinemas.com')
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Incorrect email or password.')
    expect(useSessionStore.getState().status).not.toBe('authenticated')
  })

  it('signs a cashier in and redirects to the POS', async () => {
    const user = userEvent.setup()
    const router = renderScreen()

    await user.type(screen.getByLabelText('Work email'), 'cashier@halcyoncinemas.com')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/staff/pos'))
    expect(useSessionStore.getState().user?.fullName).toBe('Jamie Chen')
    expect(getAccessToken()).not.toBeNull()
  })

  it('signs an admin in and redirects to the daily report', async () => {
    const user = userEvent.setup()
    const router = renderScreen()

    await user.type(screen.getByLabelText('Work email'), 'admin@halcyoncinemas.com')
    await user.type(screen.getByLabelText('Password'), 'password')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/staff/reports/daily'))
    expect(useSessionStore.getState().user?.fullName).toBe('Morgan Blake')
  })

  it('toggles the password field between hidden and visible', async () => {
    const user = userEvent.setup()
    renderScreen()

    const password = screen.getByLabelText('Password')
    expect(password).toHaveAttribute('type', 'password')

    await user.click(screen.getByRole('button', { name: 'Show password' }))
    expect(password).toHaveAttribute('type', 'text')

    await user.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(password).toHaveAttribute('type', 'password')
  })
})
