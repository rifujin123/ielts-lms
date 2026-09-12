import React from 'react'
import { MistakeLogPage } from '@/features/mistake-log'

/**
 * Backwards compatibility wrapper.
 * Renamed to MistakeLogPage (Sổ tay lỗi sai & Bẫy đề thi).
 */
export const ErrorLogPage: React.FC = () => {
  return <MistakeLogPage />
}

export default ErrorLogPage
