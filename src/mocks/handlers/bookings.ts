import { http, HttpResponse } from 'msw'

import type { BookingResponse, CreateBookingRequest } from '@/entities/booking/api/bookings'

import { sampleBooking } from '../fixtures/bookings'
import { API_BASE, problem } from '../problem'
import { holdStore, idempotentBookings } from '../state'

let bookingCounter = 1

export const bookingHandlers = [
  http.post(`${API_BASE}/bookings`, async ({ request }) => {
    const idempotencyKey = request.headers.get('Idempotency-Key')
    if (idempotencyKey && idempotentBookings.has(idempotencyKey)) {
      return HttpResponse.json(idempotentBookings.get(idempotencyKey), { status: 201 })
    }

    const body = (await request.json()) as CreateBookingRequest

    if (!body.ageConfirmed) {
      return problem({
        status: 422,
        code: 'AGE_CONFIRMATION_REQUIRED',
        title: 'Age checkbox not ticked',
      })
    }

    const hold = holdStore.get(body.holdGroup)
    if (!hold) {
      return problem({ status: 410, code: 'HOLD_EXPIRED', title: '10-minute hold ran out' })
    }

    const code = `BK-${(bookingCounter++).toString(36).toUpperCase().padStart(4, '0')}`
    const response: BookingResponse = {
      code,
      publicId: crypto.randomUUID(),
      status: 'PENDING',
      screening: {
        id: hold.screeningId,
        movieTitle: 'Paper Lanterns',
        cinemaName: 'Halcyon Cinemas Meridian Bay',
        auditoriumName: 'Screen 3',
        startsAt: '2026-10-15T19:30:00+07:00',
      },
      items: body.items.map((item) => {
        const seat = hold.seats.find((s) => s.id === item.seatId)
        return {
          seatLabel: seat?.label ?? '',
          seatType: seat?.type ?? 'STANDARD',
          ticketTypeCode: item.ticketTypeCode,
          finalPriceVnd: 91_000,
          discountLabel: null,
        }
      }),
      subtotalVnd: 260_000,
      discountVnd: 78_000,
      totalVnd: 182_000,
      holdExpiresAt: hold.expiresAt,
      createdAt: new Date().toISOString(),
    }

    holdStore.delete(body.holdGroup)
    if (idempotencyKey) idempotentBookings.set(idempotencyKey, response)

    return HttpResponse.json(response, { status: 201 })
  }),

  http.get(`${API_BASE}/bookings`, () =>
    HttpResponse.json({
      items: [sampleBooking],
      page: 0,
      size: 20,
      totalItems: 1,
      totalPages: 1,
      hasNext: false,
    }),
  ),

  http.get(`${API_BASE}/bookings/:code`, ({ params }) => {
    if (params.code !== sampleBooking.code) {
      return problem({ status: 404, code: 'NOT_FOUND', title: 'Booking not found' })
    }
    return HttpResponse.json(sampleBooking)
  }),

  http.post(`${API_BASE}/bookings/:code/cancel`, ({ params }) => {
    if (params.code !== sampleBooking.code) {
      return problem({ status: 404, code: 'NOT_FOUND', title: 'Booking not found' })
    }
    return HttpResponse.json({
      bookingCode: sampleBooking.code,
      bookingStatus: 'REFUNDED',
      refundRequest: {
        id: crypto.randomUUID(),
        originalVnd: 182_000,
        feeVnd: 18_200,
        refundVnd: 163_800,
        status: 'PENDING',
        estimatedDays: 3,
      },
    })
  }),
]
