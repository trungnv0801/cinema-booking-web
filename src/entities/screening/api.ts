import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { ContentRating, DiscountRef, ScreeningStatus } from '@/shared/types/domain'

import { CATALOG_STALE_TIME } from '../catalog-policy'
import type { SeatMapResponse } from '../seat/model'

export interface ShowtimeScreening {
  id: string
  startsAt: string
  endsAt: string
  auditoriumName: string
  basePriceVnd: number
  availableSeats: number
  totalSeats: number
  soldOut: boolean
  activeDiscount: DiscountRef | null
}

export interface ShowtimeFormat {
  screenType: string
  subtitle: string
  screenings: ShowtimeScreening[]
}

export interface ShowtimeMovie {
  movie: { id: string; title: string; ageRating: ContentRating; posterUrl: string }
  formats: ShowtimeFormat[]
}

export interface ShowtimeGroup {
  cinema: { id: string; code: string; name: string; address: string }
  movies: ShowtimeMovie[]
}

export interface ShowtimesParams {
  date: string
  movieId?: string
  cinemaId?: string
}

export function getShowtimes(params: ShowtimesParams) {
  return apiClient.get<ShowtimeGroup[]>('/showtimes', { params }).then((res) => res.data)
}

export function showtimesOptions(params: ShowtimesParams) {
  return queryOptions({
    queryKey: queryKeys.showtimes.list(params),
    queryFn: () => getShowtimes(params),
    staleTime: CATALOG_STALE_TIME,
  })
}

export interface ScreeningDetail {
  id: string
  movie: { id: string; title: string; ageRating: ContentRating; posterUrl: string }
  cinema: { id: string; code: string; name: string }
  auditoriumName: string
  startsAt: string
  basePriceVnd: number
  status: ScreeningStatus
}

export function getScreening(id: string) {
  return apiClient.get<ScreeningDetail>(`/screenings/${id}`).then((res) => res.data)
}

export function screeningDetailOptions(id: string) {
  return queryOptions({
    queryKey: queryKeys.screenings.detail(id),
    queryFn: () => getScreening(id),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function getSeatMap(screeningId: string) {
  return apiClient.get<SeatMapResponse>(`/screenings/${screeningId}/seats`).then((res) => res.data)
}

export function seatMapOptions(screeningId: string) {
  return queryOptions({
    queryKey: queryKeys.screenings.seats(screeningId),
    queryFn: () => getSeatMap(screeningId),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
  })
}
