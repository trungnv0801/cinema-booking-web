import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BranchState {
  selectedCinemaId: string | null
  setSelectedCinemaId: (cinemaId: string | null) => void
}

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      selectedCinemaId: null,
      setSelectedCinemaId: (cinemaId) => set({ selectedCinemaId: cinemaId }),
    }),
    { name: 'halcyon-branch' },
  ),
)
