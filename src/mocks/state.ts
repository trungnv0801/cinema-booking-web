import type { BookingResponse } from '@/entities/booking/api/bookings'
import type { HoldResponse } from '@/entities/booking/api/holds'
import type { PaymentStatus } from '@/shared/types/domain'

export const holdStore = new Map<string, HoldResponse & { screeningId: string }>()
export const idempotentBookings = new Map<string, BookingResponse>()
export const paymentPollCounts = new Map<string, number>()
export const paymentStatuses = new Map<string, PaymentStatus>()

export const HOLD_DURATION_SECONDS = 600
