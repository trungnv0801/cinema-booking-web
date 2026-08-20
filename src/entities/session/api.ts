import { apiClient } from '@/shared/api/client'
import type { components } from '@/shared/api/schema'
import type { Role } from '@/shared/types/domain'

export interface RegisterRequest {
  fullName: string
  email: string
  phone: string
  password: string
}

export interface RegisterResponse {
  id: string
  email: string
  emailVerified: boolean
}

export type LoginRequest = Required<components['schemas']['LoginRequest']>

export type LoginResponse = Required<
  Omit<components['schemas']['LoginResponse'], 'user'>
> & {
  user: Required<components['schemas']['User']>
}

export interface MeResponse {
  id: string
  fullName: string
  email: string
  phone: string
  emailVerified: boolean
  roles: Role[]
  cinemaIds: string[]
}

export interface UpdateMeRequest {
  fullName?: string
  phone?: string
  dateOfBirth?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export function register(body: RegisterRequest) {
  return apiClient.post<RegisterResponse>('/auth/register', body).then((res) => res.data)
}

export function login(body: LoginRequest) {
  return apiClient.post<LoginResponse>('/auth/login', body).then((res) => res.data)
}

export function logout() {
  return apiClient.post<void>('/auth/logout').then((res) => res.data)
}

export function forgotPassword(email: string) {
  return apiClient.post<void>('/auth/forgot-password', { email }).then((res) => res.data)
}

export function resetPassword(token: string, newPassword: string) {
  return apiClient
    .post<void>('/auth/reset-password', { token, newPassword })
    .then((res) => res.data)
}

export function verifyEmail(token: string) {
  return apiClient.post<void>('/auth/verify-email', { token }).then((res) => res.data)
}

export function getMe() {
  return apiClient.get<MeResponse>('/me').then((res) => res.data)
}

export function updateMe(body: UpdateMeRequest) {
  return apiClient.patch<MeResponse>('/me', body).then((res) => res.data)
}

export function changePassword(body: ChangePasswordRequest) {
  return apiClient.post<void>('/me/change-password', body).then((res) => res.data)
}
