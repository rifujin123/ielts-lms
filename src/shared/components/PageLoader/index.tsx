import type React from 'react'

export interface PageLoaderProps {
  message?: string
  className?: string
}

/**
 * PageLoader — Academic minimalist loading indicator
 */
export const PageLoader: React.FC<PageLoaderProps> = ({ message, className = '' }) => {
  return (
    <div className={`flex min-h-[240px] items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        {message && <p className="text-body-sm text-secondary">{message}</p>}
      </div>
    </div>
  )
}

export default PageLoader
