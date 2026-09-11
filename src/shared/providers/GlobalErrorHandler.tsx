import React, { useEffect } from 'react'
import { toast } from '@/shared/components/Toast/toastStore'

/**
 * GlobalErrorHandler — Catches unhandled JavaScript exceptions and
 * unhandled promise rejections across the entire window lifecycle.
 * Dispatches an animated toast notification with page reload recovery.
 */
export const GlobalErrorHandler: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // ── Global runtime errors ───────────────────────────────────────
    const handleError = (event: ErrorEvent) => {
      // Ignore benign browser layout warning
      if (
        event.message?.includes('ResizeObserver loop limit exceeded') ||
        event.message?.includes('ResizeObserver loop completed')
      ) {
        return
      }

      console.error('[GlobalErrorHandler] Uncaught runtime error:', event.error ?? event.message)

      toast.error('Đã xảy ra lỗi giao diện', {
        description:
          event.message ||
          'Một thành phần hiển thị gặp sự cố bất ngờ. Bạn có thể thử tải lại trang.',
        action: {
          label: 'Tải lại trang',
          onClick: () => window.location.reload(),
        },
      })
    }

    // ── Global unhandled promise rejections ────────────────────────
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason

      // If it's already an Axios error or cancelled request, it's handled by Axios interceptor
      if (
        typeof reason === 'object' &&
        reason !== null &&
        ('isAxiosError' in reason || reason.name === 'CanceledError')
      ) {
        return
      }

      console.error('[GlobalErrorHandler] Unhandled promise rejection:', reason)

      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'string'
            ? reason
            : 'Một tiến trình nền gặp lỗi ngoài dự kiến.'

      toast.error('Lỗi tiến trình bất đồng bộ', {
        description: message,
        action: {
          label: 'Tải lại',
          onClick: () => window.location.reload(),
        },
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return <>{children}</>
}
