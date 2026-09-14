import React from 'react'
import { AlertCircle, FileText, CheckCircle } from 'lucide-react'
import type { UrgentDeadlineItem } from '@/types/api.types'

interface UrgentDeadlinesProps {
  deadlines?: UrgentDeadlineItem[]
}

export const UrgentDeadlines: React.FC<UrgentDeadlinesProps> = ({ deadlines = [] }) => {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
        <div className="flex items-center gap-2.5">
          <AlertCircle className="h-5 w-5 text-amber-600" strokeWidth={1.75} />
          <h2 className="text-title-sm font-bold text-on-surface">Bài tập & Hạn nộp sắp tới</h2>
        </div>
        <span className="text-xs font-semibold text-secondary">{deadlines.length} bài cần làm</span>
      </div>

      <div className="mt-4 divide-y divide-outline-variant/60">
        {deadlines.length === 0 ? (
          <div className="py-6 text-center text-secondary">
            <CheckCircle className="mx-auto h-6 w-6 text-emerald-600 mb-1" strokeWidth={1.75} />
            <p className="text-body-sm">Tuyệt vời! Bạn đã hoàn thành tất cả bài tập hiện tại.</p>
          </div>
        ) : (
          deadlines.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 py-3 first:pt-1 last:pb-1"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-surface-container text-secondary">
                  <FileText className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div>
                  <h4 className="text-body-sm font-semibold text-on-surface line-clamp-1">
                    {item.title}
                  </h4>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-secondary">
                    <span className="font-medium text-on-surface/80">{item.courseName}</span>
                    <span>•</span>
                    <span className="rounded bg-amber-50 px-1.5 py-0.2 text-[11px] font-semibold text-amber-800 border border-amber-200/60">
                      Hạn: {item.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
