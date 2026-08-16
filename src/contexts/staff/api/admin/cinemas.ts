import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { SeatType } from '@/shared/types/domain'

export interface CinemaFormRequest {
  code: string
  name: string
  address: string
  city: string
  district: string
  phone: string
  latitude: number
  longitude: number
  isActive: boolean
}

export interface CinemaAdmin extends CinemaFormRequest {
  id: string
}

export function listAdminCinemas() {
  return apiClient.get<CinemaAdmin[]>('/admin/cinemas').then((res) => res.data)
}

export function adminCinemasOptions() {
  return queryOptions({ queryKey: queryKeys.admin.cinemas.list, queryFn: listAdminCinemas })
}

export function createAdminCinema(body: CinemaFormRequest) {
  return apiClient.post<CinemaAdmin>('/admin/cinemas', body).then((res) => res.data)
}

export function updateAdminCinema(id: string, body: CinemaFormRequest) {
  return apiClient.put<CinemaAdmin>(`/admin/cinemas/${id}`, body).then((res) => res.data)
}

export interface AuditoriumFormRequest {
  name: string
  screenType: string
  cleanupMin: number
  totalSeats: number
  isActive: boolean
}

export interface AuditoriumAdmin extends AuditoriumFormRequest {
  id: string
}

export function listAuditoriums(cinemaId: string) {
  return apiClient
    .get<AuditoriumAdmin[]>(`/admin/cinemas/${cinemaId}/auditoriums`)
    .then((res) => res.data)
}

export function auditoriumsOptions(cinemaId: string) {
  return queryOptions({
    queryKey: queryKeys.admin.auditoriums.list(cinemaId),
    queryFn: () => listAuditoriums(cinemaId),
  })
}

export function createAuditorium(cinemaId: string, body: AuditoriumFormRequest) {
  return apiClient
    .post<AuditoriumAdmin>(`/admin/cinemas/${cinemaId}/auditoriums`, body)
    .then((res) => res.data)
}

export interface AdminSeat {
  id: string
  rowLabel: string
  seatNumber: number
  seatType: SeatType
  coupleGroup: string | null
  gridRow: number
  gridCol: number
  isSellable: boolean
  disabledNote: string | null
}

export interface SeatMapAdminResponse {
  auditoriumId: string
  name: string
  gridRows: number
  gridCols: number
  seats: AdminSeat[]
  stats: { total: number; standard: number; vip: number; couple: number; disabled: number }
}

export function getAdminSeatMap(auditoriumId: string) {
  return apiClient
    .get<SeatMapAdminResponse>(`/admin/auditoriums/${auditoriumId}/seat-map`)
    .then((res) => res.data)
}

export function adminSeatMapOptions(auditoriumId: string) {
  return queryOptions({
    queryKey: queryKeys.admin.seatMap(auditoriumId),
    queryFn: () => getAdminSeatMap(auditoriumId),
  })
}

export function replaceAdminSeatMap(auditoriumId: string, seats: AdminSeat[]) {
  return apiClient
    .put<SeatMapAdminResponse>(`/admin/auditoriums/${auditoriumId}/seat-map`, { seats })
    .then((res) => res.data)
}

export function patchAdminSeat(
  seatId: string,
  body: { isSellable: boolean; disabledNote?: string },
) {
  return apiClient.patch<AdminSeat>(`/admin/seats/${seatId}`, body).then((res) => res.data)
}
