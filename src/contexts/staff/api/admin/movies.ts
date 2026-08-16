import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { PageResponse } from '@/shared/api/types'
import type { ContentRating, MovieStatus } from '@/shared/types/domain'

export interface MovieAdmin {
  id: string
  title: string
  originalTitle: string
  synopsis: string
  durationMin: number
  ageRating: ContentRating
  country: string
  director: string
  castList: string[]
  genreCodes: string[]
  releaseDate: string
  posterUrl: string
  backdropUrl: string
  trailerUrl: string
  status: MovieStatus
}

export interface AdminMovieListParams {
  status?: MovieStatus
  q?: string
  page?: number
  size?: number
}

export function listAdminMovies(params: AdminMovieListParams) {
  return apiClient
    .get<PageResponse<MovieAdmin>>('/admin/movies', { params })
    .then((res) => res.data)
}

export function adminMovieListOptions(params: AdminMovieListParams) {
  return queryOptions({
    queryKey: queryKeys.admin.movies.list(params),
    queryFn: () => listAdminMovies(params),
    placeholderData: keepPreviousData,
  })
}

export type MovieFormRequest = Omit<MovieAdmin, 'id'>

export function createAdminMovie(body: MovieFormRequest) {
  return apiClient.post<MovieAdmin>('/admin/movies', body).then((res) => res.data)
}

export function getAdminMovie(id: string) {
  return apiClient.get<MovieAdmin>(`/admin/movies/${id}`).then((res) => res.data)
}

export function adminMovieDetailOptions(id: string) {
  return queryOptions({
    queryKey: queryKeys.admin.movies.detail(id),
    queryFn: () => getAdminMovie(id),
  })
}

export function updateAdminMovie(id: string, body: MovieFormRequest) {
  return apiClient.put<MovieAdmin>(`/admin/movies/${id}`, body).then((res) => res.data)
}

export function archiveAdminMovie(id: string) {
  return apiClient.delete<void>(`/admin/movies/${id}`).then((res) => res.data)
}

export interface UploadImageResponse {
  url: string
}

export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return apiClient
    .post<UploadImageResponse>('/admin/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
}
