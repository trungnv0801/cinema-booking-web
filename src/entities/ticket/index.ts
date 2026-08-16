import { useQuery } from '@tanstack/react-query'

import { ticketTypesOptions } from './api'

export * from './api'

export function useTicketTypes() {
  return useQuery(ticketTypesOptions())
}
