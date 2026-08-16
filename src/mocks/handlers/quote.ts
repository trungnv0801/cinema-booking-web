import { http, HttpResponse } from 'msw'

import type { QuoteRequest, QuoteResponse } from '@/entities/booking/api/holds'

import { buildSeatMap } from '../fixtures/seat-map'
import { API_BASE } from '../problem'

export const quoteHandlers = [
  http.post(`${API_BASE}/screenings/:id/quote`, async ({ params, request }) => {
    const seatMap = buildSeatMap(params.id as string)
    const body = (await request.json()) as QuoteRequest
    const isWednesday = new Date().getDay() === 3

    let subtotalVnd = 0
    let discountVnd = 0

    const items = body.items.map((item) => {
      const seat = seatMap.seats.find((s) => s.id === item.seatId)
      const typeDef = seatMap.seatTypes.find((t) => t.type === seat?.type)
      const basePriceVnd = typeDef?.priceVnd ?? 0

      const marqueeDiscount = isWednesday ? Math.round(basePriceVnd * 0.3) : 0
      const studentDiscount = item.ticketTypeCode === 'STUDENT' ? Math.round(basePriceVnd * 0.2) : 0
      const discount = Math.max(marqueeDiscount, studentDiscount)
      const appliedDiscount =
        discount === 0
          ? null
          : discount === marqueeDiscount
            ? { code: 'MARQUEE_WEDNESDAY', label: 'Marquee Wednesdays', percent: 30 }
            : { code: 'STUDENT_DISCOUNT', label: 'Student discount', percent: 20 }

      subtotalVnd += basePriceVnd
      discountVnd += discount

      return {
        seatId: item.seatId,
        seatLabel: seat?.label ?? '',
        seatType: seat?.type ?? 'STANDARD',
        ticketTypeCode: item.ticketTypeCode,
        basePriceVnd,
        surchargeVnd: 0,
        discountVnd: discount,
        finalPriceVnd: basePriceVnd - discount,
        appliedDiscount,
      }
    })

    const response: QuoteResponse = {
      items,
      subtotalVnd,
      discountVnd,
      totalVnd: subtotalVnd - discountVnd,
    }

    return HttpResponse.json(response)
  }),
]
