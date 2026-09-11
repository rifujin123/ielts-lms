import React from 'react'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { toast } from '@/shared/components/Toast/toastStore'

const FeatureErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="card-interactive my-6 flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-surface-container-lowest p-8 text-center shadow-xs">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <AlertCircle className="h-6 w-6" strokeWidth={1.75} />
      </div>
      <h3 className="text-headline-sm text-on-surface font-bold">Đã xảy ra lỗi tải dữ liệu</h3>
      <p className="mt-1 max-w-md text-body-sm text-secondary leading-relaxed">
        {error instanceof Error ? error.message : 'Không thể kết nối đến máy chủ dữ liệu.'}
      </p>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="btn-interactive mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-label-md font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
      >
        <RotateCcw className="h-4 w-4" strokeWidth={2} />
        Thử lại
      </button>
    </div>
  )
}

export interface FeatureErrorBoundaryProps {
  children: React.ReactNode
}

/**
 * Feature-level error boundary wrapping individual route components.
 * Prevents single component errors from breaking the whole application shell.
 */
export const FeatureErrorBoundary: React.FC<FeatureErrorBoundaryProps> = ({ children }) => {
  const handleError = (error: Error) => {
    toast.error('Lỗi hiển thị học phần', {
      description: error.message || 'Thành phần trang gặp sự cố hiển thị.',
    })
  }

  return (
    <ReactErrorBoundary FallbackComponent={FeatureErrorFallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  )
}

const GlobalErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-12 text-center">
      <div className="card-interactive max-w-md w-full rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <AlertCircle className="h-7 w-7" strokeWidth={1.75} />
        </div>
        <h2 className="text-headline-md font-extrabold text-on-surface">Hệ thống gặp sự cố</h2>
        <p className="mt-2 text-body-sm text-secondary leading-relaxed">
          Ứng dụng IELTS Hồ Thành LMS đã gặp lỗi không thể tự khôi phục:{' '}
          <span className="font-mono text-rose-600">{error?.message || 'Lỗi không xác định'}</span>
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={resetErrorBoundary}
            className="btn-interactive inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-label-md font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
            Thử lại
          </button>
          <button
            type="button"
            onClick={() => {
              window.location.href = '/'
            }}
            className="btn-interactive inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-label-md font-semibold text-on-surface hover:bg-surface-container transition-colors shadow-xs"
          >
            <Home className="h-4 w-4" strokeWidth={1.75} />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Root-level error boundary wrapping the complete app.
 */
export const GlobalErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const handleError = (error: Error) => {
    toast.error('Lỗi ứng dụng nghiêm trọng', {
      description: error.message,
    })
  }

  return (
    <ReactErrorBoundary FallbackComponent={GlobalErrorFallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  )
}
