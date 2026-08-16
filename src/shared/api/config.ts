const DEFAULT_TIMEOUT_MS = 15000

function resolveTimeout(raw: string | undefined): number {
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TIMEOUT_MS
}

export const API_BASE_URL = import.meta.env.VITE_API_URL

export const API_TIMEOUT_MS = resolveTimeout(import.meta.env.VITE_API_TIMEOUT)
