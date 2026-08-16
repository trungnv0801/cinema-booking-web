import { http, HttpResponse } from 'msw'

import type {
  BatchScreeningRequest,
  BatchScreeningResponse,
} from '@/contexts/staff/api/admin/screenings'

import { API_BASE } from '../problem'

export const adminHandlers = [
  http.post(`${API_BASE}/admin/screenings/batch`, async ({ request }) => {
    const body = (await request.json()) as BatchScreeningRequest

    const response: BatchScreeningResponse = {
      created: Math.max(0, body.screenings.length - 1),
      failed: body.screenings.length > 0 ? 1 : 0,
      results: body.screenings.map((_, index) =>
        index === body.screenings.length - 1
          ? {
              index,
              status: 'FAILED',
              code: 'SCREENING_OVERLAP',
              detail: 'Time conflict: Screen 3, 7:30–9:41 PM.',
            }
          : { index, status: 'CREATED', id: crypto.randomUUID() },
      ),
    }

    return HttpResponse.json(response, { status: 207 })
  }),
]
