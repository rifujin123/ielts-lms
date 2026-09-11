import React from 'react'
import { useToastStore } from './toastStore'
import { ToastItem } from './ToastItem'

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <aside
      aria-label="Thông báo hệ thống"
      className="pointer-events-none fixed top-5 right-5 z-50 flex max-w-sm w-[calc(100vw-2.5rem)] flex-col gap-2.5 sm:w-96"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} item={toast} onDismiss={removeToast} />
      ))}
    </aside>
  )
}
