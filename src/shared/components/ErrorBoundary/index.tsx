import React from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { ErrorBoundary as ReactErrorBoundary, type FallbackProps } from 'react-error-boundary'

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="card-interactive my-6 flex flex-col items-center justify-center rounded-xl border border-error-container bg-surface-container-lowest p-8 text-center shadow-xs">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-error">
        <AlertCircle className="h-6 w-6" strokeWidth={2} />
      </div>
      <h3 className="text-headline-sm text-on-surface">Đã xảy ra lỗi tải dữ liệu</h3>
      <p className="mt-1 max-w-md text-body-sm text-secondary">
        {error instanceof Error ? error.message : 'Không thể kết nối đến máy chủ.'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="btn-interactive mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md text-on-primary hover:bg-primary-hover transition-colors"
      >
        <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
        Thử lại
      </button>
    </div>
  )
}

export interface FeatureErrorBoundaryProps {
  children: React.ReactNode
}

export const FeatureErrorBoundary: React.FC<FeatureErrorBoundaryProps> = ({ children }) => {
  return <ReactErrorBoundary FallbackComponent={ErrorFallback}>{children}</ReactErrorBoundary>
}
