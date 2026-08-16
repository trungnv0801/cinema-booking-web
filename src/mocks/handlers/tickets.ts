import { http, HttpResponse } from 'msw'

import { sampleTicket } from '../fixtures/tickets'
import { API_BASE, problem } from '../problem'

export const ticketHandlers = [
  http.get(`${API_BASE}/tickets`, ({ request }) => {
    const url = new URL(request.url)
    const scope = url.searchParams.get('scope') ?? 'UPCOMING'
    const items =
      scope === 'UPCOMING'
        ? [
            {
              code: sampleTicket.code,
              status: sampleTicket.status,
              movieTitle: sampleTicket.movie.title,
              cinemaName: sampleTicket.cinema.name,
              startsAt: sampleTicket.startsAt,
              seatLabel: sampleTicket.seatLabel,
            },
          ]
        : []

    return HttpResponse.json({
      items,
      page: 0,
      size: 20,
      totalItems: items.length,
      totalPages: 1,
      hasNext: false,
    })
  }),

  http.get(`${API_BASE}/tickets/:code`, ({ params }) => {
    if (params.code !== sampleTicket.code) {
      return problem({ status: 404, code: 'NOT_FOUND', title: 'Ticket not found' })
    }
    return HttpResponse.json(sampleTicket)
  }),
]
