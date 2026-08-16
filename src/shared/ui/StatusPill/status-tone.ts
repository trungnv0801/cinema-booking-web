export type StatusTone = 'success' | 'warning' | 'error' | 'neutral' | 'accent'

const STATUS_TONE_MAP: Record<string, StatusTone> = {
  PAID: 'success',
  VALID: 'success',
  REFUNDED: 'success',
  CLOSED: 'success',
  COMPLETED: 'success',
  READY_FOR_PICKUP: 'success',
  MATCHED: 'success',

  PENDING: 'warning',
  AWAITING_APPROVAL: 'warning',
  AWAITING_FIRST_PASSWORD: 'warning',
  OPEN: 'warning',
  PREPARING: 'warning',

  CANCELLED: 'error',
  REJECTED: 'error',
  EXPIRED: 'error',
  MISMATCHED: 'error',
  VOIDED: 'error',
  LOCKED: 'error',
  FAILED: 'error',

  DRAFT: 'neutral',
  OFF_SALE: 'neutral',
  ARCHIVED: 'neutral',
  PICKED_UP: 'neutral',
  USED: 'neutral',

  NOW_SHOWING: 'accent',
  UPCOMING: 'accent',
  COMING_SOON: 'accent',
}

export function getStatusTone(status: string): StatusTone {
  return STATUS_TONE_MAP[status.toUpperCase()] ?? 'neutral'
}
