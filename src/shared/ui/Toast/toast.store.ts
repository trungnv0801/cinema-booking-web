import { create } from 'zustand'

export type ToastVariant = 'default' | 'success' | 'warning' | 'error'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  action?: ToastAction
  duration?: number
}

interface ToastState {
  toasts: ToastItem[]
  show: (toast: Omit<ToastItem, 'id'>) => string
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (input) => {
    const id = crypto.randomUUID()
    set((state) => ({ toasts: [...state.toasts, { ...input, id }].slice(-3) }))
    return id
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export function toast(input: Omit<ToastItem, 'id'>): string {
  return useToastStore.getState().show(input)
}
