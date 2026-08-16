import { describe, expect, it, vi } from 'vitest'

import { formatVnd } from './money'

describe('formatVnd', () => {
  it('formats with comma grouping and a trailing đ symbol in English', () => {
    expect(formatVnd(182_000, 'en')).toBe('182,000 ₫')
  })

  it('formats with dot grouping and a trailing đ symbol in Vietnamese', () => {
    expect(formatVnd(182_000, 'vi')).toBe('182.000 ₫')
  })

  it('never renders a decimal point — VND is always an integer', () => {
    expect(formatVnd(91_000, 'en')).not.toContain('.')
    expect(formatVnd(1_000_000, 'en')).toBe('1,000,000 ₫')
  })

  it('warns (but does not throw) when given a non-integer amount', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => formatVnd(182_000.5, 'en')).not.toThrow()
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('rounds a non-integer amount to the nearest đồng instead of truncating', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(formatVnd(999_999.7, 'en')).toBe('1,000,000 ₫')
    expect(formatVnd(182_000.2, 'en')).toBe('182,000 ₫')
    spy.mockRestore()
  })

  it('formats negative amounts for refunds', () => {
    expect(formatVnd(-91_000, 'en')).toBe('-91,000 ₫')
  })
})
