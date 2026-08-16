import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { BookingChannel, ScreeningStatus } from '@/shared/types/domain'

export interface AdminScreeningRow {
  id: string
  movieId: string
  movieTitle: string
  startsAt: string
  endsAt: string
  blocksUntil: string
  basePriceVnd: number
  status: ScreeningStatus
  soldSeats: number
  totalSeats: number
  version: number
}

export interface AdminAuditoriumGroup {
  auditorium: { id: string; name: string; cinemaName: string }
  screenings: AdminScreeningRow[]
}

export interface AdminScreeningsParams {
  cinemaId?: string
  from?: string
  to?: string
  auditoriumId?: string
}

export function listAdminScreenings(params: AdminScreeningsParams) {
  return apiClient
    .get<AdminAuditoriumGroup[]>('/admin/screenings', { params })
    .then((res) => res.data)
}

export function adminScreeningsOptions(params: AdminScreeningsParams) {
  return queryOptions({
    queryKey: queryKeys.admin.screenings.list(params),
    queryFn: () => listAdminScreenings(params),
  })
}

export interface CreateScreeningRequest {
  movieId: string
  auditoriumId: string
  startsAt: string
  basePriceVnd: number
  screenType: string
  audioLanguage: string
  subtitle: string
}

export function createScreening(body: CreateScreeningRequest) {
  return apiClient.post<AdminScreeningRow>('/admin/screenings', body).then((res) => res.data)
}

export interface BatchScreeningRequest {
  screenings: CreateScreeningRequest[]
}

export interface BatchScreeningResult {
  index: number
  status: 'CREATED' | 'FAILED'
  id?: string
  code?: string
  detail?: string
}

export interface BatchScreeningResponse {
  created: number
  failed: number
  results: BatchScreeningResult[]
}

export function batchCreateScreenings(body: BatchScreeningRequest) {
  return apiClient
    .post<BatchScreeningResponse>('/admin/screenings/batch', body)
    .then((res) => res.data)
}

export function updateScreening(
  id: string,
  body: Partial<CreateScreeningRequest>,
  version: number,
) {
  return apiClient
    .put<AdminScreeningRow>(`/admin/screenings/${id}`, body, {
      headers: { 'If-Match': String(version) },
    })
    .then((res) => res.data)
}

export interface AffectedCustomer {
  bookingCode: string
  fullName: string
  phone: string
  email: string
  seats: string[]
  amountVnd: number
  channel: BookingChannel
}

export interface AffectedCustomersResponse {
  screeningId: string
  totalBookings: number
  totalTickets: number
  totalRefundVnd: number
  customers: AffectedCustomer[]
}

export function getAffectedCustomers(screeningId: string) {
  return apiClient
    .get<AffectedCustomersResponse>(`/admin/screenings/${screeningId}/affected-customers`)
    .then((res) => res.data)
}

export function exportAffectedCustomers(screeningId: string) {
  return apiClient.get<Blob>(`/admin/screenings/${screeningId}/affected-customers/export`, {
    responseType: 'blob',
  })
}

export interface CancelScreeningRequest {
  reason: string
  notifyCustomers: boolean
}

export interface CancelScreeningResponse {
  screeningId: string
  status: 'CANCELLED'
  refundRequestsCreated: number
  totalRefundVnd: number
  notificationsSent: number
  notificationsFailed: number
}

export function cancelScreening(id: string, body: CancelScreeningRequest) {
  return apiClient
    .post<CancelScreeningResponse>(`/admin/screenings/${id}/cancel`, body)
    .then((res) => res.data)
}
