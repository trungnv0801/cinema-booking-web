import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BranchPreferenceState {
  preferredCinemaId: string | null
  setPreferredCinemaId: (cinemaId: string | null) => void
}

export const useBranchPreferenceStore = create<BranchPreferenceState>()(
  persist(
    (set) => ({
      preferredCinemaId: null,
      setPreferredCinemaId: (cinemaId) => set({ preferredCinemaId: cinemaId }),
    }),
    { name: 'halcyon-guest-branch' },
  ),
)
