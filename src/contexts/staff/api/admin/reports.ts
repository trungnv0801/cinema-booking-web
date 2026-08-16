import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { apiClient } from '@/shared/api/client'
import { queryKeys } from '@/shared/api/query-keys'
import type { PageResponse } from '@/shared/api/types'
import type { RefundStatus, Role } from '@/shared/types/domain'

export interface DailyReportParams {
  cinemaId: string
  date: string
}

export interface DailyReport {
  cinemaId: string
  cinemaName: string
  businessDate: string
  summary: {
    ticketsSold: number
    revenueVnd: number
    cashVnd: number
    onlineVnd: number
    refundedVnd: number
    ticketsCancelled: number
  }
  reconciliation: {
    status: string
    systemCashVnd: number
    countedCashVnd: number | null
    differenceVnd: number | null
    closedBy: string | null
    closedAt: string | null
  }
  byScreening: {
    startsAt: string
    movieTitle: string
    auditoriumName: string
    ticketsSold: number
    counterCount: number
    onlineCount: number
    revenueVnd: number
    totalSeats: number
    occupancyPercent: number
  }[]
  refunds: { ticketCode: string; startsAt: string; amountVnd: number; status: RefundStatus }[]
}

export function getDailyReport(params: DailyReportParams) {
  return apiClient.get<DailyReport>('/admin/reports/daily', { params }).then((res) => res.data)
}

export function dailyReportOptions(params: DailyReportParams) {
  return queryOptions({
    queryKey: queryKeys.admin.reports.daily(params),
    queryFn: () => getDailyReport(params),
  })
}

export function exportDailyReport(params: DailyReportParams) {
  return apiClient.get<Blob>('/admin/reports/daily/export', { params, responseType: 'blob' })
}

export interface StaffRoleAssignment {
  roleCode: Role
  cinemaId: string | null
}

export interface StaffUser {
  id: string
  fullName: string
  email: string
  phone: string
  roles: StaffRoleAssignment[]
  status: 'ACTIVE' | 'LOCKED' | 'AWAITING_FIRST_PASSWORD'
  lastLogin: string | null
}

export interface StaffListParams {
  q?: string
  role?: Role
  cinemaId?: string
  page?: number
  size?: number
}

export function listAdminStaff(params: StaffListParams) {
  return apiClient.get<PageResponse<StaffUser>>('/admin/staff', { params }).then((res) => res.data)
}

export function adminStaffListOptions(params: StaffListParams) {
  return queryOptions({
    queryKey: queryKeys.admin.staff.list(params),
    queryFn: () => listAdminStaff(params),
    placeholderData: keepPreviousData,
  })
}

export interface CreateStaffRequest {
  fullName: string
  email: string
  phone: string
  roles: StaffRoleAssignment[]
}

export function createAdminStaff(body: CreateStaffRequest) {
  return apiClient.post<StaffUser>('/admin/staff', body).then((res) => res.data)
}

export function updateStaffRoles(id: string, roles: StaffRoleAssignment[]) {
  return apiClient.put<StaffUser>(`/admin/staff/${id}/roles`, { roles }).then((res) => res.data)
}

export function lockStaffAccount(id: string) {
  return apiClient.post<void>(`/admin/staff/${id}/lock`).then((res) => res.data)
}

export function unlockStaffAccount(id: string) {
  return apiClient.post<void>(`/admin/staff/${id}/unlock`).then((res) => res.data)
}

export interface AuditLogParams {
  actorId?: string
  entityType?: string
  entityId?: string
  action?: string
  from?: string
  to?: string
  page?: number
  size?: number
}

export interface AuditLogEntry {
  id: string
  at: string
  actor: { id: string; fullName: string; role: string }
  action: string
  entityType: string
  entityId: string
  ipAddress: string
  before?: unknown
  after?: unknown
}

export function listAuditLogs(params: AuditLogParams) {
  return apiClient
    .get<PageResponse<AuditLogEntry>>('/admin/audit-logs', { params })
    .then((res) => res.data)
}

export function auditLogsOptions(params: AuditLogParams) {
  return queryOptions({
    queryKey: queryKeys.admin.auditLogs.list(params),
    queryFn: () => listAuditLogs(params),
    placeholderData: keepPreviousData,
  })
}
