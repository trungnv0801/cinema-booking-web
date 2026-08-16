import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { PageResponse } from '@/shared/api/types'
import type { ContentRating, Genre, MovieStatus } from '@/shared/types/domain'

import { CATALOG_STALE_TIME } from '../catalog-policy'

export interface MovieSummary {
  id: string
  slug: string
  title: string
  ageRating: ContentRating
  durationMin: number
  genres: Genre[]
  posterUrl: string
  releaseDate: string
  status: MovieStatus
}

export interface MovieDetail extends MovieSummary {
  synopsis: string
  director: string
  castList: string[]
  backdropUrl: string
  trailerUrl: string
  country: string
  originalTitle: string
}

export interface MovieListParams {
  status?: MovieStatus
  genre?: string
  q?: string
  page?: number
  size?: number
}

export function getMovies(params: MovieListParams) {
  return apiClient.get<PageResponse<MovieSummary>>('/movies', { params }).then((res) => res.data)
}

export function movieListOptions(params: MovieListParams) {
  return queryOptions({
    queryKey: queryKeys.movies.list(params),
    queryFn: () => getMovies(params),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function getMovie(slug: string) {
  return apiClient.get<MovieDetail>(`/movies/${slug}`).then((res) => res.data)
}

export function movieDetailOptions(slug: string) {
  return queryOptions({
    queryKey: queryKeys.movies.detail(slug),
    queryFn: () => getMovie(slug),
    staleTime: CATALOG_STALE_TIME,
  })
}
