import type { SeatMapResponse, SeatTypeDef } from '@/entities/seat/model'
import type { SeatState, SeatType } from '@/shared/types/domain'

import { holdStore } from '../state'

export const seatTypes: SeatTypeDef[] = [
  { type: 'STANDARD', name: 'Standard Seat', priceVnd: 100_000 },
  { type: 'VIP', name: 'VIP Seat', priceVnd: 130_000 },
  { type: 'COUPLE', name: 'Couple Seat', priceVnd: 150_000, seatsPerUnit: 2 },
]

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const AISLE_COL = 6
const SOLD_LABELS = new Set(['B3', 'B4', 'C10'])
const DISABLED_LABELS = new Set(['G2'])

function seatTypeForRow(row: string): SeatType {
  if (row === 'D' || row === 'E') return 'VIP'
  if (row === 'H') return 'COUPLE'
  return 'STANDARD'
}

export const CONFLICT_SEAT_LABEL = 'D5'

export const ORPHAN_TRIGGER_LABEL = 'C9'
export const ORPHAN_STRANDED_LABEL = 'C8'

function heldSeatIdsFor(screeningId: string): Set<string> {
  const now = Date.now()
  const held = new Set<string>()
  for (const hold of holdStore.values()) {
    if (hold.screeningId !== screeningId) continue
    if (new Date(hold.expiresAt).getTime() <= now) continue
    for (const seat of hold.seats) held.add(seat.id)
  }
  return held
}

export function buildSeatMap(screeningId: string): SeatMapResponse {
  const seats: SeatMapResponse['seats'] = []
  const heldSeatIds = heldSeatIdsFor(screeningId)

  for (let r = 0; r < ROWS.length; r++) {
    const row = ROWS[r]
    if (!row) continue

    if (row === 'H') {
      for (let unit = 0; unit < 6; unit++) {
        const col1 = unit * 2 + 1
        const col2 = unit * 2 + 2
        const groupId = `couple-${unit + 1}`
        const label1 = `H${col1}`
        const label2 = `H${col2}`
        const id1 = `seat-h${col1}`
        const id2 = `seat-h${col2}`
        seats.push({
          id: id1,
          label: label1,
          row,
          number: col1,
          type: 'COUPLE',
          coupleGroup: groupId,
          gridRow: r + 1,
          gridCol: col1,
          state: heldSeatIds.has(id1) ? 'HELD' : 'AVAILABLE',
        })
        seats.push({
          id: id2,
          label: label2,
          row,
          number: col2,
          type: 'COUPLE',
          coupleGroup: groupId,
          gridRow: r + 1,
          gridCol: col2,
          state: heldSeatIds.has(id2) ? 'HELD' : 'AVAILABLE',
        })
      }
      continue
    }

    for (let c = 1; c <= 12; c++) {
      if (c === AISLE_COL) continue

      const label = `${row}${c}`
      const id = `seat-${label.toLowerCase()}`
      const state: SeatState = SOLD_LABELS.has(label)
        ? 'SOLD'
        : DISABLED_LABELS.has(label)
          ? 'DISABLED'
          : heldSeatIds.has(id)
            ? 'HELD'
            : 'AVAILABLE'

      seats.push({
        id,
        label,
        row,
        number: c,
        type: seatTypeForRow(row),
        coupleGroup: null,
        gridRow: r + 1,
        gridCol: c,
        state,
      })
    }
  }

  return {
    screeningId,
    auditorium: { name: 'Screen 3', gridRows: 8, gridCols: 12 },
    seatTypes,
    seats,
  }
}
