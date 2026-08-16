import { http, HttpResponse } from 'msw'

import type { CreateHoldRequest } from '@/entities/booking/api/holds'

import {
  buildSeatMap,
  CONFLICT_SEAT_LABEL,
  ORPHAN_STRANDED_LABEL,
  ORPHAN_TRIGGER_LABEL,
} from '../fixtures/seat-map'
import { API_BASE, problem } from '../problem'
import { HOLD_DURATION_SECONDS, holdStore } from '../state'

const MAX_SEATS = 8

export const holdHandlers = [
  http.post(`${API_BASE}/screenings/:id/holds`, async ({ params, request }) => {
    const screeningId = params.id as string
    const body = (await request.json()) as CreateHoldRequest
    const seatMap = buildSeatMap(screeningId)

    const chosen = body.seatIds
      .map((id) => seatMap.seats.find((s) => s.id === id))
      .filter((s): s is NonNullable<typeof s> => !!s)

    const conflict = chosen.find((s) => s.label === CONFLICT_SEAT_LABEL || s.state !== 'AVAILABLE')
    if (conflict) {
      return problem({
        status: 409,
        code: 'SEAT_UNAVAILABLE',
        title: 'Seat no longer available',
        detail: `Seat ${conflict.label} was just booked by someone else.`,
        extensions: { unavailableSeats: [conflict.label] },
      })
    }

    const hasOrphanTrigger = chosen.some((s) => s.label === ORPHAN_TRIGGER_LABEL)
    if (hasOrphanTrigger) {
      return problem({
        status: 422,
        code: 'ORPHAN_SEAT',
        title: 'Selection strands a single seat',
        extensions: { orphanSeats: [ORPHAN_STRANDED_LABEL] },
      })
    }

    const coupleGroups = new Map<string, number>()
    for (const seat of chosen) {
      if (!seat.coupleGroup) continue
      coupleGroups.set(seat.coupleGroup, (coupleGroups.get(seat.coupleGroup) ?? 0) + 1)
    }
    for (const [groupId, count] of coupleGroups) {
      if (count === 1) {
        const partner = seatMap.seats.find((s) => s.coupleGroup === groupId && !chosen.includes(s))
        return problem({
          status: 422,
          code: 'COUPLE_SEAT_INCOMPLETE',
          title: 'Couple seat selected partially',
          extensions: { requiredSeats: partner ? [partner.label] : [] },
        })
      }
    }

    const effectiveSeatCount = chosen.filter((s) => !s.coupleGroup).length + coupleGroups.size * 2
    if (effectiveSeatCount > MAX_SEATS) {
      return problem({
        status: 409,
        code: 'HOLD_LIMIT_EXCEEDED',
        title: 'Too many seats in one hold',
        extensions: { maxSeats: MAX_SEATS },
      })
    }

    const holdGroup = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + HOLD_DURATION_SECONDS * 1000).toISOString()

    const hold = {
      holdGroup,
      screeningId,
      seats: chosen.map((s) => ({ id: s.id, label: s.label, type: s.type })),
      expiresAt,
      remainingSeconds: HOLD_DURATION_SECONDS,
    }
    holdStore.set(holdGroup, hold)

    return HttpResponse.json(hold, { status: 201 })
  }),

  http.get(`${API_BASE}/holds/:holdGroup`, ({ params }) => {
    const hold = holdStore.get(params.holdGroup as string)
    if (!hold) {
      return problem({ status: 410, code: 'HOLD_EXPIRED', title: '10-minute hold ran out' })
    }

    const remainingSeconds = Math.max(
      0,
      Math.round((new Date(hold.expiresAt).getTime() - Date.now()) / 1000),
    )
    if (remainingSeconds <= 0) {
      holdStore.delete(params.holdGroup as string)
      return problem({ status: 410, code: 'HOLD_EXPIRED', title: '10-minute hold ran out' })
    }

    return HttpResponse.json({ ...hold, remainingSeconds })
  }),

  http.delete(`${API_BASE}/holds/:holdGroup`, ({ params }) => {
    holdStore.delete(params.holdGroup as string)
    return new HttpResponse(null, { status: 204 })
  }),
]
