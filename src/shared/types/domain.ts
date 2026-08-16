export type Role = 'CUSTOMER' | 'CASHIER' | 'ADMIN'

export type MovieStatus = 'NOW_SHOWING' | 'COMING_SOON' | 'ARCHIVED'

export type SeatState = 'AVAILABLE' | 'HELD' | 'SOLD' | 'DISABLED'

export type SeatType = 'STANDARD' | 'VIP' | 'COUPLE'

export type BookingStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'

export type BookingChannel = 'ONLINE' | 'COUNTER'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED'

export type PaymentMethod = 'PAYBRIDGE' | 'CASH'

export type TicketStatus = 'VALID' | 'USED' | 'VOIDED'

export type ContentRating = 'All Ages' | 'PG' | '13+' | '16+' | '18+' | 'Restricted'

export type ScanResult =
  'VALID' | 'ALREADY_USED' | 'WRONG_SCREENING' | 'NOT_FOUND' | 'VOIDED' | 'TOO_EARLY' | 'TOO_LATE'

export type ScreeningStatus = 'SCHEDULED' | 'CANCELLED'

export type RefundStatus = 'PENDING' | 'COMPLETED' | 'REJECTED'

export type ShiftStatus = 'OPEN' | 'CLOSED'

export interface Money {
  amountVnd: number
}

export interface Genre {
  code: string
  name: string
}

export interface Cinema {
  id: string
  code: 'MB' | 'BL' | 'EF' | string
  name: string
  address: string
  district: string
  latitude: number
  longitude: number
}

export interface TicketTypeDef {
  code: string
  name: string
  discountPercent: number
  requiresProof: boolean
  proofNote?: string
}

export interface DiscountRef {
  code: string
  label: string
  percent: number
}
