import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { deleteHold } from '@/entities/booking/api/holds'
import type { SeatUnit } from '@/entities/seat/model'
import { createIdempotencyKey } from '@/shared/api/idempotency'

export type IdempotencyIntent = 'booking' | 'payment'

interface CheckoutState {
  sessionKey: string | null
  holdGroup: string | null
  expiresAt: string | null
  selectedSeatUnits: SeatUnit[]
  idempotencyKeys: Partial<Record<IdempotencyIntent, string>>
  getOrCreateSessionKey: () => string
  getOrCreateIdempotencyKey: (intent: IdempotencyIntent) => string
  startHold: (holdGroup: string, expiresAt: string, seatUnits: SeatUnit[]) => void
  setExpiresAt: (expiresAt: string) => void
  teardownHold: () => Promise<void>
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      sessionKey: null,
      holdGroup: null,
      expiresAt: null,
      selectedSeatUnits: [],
      idempotencyKeys: {},

      getOrCreateSessionKey: () => {
        const existing = get().sessionKey
        if (existing) return existing
        const next = crypto.randomUUID()
        set({ sessionKey: next })
        return next
      },

      getOrCreateIdempotencyKey: (intent) => {
        const existing = get().idempotencyKeys[intent]
        if (existing) return existing
        const next = createIdempotencyKey()
        set({ idempotencyKeys: { ...get().idempotencyKeys, [intent]: next } })
        return next
      },

      startHold: (holdGroup, expiresAt, seatUnits) => {
        set({ holdGroup, expiresAt, selectedSeatUnits: seatUnits })
      },

      setExpiresAt: (expiresAt) => set({ expiresAt }),

      teardownHold: async () => {
        const { holdGroup } = get()
        set({ holdGroup: null, expiresAt: null, selectedSeatUnits: [], idempotencyKeys: {} })
        if (holdGroup) {
          await deleteHold(holdGroup).catch(() => undefined)
        }
      },

      reset: () => {
        set({
          holdGroup: null,
          expiresAt: null,
          selectedSeatUnits: [],
          idempotencyKeys: {},
        })
      },
    }),
    {
      name: 'halcyon-checkout',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        sessionKey: state.sessionKey,
        holdGroup: state.holdGroup,
        expiresAt: state.expiresAt,
        selectedSeatUnits: state.selectedSeatUnits,
        idempotencyKeys: state.idempotencyKeys,
      }),
    },
  ),
)
