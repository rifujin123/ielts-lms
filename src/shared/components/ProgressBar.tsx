import type React from 'react'

export interface ProgressBarProps {
  value: number // 0 to 100
  label?: string
  showPercentage?: boolean
  variant?: 'primary' | 'emerald' | 'amber' | 'error' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const VARIANT_MAP = {
  primary: 'bg-primary',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  error: 'bg-error',
  secondary: 'bg-secondary',
}

const SIZE_MAP = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-2.5',
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = false,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, Math.round(value)))

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="mb-1.5 flex items-center justify-between text-body-xs">
          {label && <span className="font-medium text-on-surface">{label}</span>}
          {showPercentage && <span className="font-bold text-secondary">{clampedValue}%</span>}
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-surface-container ${SIZE_MAP[size]}`}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${VARIANT_MAP[variant]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
