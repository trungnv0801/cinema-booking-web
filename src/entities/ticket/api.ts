import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { PageResponse } from '@/shared/api/types'
import type { ContentRating, SeatType, TicketStatus, TicketTypeDef } from '@/shared/types/domain'

import { CATALOG_STALE_TIME } from '../catalog-policy'

export type TicketScope = 'UPCOMING' | 'PAST'

export interface TicketSummary {
  code: string
  status: TicketStatus
  movieTitle: string
  cinemaName: string
  startsAt: string
  seatLabel: string
}

export interface TicketDetail {
  code: string
  status: TicketStatus
  qrToken: string
  movie: { title: string; ageRating: ContentRating; posterUrl: string }
  cinema: { name: string; address: string }
  auditoriumName: string
  seatLabel: string
  seatType: SeatType
  ticketType: { code: string; name: string; requiresProof: boolean; proofNote?: string }
  startsAt: string
  bookingCode: string
  checkedInAt: string | null
}

export interface ListTicketsParams {
  page?: number
  size?: number
}

export function listTickets(scope: TicketScope = 'UPCOMING', params: ListTicketsParams = {}) {
  return apiClient
    .get<PageResponse<TicketSummary>>('/tickets', { params: { scope, ...params } })
    .then((res) => res.data)
}

export function ticketsListOptions(scope: TicketScope, params: ListTicketsParams = {}) {
  return queryOptions({
    queryKey: queryKeys.tickets.list(scope, params),
    queryFn: () => listTickets(scope, params),
  })
}

export function getTicket(code: string) {
  return apiClient.get<TicketDetail>(`/tickets/${code}`).then((res) => res.data)
}

export function ticketDetailOptions(code: string) {
  return queryOptions({
    queryKey: queryKeys.tickets.detail(code),
    queryFn: () => getTicket(code),
  })
}

export function getTicketTypes() {
  return apiClient.get<TicketTypeDef[]>('/ticket-types').then((res) => res.data)
}

export function ticketTypesOptions() {
  return queryOptions({
    queryKey: queryKeys.ticketTypes.all,
    queryFn: getTicketTypes,
    staleTime: CATALOG_STALE_TIME,
  })
}
