import React from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { useGlobalDashboard } from './hooks/useGlobalDashboard'
import {
  GlobalKpiCards,
  UpcomingTimetable,
  CourseProgressSnapshot,
  UrgentDeadlines,
} from './components'

/**
 * MasterDashboardPage — Student Portal Center (`/dashboard`).
 * Aggregates all enrolled courses (IELTS, Toán, ĐGNL), upcoming schedules,
 * global KPIs, and upcoming homework/test deadlines.
 */
export const MasterDashboardPage: React.FC = () => {
  const { progress, courses } = useGlobalDashboard()

  return (
    <div className="space-y-6 pb-12 animate-fade-in w-full min-w-0">
      {/* Welcome Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low p-6 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Cổng Học Viên Đa Môn</span>
          </div>
          <h1 className="mt-2.5 text-headline-sm font-bold tracking-tight text-on-surface">
            Chào mừng bạn quay trở lại học tập!
          </h1>
          <p className="mt-1 text-body-sm text-secondary">
            Theo dõi tiến độ học tập, lịch học trực tuyến và hoàn thành bài tập của các khóa học.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-body-sm font-semibold text-on-surface shadow-xs transition-colors hover:bg-surface-container"
          >
            Khóa học của tôi
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>

      {/* Global Metrics KPI */}
      <GlobalKpiCards progress={progress} />

      {/* Course Progress Snapshot */}
      <CourseProgressSnapshot courses={courses} />

      {/* Two columns: Upcoming Schedule + Urgent Deadlines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <UpcomingTimetable sessions={progress?.upcomingSessions} />
        </div>
        <div className="lg:col-span-5">
          <UrgentDeadlines deadlines={progress?.urgentDeadlines} />
        </div>
      </div>
    </div>
  )
}

export default MasterDashboardPage
