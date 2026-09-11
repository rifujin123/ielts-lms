import { create } from 'zustand'

export type ToastType = 'error' | 'warning' | 'success' | 'info'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  description?: string
  action?: ToastAction
  duration?: number // duration in ms, 0 means manual dismiss only
  createdAt: number
}

export interface ToastInput {
  title: string
  description?: string
  action?: ToastAction
  duration?: number
}

interface ToastStoreState {
  toasts: ToastItem[]
  addToast: (type: ToastType, input: ToastInput) => string
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastStoreState>((set) => ({
  toasts: [],
  addToast: (type, input) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const duration = input.duration ?? (type === 'error' ? 5500 : 4500)

    const newToast: ToastItem = {
      id,
      type,
      title: input.title,
      description: input.description,
      action: input.action,
      duration,
      createdAt: Date.now(),
    }

    set((state) => ({
      // Keep maximum 5 concurrent toasts to prevent viewport clutter
      toasts: [...state.toasts.slice(-4), newToast],
    }))

    return id
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  clearToasts: () => set({ toasts: [] }),
}))

/**
 * Global imperative helper to trigger toasts from anywhere
 * (hooks, components, axios interceptors, error boundaries).
 */
export const toast = {
  error: (title: string, options?: Omit<ToastInput, 'title'>): string =>
    useToastStore.getState().addToast('error', { title, ...options }),

  warning: (title: string, options?: Omit<ToastInput, 'title'>): string =>
    useToastStore.getState().addToast('warning', { title, ...options }),

  success: (title: string, options?: Omit<ToastInput, 'title'>): string =>
    useToastStore.getState().addToast('success', { title, ...options }),

  info: (title: string, options?: Omit<ToastInput, 'title'>): string =>
    useToastStore.getState().addToast('info', { title, ...options }),

  dismiss: (id: string): void => {
    useToastStore.getState().removeToast(id)
  },

  clearAll: (): void => {
    useToastStore.getState().clearToasts()
  },
}
