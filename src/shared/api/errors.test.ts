import type { AxiosError } from 'axios'
import { describe, expect, it } from 'vitest'

import { normalizeError } from './errors'

function fakeAxiosError(init: {
  status?: number
  data?: Record<string, unknown>
  headers?: Record<string, string>
  message?: string
  hasResponse?: boolean
}): AxiosError {
  const {
    status = 409,
    data = {},
    headers = {},
    message = 'Request failed',
    hasResponse = true,
  } = init

  return {
    isAxiosError: true,
    message,
    name: 'AxiosError',
    toJSON: () => ({}),
    response: hasResponse
      ? {
          status,
          data,
          headers,
          statusText: '',
          config: {} as never,
        }
      : undefined,
  } as unknown as AxiosError
}

describe('normalizeError', () => {
  it('preserves extension fields not in the seven standard Problem Details fields', () => {
    const error = fakeAxiosError({
      status: 409,
      data: {
        type: 'https://api.halcyoncinemas.com/problems/seat-unavailable',
        title: 'Seat no longer available',
        status: 409,
        detail: 'Seats D5, D6 were just booked by someone else.',
        instance: '/api/v1/bookings',
        code: 'SEAT_UNAVAILABLE',
        traceId: '0af7651916cd43dd',
        timestamp: '2026-10-15T19:24:31+07:00',
        unavailableSeats: ['D5', 'D6'],
      },
    })

    const result = normalizeError(error)

    expect(result.code).toBe('SEAT_UNAVAILABLE')
    expect(result.status).toBe(409)
    expect(result.extensions).toEqual({ unavailableSeats: ['D5', 'D6'] })
  })

  it('maps 422 errors[] onto fields', () => {
    const error = fakeAxiosError({
      status: 422,
      data: {
        code: 'VALIDATION_FAILED',
        title: 'Validation failed',
        traceId: 'abc123',
        errors: [
          { field: 'email', code: 'INVALID_FORMAT', message: 'Enter a valid email address' },
          { field: 'seatIds', code: 'NOT_EMPTY', message: 'Select at least one seat' },
        ],
      },
    })

    const result = normalizeError(error)

    expect(result.fields).toHaveLength(2)
    expect(result.fields?.[0]).toEqual({
      field: 'email',
      code: 'INVALID_FORMAT',
      message: 'Enter a valid email address',
    })
  })

  it('surfaces Retry-After on 429 responses', () => {
    const error = fakeAxiosError({
      status: 429,
      data: { code: 'RATE_LIMIT_EXCEEDED', title: 'Too many requests', traceId: 'trace-1' },
      headers: { 'retry-after': '30' },
    })

    const result = normalizeError(error)

    expect(result.extensions.retryAfter).toBe('30')
  })

  it('captures the trace ID from the X-Trace-Id response header over the body', () => {
    const error = fakeAxiosError({
      status: 500,
      data: { code: 'INTERNAL_ERROR', title: 'Server error', traceId: 'body-trace' },
      headers: { 'x-trace-id': 'header-trace' },
    })

    expect(normalizeError(error).traceId).toBe('header-trace')
  })

  it('produces a NETWORK_ERROR code when there is no response at all', () => {
    const error = fakeAxiosError({ hasResponse: false, message: 'Network Error' })

    const result = normalizeError(error)

    expect(result.code).toBe('NETWORK_ERROR')
    expect(result.status).toBe(0)
  })
})
