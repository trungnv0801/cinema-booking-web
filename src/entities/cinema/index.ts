import { useQuery } from '@tanstack/react-query'

import { cinemasOptions } from './api'

export { cinemasOptions, getCinemas } from './api'

export function useCinemas() {
  return useQuery(cinemasOptions())
}
