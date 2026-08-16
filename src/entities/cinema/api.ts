import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { Cinema } from '@/shared/types/domain'

import { CATALOG_STALE_TIME } from '../catalog-policy'

export function getCinemas() {
  return apiClient.get<Cinema[]>('/cinemas').then((res) => res.data)
}

export function cinemasOptions() {
  return queryOptions({
    queryKey: queryKeys.cinemas.all,
    queryFn: getCinemas,
    staleTime: CATALOG_STALE_TIME,
  })
}
