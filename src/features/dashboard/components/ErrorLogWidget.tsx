import React from 'react'
import { MistakeLogWidget } from './MistakeLogWidget'

/**
 * Backwards compatibility wrapper.
 * Renamed to MistakeLogWidget (Sổ tay lỗi sai & Bẫy đề thi).
 */
export const ErrorLogWidget: React.FC = () => {
  return <MistakeLogWidget />
}

export default ErrorLogWidget
