import type { SeatState, SeatType } from '@/shared/types/domain'

export interface RawSeat {
  id: string
  label: string
  row: string
  number: number
  type: SeatType
  coupleGroup: string | null
  gridRow: number
  gridCol: number
  state: SeatState
}

export interface SeatTypeDef {
  type: SeatType
  name: string
  priceVnd: number
  seatsPerUnit?: number
}

export interface AuditoriumGrid {
  name: string
  gridRows: number
  gridCols: number
}

export interface SeatMapResponse {
  screeningId: string
  auditorium: AuditoriumGrid
  seatTypes: SeatTypeDef[]
  seats: RawSeat[]
}

export interface SingleSeat {
  kind: 'single'
  id: string
  label: string
  row: string
  number: number
  type: Exclude<SeatType, 'COUPLE'>
  gridRow: number
  gridCol: number
  state: SeatState
}

export interface CoupleSeatUnit {
  kind: 'couple'
  id: string
  label: string
  seatIds: [string, string]
  type: 'COUPLE'
  gridRow: number
  gridColStart: number
  gridColEnd: number
  state: SeatState
}

export type SeatUnit = SingleSeat | CoupleSeatUnit

export function seatCount(unit: SeatUnit): 1 | 2 {
  return unit.kind === 'couple' ? 2 : 1
}

export function totalSeatCount(units: SeatUnit[]): number {
  return units.reduce((sum, unit) => sum + seatCount(unit), 0)
}

const STATE_PRIORITY: SeatState[] = ['SOLD', 'HELD', 'DISABLED', 'AVAILABLE']

function worstSeatState(states: SeatState[]): SeatState {
  for (const candidate of STATE_PRIORITY) {
    if (states.includes(candidate)) return candidate
  }
  return 'AVAILABLE'
}

export function groupSeatsIntoUnits(seats: RawSeat[]): SeatUnit[] {
  const coupleGroups = new Map<string, RawSeat[]>()
  const units: SeatUnit[] = []

  for (const seat of seats) {
    if (!seat.coupleGroup) {
      units.push({
        kind: 'single',
        id: seat.id,
        label: seat.label,
        row: seat.row,
        number: seat.number,
        type: seat.type as Exclude<SeatType, 'COUPLE'>,
        gridRow: seat.gridRow,
        gridCol: seat.gridCol,
        state: seat.state,
      })
      continue
    }

    const group = coupleGroups.get(seat.coupleGroup) ?? []
    group.push(seat)
    coupleGroups.set(seat.coupleGroup, group)
  }

  for (const [groupId, groupSeats] of coupleGroups) {
    const sorted = [...groupSeats].sort((a, b) => a.gridCol - b.gridCol)
    const [first, second, ...extra] = sorted
    if (!first) continue

    if (extra.length > 0) {
      console.warn(
        `coupleGroup "${groupId}" has ${sorted.length} seats, expected 2; extras rendered as single seats.`,
      )
      for (const seat of extra) {
        units.push({
          kind: 'single',
          id: seat.id,
          label: seat.label,
          row: seat.row,
          number: seat.number,
          type: seat.type as Exclude<SeatType, 'COUPLE'>,
          gridRow: seat.gridRow,
          gridCol: seat.gridCol,
          state: seat.state,
        })
      }
    }

    if (!second) {
      console.warn(
        `Seat ${first.id} has coupleGroup "${groupId}" with no partner seat; rendering as a single seat.`,
      )
      units.push({
        kind: 'single',
        id: first.id,
        label: first.label,
        row: first.row,
        number: first.number,
        type: first.type as Exclude<SeatType, 'COUPLE'>,
        gridRow: first.gridRow,
        gridCol: first.gridCol,
        state: first.state,
      })
      continue
    }

    units.push({
      kind: 'couple',
      id: groupId,
      label: `${first.label}–${second.label}`,
      seatIds: [first.id, second.id],
      type: 'COUPLE',
      gridRow: first.gridRow,
      gridColStart: first.gridCol,
      gridColEnd: second.gridCol,
      state: worstSeatState([first.state, second.state]),
    })
  }

  return units
}
