import { http, HttpResponse } from 'msw'

import type { CreatePaymentRequest, CreatePaymentResponse } from '@/entities/booking/api/payments'

import { API_BASE, problem } from '../problem'
import { paymentPollCounts } from '../state'

export const paymentHandlers = [
  http.post(`${API_BASE}/bookings/:code/payments`, async ({ request }) => {
    const body = (await request.json()) as CreatePaymentRequest
    const paymentId = crypto.randomUUID()
    paymentPollCounts.set(paymentId, 0)

    const response: CreatePaymentResponse = {
      paymentId,
      method: body.method,
      amountVnd: 182_000,
      status: 'PENDING',
      redirectUrl: `https://checkout.paybridge.com/session/${paymentId}`,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    }
    return HttpResponse.json(response, { status: 201 })
  }),

  http.get(`${API_BASE}/payments/:publicId`, ({ params }) => {
    const publicId = params.publicId as string
    const existing = paymentPollCounts.get(publicId)
    if (existing === undefined) {
      return problem({ status: 404, code: 'PAYMENT_NOT_FOUND', title: 'Payment not found' })
    }
    const count = existing + 1
    paymentPollCounts.set(publicId, count)

    const status = count <= 2 ? 'PENDING' : 'PAID'

    return HttpResponse.json({
      id: publicId,
      status,
      method: 'PAYBRIDGE',
      amountVnd: 182_000,
      bookingCode: 'BK-7K2X',
      completedAt: status === 'PAID' ? new Date().toISOString() : null,
    })
  }),
]
