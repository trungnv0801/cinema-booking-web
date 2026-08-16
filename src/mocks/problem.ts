import { HttpResponse } from 'msw'

export const API_BASE = '*/api/v1'

interface ProblemInit {
  status: number
  code: string
  title: string
  detail?: string
  extensions?: Record<string, unknown>
}

export function problem({ status, code, title, detail, extensions }: ProblemInit) {
  return HttpResponse.json(
    {
      type: `https://api.halcyoncinemas.com/problems/${code.toLowerCase().replace(/_/g, '-')}`,
      title,
      status,
      detail,
      instance: '',
      code,
      traceId: crypto.randomUUID().replace(/-/g, '').slice(0, 16),
      timestamp: new Date().toISOString(),
      ...extensions,
    },
    {
      status,
      headers: { 'Content-Type': 'application/problem+json', 'X-Trace-Id': crypto.randomUUID() },
    },
  )
}
