import React from 'react'
import { GraduationCap, TrendingUp, CalendarCheck, Flame } from 'lucide-react'
import type { StudentGlobalProgress } from '@/types/api.types'

interface GlobalKpiCardsProps {
  progress?: StudentGlobalProgress
}

export const GlobalKpiCards: React.FC<GlobalKpiCardsProps> = ({ progress }) => {
  const kpis = [
    {
      title: 'Khóa học đang học',
      value: progress?.totalEnrolledCourses ?? 3,
      unit: 'khóa',
      subtext: 'IELTS, Toán, ĐGNL',
      icon: GraduationCap,
    },
    {
      title: 'Tiến độ trung bình',
      value: `${progress?.averageCompletionRate ?? 38}%`,
      unit: '',
      subtext: 'Tổng thể các chương trình',
      icon: TrendingUp,
    },
    {
      title: 'Số buổi đã học',
      value: `${progress?.totalCompletedSessions ?? 38}/${progress?.totalSessions ?? 100}`,
      unit: 'buổi',
      subtext: 'Đúng tiến độ đào tạo',
      icon: CalendarCheck,
    },
    {
      title: 'Chuỗi ngày học',
      value: `${progress?.learningStreakDays ?? 14}`,
      unit: 'ngày',
      subtext: 'Duy trì học đều đặn',
      icon: Flame,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon
        return (
          <div
            key={idx}
            className="flex min-w-0 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-slate-300"
          >
            <div className="flex items-start justify-between gap-2 min-w-0">
              <span className="text-body-sm font-medium text-secondary truncate" title={kpi.title}>
                {kpi.title}
              </span>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-container-low text-on-surface">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
            </div>

            <div className="mt-3 min-w-0">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-on-surface tabular-nums">
                  {kpi.value}
                </span>
                {kpi.unit && (
                  <span className="text-body-sm font-medium text-secondary">{kpi.unit}</span>
                )}
              </div>
              <p className="mt-1 text-xs text-secondary/80 truncate" title={kpi.subtext}>
                {kpi.subtext}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
