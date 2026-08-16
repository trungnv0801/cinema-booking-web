import { queryOptions } from '@tanstack/react-query'

import type { BookingSummary } from '@/entities/booking/api/bookings'
import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { BookingStatus, PaymentMethod, ShiftStatus } from '@/shared/types/domain'

export interface PosScreening {
  id: string
  startsAt: string
  movieTitle: string
  auditoriumName: string
  availableSeats: number
  totalSeats: number
  occupancyPercent: number
}

export interface PosScreeningsParams {
  date?: string
  auditoriumId?: string
}

export function getPosScreenings(params: PosScreeningsParams) {
  return apiClient.get<PosScreening[]>('/pos/screenings', { params }).then((res) => res.data)
}

export function posScreeningsOptions(params: PosScreeningsParams) {
  return queryOptions({
    queryKey: queryKeys.pos.screenings(params),
    queryFn: () => getPosScreenings(params),
  })
}

export interface CreatePosBookingItem {
  seatId: string
  ticketTypeCode: string
}

export interface CreatePosBookingRequest {
  screeningId: string
  items: CreatePosBookingItem[]
  paymentMethod: PaymentMethod
  receivedCashVnd?: number
  customerPhone?: string
}

export interface PosTicket {
  code: string
  seatLabel: string
  qrToken: string
}

export interface CreatePosBookingResponse {
  code: string
  status: BookingStatus
  totalVnd: number
  receivedCashVnd?: number
  changeVnd?: number
  tickets: PosTicket[]
  printPayload: { cinemaName: string; movieTitle: string; startsAt: string; seats: string[] }
}

export function createPosBooking(body: CreatePosBookingRequest, idempotencyKey: string) {
  return apiClient
    .post<CreatePosBookingResponse>('/pos/bookings', body, {
      headers: { 'Idempotency-Key': idempotencyKey },
    })
    .then((res) => res.data)
}

export interface PosBookingLookupParams {
  phone?: string
  code?: string
  email?: string
}

export function lookupPosBookings(params: PosBookingLookupParams) {
  return apiClient.get<BookingSummary[]>('/pos/bookings/lookup', { params }).then((res) => res.data)
}

export function posBookingLookupOptions(params: PosBookingLookupParams) {
  return queryOptions({
    queryKey: queryKeys.pos.lookup(params),
    queryFn: () => lookupPosBookings(params),
  })
}

export interface CancelPosBookingRequest {
  reason: string
  refundMethod: 'CASH'
}

export function cancelPosBooking(code: string, body: CancelPosBookingRequest) {
  return apiClient.post(`/pos/bookings/${code}/cancel`, body).then((res) => res.data)
}

export interface ShiftResponse {
  cinemaId: string
  businessDate: string
  status: ShiftStatus
  systemCashVnd: number
  systemOnlineVnd: number
  ticketsSold: number
  ticketsCancelled: number
  refundedVnd: number
}

export function getShift() {
  return apiClient.get<ShiftResponse>('/pos/shift').then((res) => res.data)
}

export function shiftOptions() {
  return queryOptions({ queryKey: queryKeys.pos.shift, queryFn: getShift })
}

export interface CloseShiftRequest {
  countedCashVnd: number
  differenceNote?: string
}

export interface CloseShiftResponse {
  status: 'CLOSED'
  systemCashVnd: number
  countedCashVnd: number
  differenceVnd: number
  closedAt: string
}

export function closeShift(body: CloseShiftRequest) {
  return apiClient.post<CloseShiftResponse>('/pos/shift/close', body).then((res) => res.data)
}
