import React from 'react'
import { Calendar, Video, Clock, UserCheck } from 'lucide-react'
import type { UpcomingSessionItem } from '@/types/api.types'

interface UpcomingTimetableProps {
  sessions?: UpcomingSessionItem[]
}

export const UpcomingTimetable: React.FC<UpcomingTimetableProps> = ({ sessions = [] }) => {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
        <div className="flex items-center gap-2.5">
          <Calendar className="h-5 w-5 text-on-surface" strokeWidth={1.75} />
          <h2 className="text-title-sm font-bold text-on-surface">Lịch học tiếp theo đa môn</h2>
        </div>
        <span className="text-xs font-semibold text-secondary">{sessions.length} buổi sắp tới</span>
      </div>

      <div className="mt-4 divide-y divide-outline-variant/60">
        {sessions.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-secondary">
            Không có lịch học nào trong 7 ngày tới.
          </p>
        ) : (
          sessions.map((sess) => (
            <div
              key={sess.id}
              className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between first:pt-1 last:pb-1"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface font-semibold text-xs text-center leading-tight">
                  {sess.subject === 'IELTS' ? 'IELTS' : sess.subject === 'Toán' ? 'TOÁN' : 'ĐGNL'}
                </div>
                <div>
                  <h3 className="text-body-sm font-bold text-on-surface line-clamp-1">
                    {sess.courseName}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                      <strong className="font-semibold text-on-surface">{sess.date}</strong> (
                      {sess.time})
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {sess.instructor}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <a
                  href={sess.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary shadow-xs transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Video className="h-3.5 w-3.5" strokeWidth={2} />
                  Vào phòng học
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
