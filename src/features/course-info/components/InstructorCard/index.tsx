import React from 'react'
import { Mail, Calendar } from 'lucide-react'
import type { Instructor } from '../../types'

interface InstructorCardProps {
  instructor: Instructor
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor }) => {
  return (
    <div className="card-interactive flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
            Giảng viên phụ trách
          </span>
          <span className="badge-minimal animate-pop-in">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              <span className="badge-score animate-pop-in">{instructor.ieltsScore}</span>
              <span className="badge-tag">Linearthinking</span>
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
          <Mail className="h-4 w-4" strokeWidth={1.75} />
          Gửi tin nhắn
        </button>
        <button
          type="button"
          className="btn-interactive inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-label-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
        >
          <Calendar className="h-4 w-4" strokeWidth={1.75} />
          Đặt lịch 1-1
        </button>
      </div>
    </div>
  )
}
