import type { TicketTypeDef } from '@/shared/types/domain'

export const ticketTypes: TicketTypeDef[] = [
  { code: 'STANDARD', name: 'Standard', discountPercent: 0, requiresProof: false },
  {
    code: 'STUDENT',
    name: 'Student',
    discountPercent: 20,
    requiresProof: true,
    proofNote: 'Show a student ID at the counter',
  },
]
