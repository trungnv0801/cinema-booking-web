import type { AxiosError } from 'axios'

import type { ApiError, ApiErrorField } from '@/shared/api/types'

const PROBLEM_DETAILS_FIELDS = new Set([
  'type',
  'title',
  'status',
  'detail',
  'instance',
  'code',
  'traceId',
  'timestamp',
  'errors',
])

interface ProblemDetailsBody {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  code?: string
  traceId?: string
  timestamp?: string
  errors?: ApiErrorField[]
  [key: string]: unknown
}

export function normalizeError(error: AxiosError): ApiError {
  const response = error.response

  if (!response) {
    return {
      code: 'NETWORK_ERROR',
      status: 0,
      title: error.message || 'Network error',
      traceId: 'unknown',
      extensions: {},
    }
  }

  const body = (response.data ?? {}) as ProblemDetailsBody
  const traceId =
    (response.headers['x-trace-id'] as string | undefined) ?? body.traceId ?? 'unknown'

  const extensions: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(body)) {
    if (!PROBLEM_DETAILS_FIELDS.has(key)) extensions[key] = value
  }

  const retryAfter = response.headers['retry-after']
  if (retryAfter) extensions.retryAfter = retryAfter

  return {
    code: body.code ?? 'UNKNOWN_ERROR',
    status: response.status,
    title: body.title ?? 'Something went wrong',
    detail: body.detail,
    traceId,
    fields: body.errors,
    extensions,
  }
}
