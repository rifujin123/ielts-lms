import React from 'react'

export const PageLoader: React.FC = () => {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-3 p-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-outline-variant border-t-primary" />
      <p className="text-body-sm font-medium text-secondary">Đang tải dữ liệu khóa học...</p>
    </div>
  )
}
