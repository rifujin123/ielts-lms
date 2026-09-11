import React from 'react'
import type { CourseObjective } from '../../types'

interface ObjectivesCardProps {
  description: string
  highlights: CourseObjective[]
}

export const ObjectivesCard: React.FC<ObjectivesCardProps> = ({ description, highlights }) => {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-2xl">track_changes</span>
        <h3 className="text-headline-sm font-bold text-on-surface">Mục tiêu khóa học</h3>
      </div>

      <p className="mt-3 text-body-sm leading-relaxed text-secondary">{description}</p>

      <div className="mt-4 flex flex-col gap-3">
        {highlights.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 rounded-xl bg-surface-container-low p-3">
            <span className="material-symbols-outlined text-tertiary text-xl shrink-0 mt-0.5">
              check_circle
            </span>
            <span className="text-body-sm font-medium text-on-surface leading-snug">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
