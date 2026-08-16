import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { getAccessToken, setAccessToken } from './auth-token'
import { API_BASE_URL, API_TIMEOUT_MS } from './config'
import { normalizeError } from './errors'
import { refreshAccessToken } from './refresh'
import { notifySessionExpired } from './session-expiry'

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
})

const AUTH_ENDPOINTS_WITHOUT_REDIRECT = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
]

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

function redirectToLogin() {
  setAccessToken(null)
  notifySessionExpired()
}

async function resolveBlobErrorBody(error: AxiosError): Promise<void> {
  const data = error.response?.data
  if (!(data instanceof Blob)) return
  try {
    const text = await data.text()
    error.response!.data = JSON.parse(text)
  } catch {
    // Not JSON — leave the Blob in place; normalizeError falls back to UNKNOWN_ERROR.
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    await resolveBlobErrorBody(error)
    const apiError = normalizeError(error)
    const originalRequest = error.config as RetriableConfig | undefined

    if (
      apiError.status === 401 &&
      apiError.code === 'TOKEN_EXPIRED' &&
      originalRequest &&
      !originalRequest._retried
    ) {
      try {
        const token = await refreshAccessToken()
        originalRequest._retried = true
        originalRequest.headers.set('Authorization', `Bearer ${token}`)
        return apiClient.request(originalRequest)
      } catch {
        redirectToLogin()
        return Promise.reject(apiError)
      }
    }

    const isAuthEndpoint = AUTH_ENDPOINTS_WITHOUT_REDIRECT.some((path) =>
      originalRequest?.url?.includes(path),
    )

    if (apiError.status === 401 && !isAuthEndpoint) {
      redirectToLogin()
    }

    return Promise.reject(apiError)
  },
)
