import { describe, expect, it } from 'vitest'
import { z } from 'zod'

const schema = z.object({
  date: z.string().default('2026-08-20'),
  cinemaId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
})

describe('search param schemas', () => {
  it('fills defaults for an empty query string', () => {
    expect(schema.parse({})).toEqual({ date: '2026-08-20', page: 1 })
  })

  it('coerces the numeric params a URL can only carry as strings', () => {
    expect(schema.parse({ page: '3' }).page).toBe(3)
  })

  it('rejects a hand-edited value rather than rendering it', () => {
    expect(schema.safeParse({ page: '0' }).success).toBe(false)
  })
})
