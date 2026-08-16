import axios from 'axios'

import { setAccessToken } from './auth-token'
import { API_BASE_URL, API_TIMEOUT_MS } from './config'

interface RefreshResponse {
  accessToken: string
  expiresIn: number
}

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  withCredentials: true,
})

let refreshPromise: Promise<string> | null = null

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<RefreshResponse>('/auth/refresh')
      .then((res) => {
        setAccessToken(res.data.accessToken)
        return res.data.accessToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}
