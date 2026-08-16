import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import type { RefundRequestRef } from '@/entities/booking/api/bookings'
import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { PageResponse } from '@/shared/api/types'
import type {
  BookingChannel,
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  RefundStatus,
} from '@/shared/types/domain'

export interface AdminBookingListParams {
  cinemaId?: string
  businessDate?: string
  status?: BookingStatus
  channel?: BookingChannel
  q?: string
  page?: number
  size?: number
}

export interface AdminBookingSummary {
  code: string
  status: BookingStatus
  channel: BookingChannel
  customerName: string
  movieTitle: string
  startsAt: string
  totalVnd: number
  createdAt: string
}

export function listAdminBookings(params: AdminBookingListParams) {
  return apiClient
    .get<PageResponse<AdminBookingSummary>>('/admin/bookings', { params })
    .then((res) => res.data)
}

export function adminBookingsListOptions(params: AdminBookingListParams) {
  return queryOptions({
    queryKey: queryKeys.admin.bookings.list(params),
    queryFn: () => listAdminBookings(params),
    placeholderData: keepPreviousData,
  })
}

export interface PaymentEvent {
  receivedAt: string
  eventType: string
  signatureValid: boolean
  processResult: string
}

export interface BookingTimelineEvent {
  at: string
  event: string
}

export interface AdminBookingDetail {
  code: string
  status: BookingStatus
  channel: BookingChannel
  customer: { fullName: string; email: string; phone: string }
  screening: unknown
  items: unknown[]
  tickets: unknown[]
  payment: {
    method: PaymentMethod
    status: PaymentStatus
    providerTxnNo: string
    completedAt: string
  } | null
  paymentEvents: PaymentEvent[]
  refundRequest: RefundRequestRef | null
  timeline: BookingTimelineEvent[]
}

export function getAdminBooking(code: string) {
  return apiClient.get<AdminBookingDetail>(`/admin/bookings/${code}`).then((res) => res.data)
}

export function adminBookingDetailOptions(code: string) {
  return queryOptions({
    queryKey: queryKeys.admin.bookings.detail(code),
    queryFn: () => getAdminBooking(code),
  })
}

export interface RefundRequestListParams {
  status?: RefundStatus
  cinemaId?: string
  from?: string
  to?: string
  page?: number
  size?: number
}

export interface RefundRequestRow {
  id: string
  bookingCode: string
  customer: { fullName: string; phone: string }
  movieTitle: string
  startsAt: string
  originalVnd: number
  feeVnd: number
  refundVnd: number
  reason: string
  reasonNote?: string
  bankAccountNo: string
  bankAccountName: string
  bankName: string
  status: RefundStatus
  requestedAt: string
}

export function listRefundRequests(params: RefundRequestListParams) {
  return apiClient
    .get<PageResponse<RefundRequestRow>>('/admin/refund-requests', { params })
    .then((res) => res.data)
}

export function refundRequestsListOptions(params: RefundRequestListParams) {
  return queryOptions({
    queryKey: queryKeys.admin.refundRequests.list(params),
    queryFn: () => listRefundRequests(params),
    placeholderData: keepPreviousData,
  })
}

export function approveRefundRequest(id: string, body: { transferRef: string; note?: string }) {
  return apiClient
    .post<RefundRequestRow>(`/admin/refund-requests/${id}/approve`, body)
    .then((res) => res.data)
}

export function rejectRefundRequest(id: string, body: { note: string }) {
  return apiClient
    .post<RefundRequestRow>(`/admin/refund-requests/${id}/reject`, body)
    .then((res) => res.data)
}
