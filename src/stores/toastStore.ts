import { create } from 'zustand'

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: 'default' | 'success' | 'danger'
}

interface ToastState {
  toasts: ToastItem[]
  push: (toast: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export function toast(input: Omit<ToastItem, 'id'>) {
  useToastStore.getState().push(input)
}
