import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { SeatType } from '@/shared/types/domain'

export interface TicketTypePricing {
  code: string
  name: string
  discountPercent: number
  requiresProof: boolean
  proofNote?: string
  isActive: boolean
}

export function getAdminTicketType(code: string) {
  return apiClient
    .get<TicketTypePricing>(`/admin/pricing/ticket-types/${code}`)
    .then((res) => res.data)
}

export function updateAdminTicketType(code: string, body: Omit<TicketTypePricing, 'code'>) {
  return apiClient
    .put<TicketTypePricing>(`/admin/pricing/ticket-types/${code}`, body)
    .then((res) => res.data)
}

export interface SeatTypePricing {
  type: SeatType
  name: string
  surchargeVnd: number
  seatsPerUnit: number
}

export function getAdminSeatType(type: SeatType) {
  return apiClient.get<SeatTypePricing>(`/admin/pricing/seat-types/${type}`).then((res) => res.data)
}

export function updateAdminSeatType(type: SeatType, body: Omit<SeatTypePricing, 'type'>) {
  return apiClient
    .put<SeatTypePricing>(`/admin/pricing/seat-types/${type}`, body)
    .then((res) => res.data)
}

export interface DiscountRule {
  id: string
  code: string
  name: string
  discountPercent: number
  dayOfWeek: number | null
  timeFrom: string | null
  timeTo: string | null
  cinemaId: string | null
  validFrom: string | null
  validTo: string | null
  priority: number
  isActive: boolean
}

export function listDiscountRules() {
  return apiClient.get<DiscountRule[]>('/admin/pricing/discount-rules').then((res) => res.data)
}

export function discountRulesOptions() {
  return queryOptions({
    queryKey: queryKeys.admin.pricing.discountRules,
    queryFn: listDiscountRules,
  })
}

export function createDiscountRule(body: Omit<DiscountRule, 'id'>) {
  return apiClient.post<DiscountRule>('/admin/pricing/discount-rules', body).then((res) => res.data)
}

export function updateDiscountRule(id: string, body: Omit<DiscountRule, 'id'>) {
  return apiClient
    .put<DiscountRule>(`/admin/pricing/discount-rules/${id}`, body)
    .then((res) => res.data)
}

export function deleteDiscountRule(id: string) {
  return apiClient.delete<void>(`/admin/pricing/discount-rules/${id}`).then((res) => res.data)
}
