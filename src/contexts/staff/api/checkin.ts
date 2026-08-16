import { queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { ScanResult, SeatType } from '@/shared/types/domain'

export interface CheckInScanRequest {
  qrToken: string
  screeningId: string
}

export interface CheckInManualRequest {
  ticketCode: string
  screeningId: string
}

export interface CheckInWarning {
  code: string
  message: string
}

export interface CheckInResult {
  result: ScanResult
  ticket?: {
    code: string
    seatLabel: string
    seatType: SeatType
    movieTitle: string
    auditoriumName: string
    startsAt: string
  }
  warnings?: CheckInWarning[]
  checkedInAt?: string
  previousCheckIn?: { at: string; by: string }
  stats: { checkedIn: number; total: number }
}

export function scanTicket(body: CheckInScanRequest) {
  return apiClient.post<CheckInResult>('/check-in/scan', body).then((res) => res.data)
}

export function manualCheckIn(body: CheckInManualRequest) {
  return apiClient.post<CheckInResult>('/check-in/manual', body).then((res) => res.data)
}

export interface CheckInStats {
  total: number
  checkedIn: number
  remaining: number
  percent: number
}

export function getCheckInStats(screeningId: string) {
  return apiClient
    .get<CheckInStats>(`/check-in/screenings/${screeningId}/stats`)
    .then((res) => res.data)
}

export function checkInStatsOptions(screeningId: string) {
  return queryOptions({
    queryKey: queryKeys.checkIn.stats(screeningId),
    queryFn: () => getCheckInStats(screeningId),
  })
}

export interface CheckInLogEntry {
  scannedAt: string
  seatLabel: string
  result: ScanResult
  scannedBy: string
}

export function getCheckInLog(screeningId: string) {
  return apiClient
    .get<CheckInLogEntry[]>(`/check-in/screenings/${screeningId}/log`)
    .then((res) => res.data)
}

export function checkInLogOptions(screeningId: string) {
  return queryOptions({
    queryKey: queryKeys.checkIn.log(screeningId),
    queryFn: () => getCheckInLog(screeningId),
  })
}
