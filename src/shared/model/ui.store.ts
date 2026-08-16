import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { TableDensity } from '@/shared/ui/Table'

interface UiState {
  tableDensity: TableDensity
  setTableDensity: (density: TableDensity) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      tableDensity: 'comfortable',
      setTableDensity: (density) => set({ tableDensity: density }),
    }),
    { name: 'halcyon-ui-prefs' },
  ),
)
