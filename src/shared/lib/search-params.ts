import { useCallback, useMemo } from 'react'

import { useSearchParams } from 'react-router-dom'

import type { z } from 'zod'

export function useTypedSearchParams<Schema extends z.ZodType<Record<string, unknown>>>(
  schema: Schema,
): [z.output<Schema>, (next: Partial<z.input<Schema>>, options?: { replace?: boolean }) => void] {
  const [searchParams, setSearchParams] = useSearchParams()

  const value = useMemo(() => {
    const raw: Record<string, string> = {}
    searchParams.forEach((entry, key) => {
      raw[key] = entry
    })
    const parsed = schema.safeParse(raw)
    return parsed.success ? parsed.data : schema.parse({})
  }, [schema, searchParams])

  const setValue = useCallback(
    (next: Partial<z.input<Schema>>, options?: { replace?: boolean }) => {
      const merged = { ...(value as Record<string, unknown>), ...next }
      const defaults = schema.parse({}) as Record<string, unknown>

      const entries = Object.entries(merged).flatMap(([key, entry]) => {
        if (entry === undefined || entry === null || entry === '') return []
        if (Object.is(entry, defaults[key])) return []
        return [[key, String(entry)] as [string, string]]
      })

      const params = new URLSearchParams()
      for (const [key, entry] of entries) params.set(key, entry)
      setSearchParams(params, { replace: options?.replace ?? false })
    },
    [schema, setSearchParams, value],
  )

  return [value, setValue]
}
