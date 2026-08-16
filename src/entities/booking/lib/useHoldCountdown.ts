import { useEffect, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'

import { holdOptions } from '@/entities/booking/api/holds'
import { useCheckoutStore } from '@/entities/booking/model/checkout.store'
import { queryKeys } from '@/shared/api/query-keys'

export interface UseHoldCountdownResult {
  remainingSeconds: number
  expiresAt: string | null
  isExpired: boolean
  isUrgent: boolean
}

const URGENT_THRESHOLD_SECONDS = 60

export function useHoldCountdown(holdGroup: string | null): UseHoldCountdownResult {
  const queryClient = useQueryClient()
  const setExpiresAt = useCheckoutStore((s) => s.setExpiresAt)

  const { data, error } = useQuery({
    ...holdOptions(holdGroup ?? ''),
    enabled: !!holdGroup,
  })

  useEffect(() => {
    if (data?.expiresAt) setExpiresAt(data.expiresAt)
  }, [data?.expiresAt, setExpiresAt])

  useEffect(() => {
    if (!holdGroup) return

    function reseed() {
      if (document.visibilityState === 'visible' && holdGroup) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.holds.detail(holdGroup) })
      }
    }

    document.addEventListener('visibilitychange', reseed)
    window.addEventListener('focus', reseed)
    return () => {
      document.removeEventListener('visibilitychange', reseed)
      window.removeEventListener('focus', reseed)
    }
  }, [holdGroup, queryClient])

  const expiresAt = data?.expiresAt ?? null

  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!expiresAt) return
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const [anchor, setAnchor] = useState<{ atClientMs: number; remainingSeconds: number } | null>(
    null,
  )
  const [anchoredData, setAnchoredData] = useState<typeof data>(undefined)
  if (data && data !== anchoredData) {
    setAnchoredData(data)
    setAnchor({ atClientMs: now, remainingSeconds: data.remainingSeconds })
  }

  const remainingSeconds = data
    ? Math.max(
        0,
        (anchor?.remainingSeconds ?? data.remainingSeconds) -
          (anchor ? Math.round((now - anchor.atClientMs) / 1000) : 0),
      )
    : 0

  const hasRunOut = !!expiresAt && remainingSeconds === 0

  useEffect(() => {
    if (!hasRunOut || !holdGroup) return
    void queryClient.invalidateQueries({ queryKey: queryKeys.holds.detail(holdGroup) })
  }, [hasRunOut, holdGroup, queryClient])

  return {
    remainingSeconds,
    expiresAt,
    isExpired: error?.code === 'HOLD_EXPIRED' || hasRunOut,
    isUrgent: remainingSeconds > 0 && remainingSeconds <= URGENT_THRESHOLD_SECONDS,
  }
}
