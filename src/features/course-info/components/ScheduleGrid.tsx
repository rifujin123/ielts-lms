import React from 'react'
import { Clock } from 'lucide-react'
import type { ScheduleDay } from '../types'
import { cn } from '@/lib/utils'

interface ScheduleGridProps {
  schedule: ScheduleDay[]
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({ schedule }) => {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-headline-sm font-bold text-on-surface">
            Lịch học hàng tuần trong giai đoạn
          </h3>
          <p className="text-body-sm text-secondary">
            Lịch học cố định 3 buổi/tuần (Thứ 2 - Thứ 4 - Thứ 6) qua Zoom trực tuyến
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 text-label-sm font-medium text-secondary">
          <Clock className="h-4 w-4" strokeWidth={2} />
          20:00 - 22:00
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
        {schedule.map((day) => (
          <div
            key={day.dayKey}
            className={cn(
              'flex flex-col items-center justify-between rounded-xl border p-3.5 text-center transition-all',
              day.isClassDay
                ? 'border-primary/40 bg-red-50/60 shadow-xs ring-1 ring-primary/20'
                : 'border-outline-variant bg-surface-container-low/50 opacity-60',
            )}
          >
            <span className="text-label-sm font-bold text-secondary uppercase">{day.dayKey}</span>
            <span
              className={cn(
                'my-1 text-body-md font-bold',
                day.isClassDay ? 'text-primary' : 'text-on-surface',
              )}
            >
              {day.dayName}
            </span>

            {day.isClassDay ? (
              <div className="mt-1 flex flex-col items-center gap-1">
                <span className="animate-pop-in rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-on-primary shadow-xs">
                  Có lớp học
                </span>
                <span className="text-[11px] font-semibold text-secondary">{day.time}</span>
              </div>
            ) : (
              <span className="mt-2 text-[11px] text-secondary">Nghỉ</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
