export interface PageResponse<T> {
  items: T[]
  page: number
  size: number
  totalItems: number
  totalPages: number
  hasNext: boolean
}

export interface ApiErrorField {
  field: string
  code: string
  message: string
}

export interface ApiError {
  code: string
  status: number
  title: string
  detail?: string
  traceId: string
  fields?: ApiErrorField[]
  extensions: Record<string, unknown>
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'status' in value &&
    'traceId' in value
  )
}
