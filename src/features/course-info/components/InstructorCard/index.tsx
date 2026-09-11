import React from 'react'
import type { Instructor } from '../../types'

interface InstructorCardProps {
  instructor: Instructor
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
            Giảng viên phụ trách
          </span>
          <span className="animate-pop-in inline-flex items-center gap-1 rounded-full bg-tertiary-container px-2 py-0.5 text-[11px] font-semibold text-on-tertiary-container shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
            Online
          </span>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-headline-md font-bold text-on-primary-container shadow-xs">
            NL
          </div>
          <div>
            <h3 className="text-headline-sm font-bold text-on-surface">{instructor.name}</h3>
            <p className="text-body-sm text-secondary">{instructor.title}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              <span className="animate-pop-in rounded bg-red-100 px-2 py-0.5 text-[11px] font-bold text-primary">
                {instructor.ieltsScore}
              </span>
              <span className="rounded bg-surface-container-high px-2 py-0.5 text-[11px] font-medium text-secondary">
                Linearthinking
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-outline-variant bg-surface-container-low p-3 text-body-sm text-secondary">
          <div className="font-semibold text-on-surface mb-1">Chứng chỉ & Chuyên môn:</div>
          <p className="text-[13px] leading-relaxed">{instructor.certification}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          className="btn-interactive inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-surface-container-low border border-outline-variant px-3 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-lg">mail</span>
          Gửi tin nhắn
        </button>
        <button
          type="button"
          className="btn-interactive inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-label-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">event</span>
          Đặt lịch 1-1
        </button>
      </div>
    </div>
  )
}
