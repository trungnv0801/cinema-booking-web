import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { PaymentMethod, PaymentStatus } from '@/shared/types/domain'

export interface CreatePaymentRequest {
  method: 'PAYBRIDGE'
  returnUrl: string
}

export interface CreatePaymentResponse {
  paymentId: string
  method: PaymentMethod
  amountVnd: number
  status: PaymentStatus
  redirectUrl: string
  expiresAt: string
}

export function createPayment(
  bookingCode: string,
  body: CreatePaymentRequest,
  idempotencyKey: string,
) {
  return apiClient
    .post<CreatePaymentResponse>(`/bookings/${bookingCode}/payments`, body, {
      headers: { 'Idempotency-Key': idempotencyKey },
    })
    .then((res) => res.data)
}

export interface PaymentStatusResponse {
  id: string
  status: PaymentStatus
  method: PaymentMethod
  amountVnd: number
  bookingCode: string
  completedAt: string | null
}

export function getPaymentStatus(publicId: string) {
  return apiClient.get<PaymentStatusResponse>(`/payments/${publicId}`).then((res) => res.data)
}

const TERMINAL_STATUSES: PaymentStatus[] = ['PAID', 'FAILED', 'EXPIRED']
const POLL_TIMEOUT_MS = 90_000

export function paymentStatusOptions(publicId: string, startedAt: number) {
  return queryOptions({
    queryKey: queryKeys.payments.status(publicId),
    queryFn: () => getPaymentStatus(publicId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status && TERMINAL_STATUSES.includes(status)) return false

      const elapsed = Date.now() - startedAt
      if (elapsed > POLL_TIMEOUT_MS) return false

      return Math.min(2000 + Math.floor(elapsed / 10_000) * 1000, 8000)
    },
  })
}
