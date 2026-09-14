import React from 'react'
import { cn } from '@/lib/utils'

export type CourseStatusFilter = 'active' | 'completed' | 'all'

interface CourseFilterTabsProps {
  currentFilter: CourseStatusFilter
  onFilterChange: (filter: CourseStatusFilter) => void
  counts: {
    active: number
    completed: number
    all: number
  }
}

export const CourseFilterTabs: React.FC<CourseFilterTabsProps> = ({
  currentFilter,
  onFilterChange,
  counts,
}) => {
  const tabs: { key: CourseStatusFilter; label: string; count: number }[] = [
    { key: 'active', label: 'Đang học', count: counts.active },
    { key: 'completed', label: 'Đã hoàn thành', count: counts.completed },
    { key: 'all', label: 'Tất cả khóa học', count: counts.all },
  ]

  return (
    <div className="flex items-center gap-2 border-b border-outline-variant pb-px">
      {tabs.map((tab) => {
        const isActive = currentFilter === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onFilterChange(tab.key)}
            className={cn(
              'group relative flex items-center gap-2 px-4 py-2.5 text-body-sm font-semibold transition-colors duration-150',
              // 0px layout shift: border-b-2 on both active and inactive
              'border-b-2',
              isActive
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-on-surface hover:border-slate-300',
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-semibold',
                isActive
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-secondary group-hover:text-on-surface',
              )}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
