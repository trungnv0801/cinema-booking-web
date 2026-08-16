import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { ApiError } from '@/shared/api/types'
import type { DiscountRef, SeatType } from '@/shared/types/domain'

export interface HoldSeat {
  id: string
  label: string
  type: SeatType
}

export interface HoldResponse {
  holdGroup: string
  screeningId: string
  seats: HoldSeat[]
  expiresAt: string
  remainingSeconds: number
}

export interface CreateHoldRequest {
  seatIds: string[]
  sessionKey: string
}

export function createHold(screeningId: string, body: CreateHoldRequest) {
  return apiClient
    .post<HoldResponse>(`/screenings/${screeningId}/holds`, body)
    .then((res) => res.data)
}

export function getHold(holdGroup: string) {
  return apiClient.get<HoldResponse>(`/holds/${holdGroup}`).then((res) => res.data)
}

export function holdOptions(holdGroup: string) {
  return queryOptions<HoldResponse, ApiError>({
    queryKey: queryKeys.holds.detail(holdGroup),
    queryFn: () => getHold(holdGroup),
    staleTime: 0,
    gcTime: 0,
  })
}

export function deleteHold(holdGroup: string) {
  return apiClient.delete<void>(`/holds/${holdGroup}`).then((res) => res.data)
}

export interface QuoteItemRequest {
  seatId: string
  ticketTypeCode: string
}

export interface QuoteRequest {
  items: QuoteItemRequest[]
}

export interface QuoteItemResponse {
  seatId: string
  seatLabel: string
  seatType: SeatType
  ticketTypeCode: string
  basePriceVnd: number
  surchargeVnd: number
  discountVnd: number
  finalPriceVnd: number
  appliedDiscount: DiscountRef | null
}

export interface QuoteResponse {
  items: QuoteItemResponse[]
  subtotalVnd: number
  discountVnd: number
  totalVnd: number
}

export function getQuote(screeningId: string, body: QuoteRequest) {
  return apiClient
    .post<QuoteResponse>(`/screenings/${screeningId}/quote`, body)
    .then((res) => res.data)
}
