import React from 'react'
import { SearchX, type LucideIcon } from 'lucide-react'

export interface EmptyStateAction {
  label: string
  onClick: () => void
  icon?: LucideIcon
}

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: EmptyStateAction
  className?: string
  compact?: boolean
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`animate-fade-in-up flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest text-center ${
        compact ? 'min-h-[180px] p-6' : 'min-h-[260px] p-8 sm:p-12'
      } ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-secondary">
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className="mt-3 text-title-md font-bold text-on-surface">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-body-sm text-secondary leading-relaxed">{description}</p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="btn-interactive mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary shadow-xs hover:bg-primary-hover"
        >
          {action.icon && <action.icon className="h-4 w-4" strokeWidth={2} />}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  )
}

export default EmptyState
