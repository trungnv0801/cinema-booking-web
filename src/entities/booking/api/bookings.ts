import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { PageResponse } from '@/shared/api/types'
import type {
  BookingChannel,
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
  SeatType,
  TicketStatus,
} from '@/shared/types/domain'

export interface CreateBookingItem {
  seatId: string
  ticketTypeCode: string
}

export interface CreateBookingRequest {
  holdGroup: string
  items: CreateBookingItem[]
  customerEmail: string
  customerPhone: string
  ageConfirmed: boolean
}

export interface BookingItem {
  seatLabel: string
  seatType: SeatType
  ticketTypeCode: string
  finalPriceVnd: number
  discountLabel: string | null
}

export interface BookingResponse {
  code: string
  publicId: string
  status: BookingStatus
  screening: {
    id: string
    movieTitle: string
    cinemaName: string
    auditoriumName: string
    startsAt: string
  }
  items: BookingItem[]
  subtotalVnd: number
  discountVnd: number
  totalVnd: number
  holdExpiresAt: string
  createdAt: string
}

export function createBooking(body: CreateBookingRequest, idempotencyKey: string) {
  return apiClient
    .post<BookingResponse>('/bookings', body, { headers: { 'Idempotency-Key': idempotencyKey } })
    .then((res) => res.data)
}

export interface BookingSummary {
  code: string
  status: BookingStatus
  channel: BookingChannel
  movieTitle: string
  startsAt: string
  totalVnd: number
  createdAt: string
}

export interface ListBookingsParams {
  status?: BookingStatus
  page?: number
  size?: number
}

export function listBookings(params: ListBookingsParams) {
  return apiClient
    .get<PageResponse<BookingSummary>>('/bookings', { params })
    .then((res) => res.data)
}

export function bookingsListOptions(params: ListBookingsParams) {
  return queryOptions({
    queryKey: queryKeys.bookings.list(params),
    queryFn: () => listBookings(params),
  })
}

export interface BookingDetail extends BookingResponse {
  payment: {
    method: PaymentMethod
    status: PaymentStatus
    providerTxnNo?: string
    completedAt?: string
  } | null
  tickets: { code: string; seatLabel: string; status: TicketStatus }[]
}

export function getBooking(code: string) {
  return apiClient.get<BookingDetail>(`/bookings/${code}`).then((res) => res.data)
}

export function bookingDetailOptions(code: string) {
  return queryOptions({
    queryKey: queryKeys.bookings.detail(code),
    queryFn: () => getBooking(code),
  })
}

export interface CancelBookingRequest {
  reason?: string
  bankAccountNo?: string
  bankAccountName?: string
  bankName?: string
}

export interface RefundRequestRef {
  id: string
  originalVnd: number
  feeVnd: number
  refundVnd: number
  status: RefundStatus
  estimatedDays: number
}

export interface CancelBookingResponse {
  bookingCode: string
  bookingStatus: BookingStatus
  refundRequest: RefundRequestRef
}

export function cancelBooking(code: string, body: CancelBookingRequest) {
  return apiClient
    .post<CancelBookingResponse>(`/bookings/${code}/cancel`, body)
    .then((res) => res.data)
}
