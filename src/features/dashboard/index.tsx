import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import {
  Search,
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  CheckCircle2,
  User,
  Clock,
  Video,
} from 'lucide-react'
import { courseService } from '@/services/courseService'
import { calcProgressPercent } from '@/lib/utils'
import { activeCoursesMock } from '@/mocks/course.mock'
import { ProgressBar } from '@/shared/components'
import { ErrorLogWidget } from './components'

/**
 * DashboardPage — LMS Student Overview (screen 02).
 * Shows active course cards, session progress bar, and direct classroom access.
 * Line count budget: 200-300 lines.
 */
export const DashboardPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  const { data: courses = activeCoursesMock, isLoading: _isLoading } = useQuery({
    queryKey: ['active-courses'],
    queryFn: () => courseService.getActiveCourses(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  const filteredCourses = (courses ?? []).filter((c) =>
    debouncedSearch ? c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) : true,
  )

  return (
    <div className="flex flex-col gap-6">
      {/* ── Welcome Header ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-lg font-bold text-on-surface">Tổng quan khóa học</h1>
          <p className="mt-1 text-body-sm text-secondary">
            Chào mừng bạn quay trở lại! Bạn có 1 buổi học trực tuyến diễn ra trong tuần này.
          </p>
        </div>

        {/* Search input with 300ms debounce */}
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary"
            strokeWidth={1.8}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm khóa học của bạn..."
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-4 text-body-sm text-on-surface focus:border-primary focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* ── Stat Summary Cards ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-in-up stagger-1 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-secondary">Khóa đang học</span>
            <GraduationCap className="h-5 w-5 text-primary" strokeWidth={1.8} />
          </div>
          <p className="mt-2 text-headline-md font-bold text-on-surface">1 Khóa học</p>
          <span className="text-[11px] text-tertiary font-medium">Tiến độ đều đặn</span>
        </div>

        <div className="animate-fade-in-up stagger-2 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-secondary">Buổi đã học</span>
            <CalendarCheck className="h-5 w-5 text-tertiary" strokeWidth={1.8} />
          </div>
          <p className="mt-2 text-headline-md font-bold text-on-surface">12 / 36 Buổi</p>
          <span className="text-[11px] text-secondary">Hoàn thành 33%</span>
        </div>

        <div className="animate-fade-in-up stagger-3 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-secondary">Bài tập cần làm</span>
            <ClipboardList className="h-5 w-5 text-amber-500" strokeWidth={1.8} />
          </div>
          <p className="mt-2 text-headline-md font-bold text-on-surface">2 Bài mới</p>
          <span className="text-[11px] text-amber-600 font-medium">Hạn nộp trong 3 ngày</span>
        </div>

        <div className="animate-fade-in-up stagger-4 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-secondary">Điểm danh</span>
            <CheckCircle2 className="h-5 w-5 text-tertiary" strokeWidth={1.8} />
          </div>
          <p className="mt-2 text-headline-md font-bold text-tertiary">100%</p>
          <span className="text-[11px] text-secondary">Không vắng buổi nào</span>
        </div>
      </div>

      {/* ── Personal Error Log & Exam Trap Analytics (Epic 4) ───── */}
      <div className="animate-fade-in-up stagger-5">
        <ErrorLogWidget />
      </div>

      {/* ── Active Courses Section ──────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-sm font-bold text-on-surface">Khóa học đang hoạt động</h2>
          <span className="text-body-sm text-secondary">
            {filteredCourses.length} khóa học được tìm thấy
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filteredCourses.map((course, idx) => {
            const percent = calcProgressPercent(course.completedSessions, course.totalSessions)
            return (
              <div
                key={course.id}
                className={`animate-fade-in-up stagger-${idx + 1} card-interactive flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="badge-score animate-pop-in">{course.level}</span>
                    <span className="badge-minimal animate-pop-in">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Đang diễn ra
                    </span>
                  </div>

                  <h3 className="mt-3 text-headline-sm font-bold text-on-surface hover:text-primary transition-colors">
                    <Link to="/">{course.name}</Link>
                  </h3>
                  <p className="mt-1 text-body-sm text-secondary line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-body-sm text-secondary">
                    <div className="flex items-center gap-1.5">
                      <User className="h-4 w-4" strokeWidth={1.8} />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" strokeWidth={1.8} />
                      <span>{course.classTime}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="mb-1.5 flex justify-between text-body-sm">
                      <span className="font-semibold text-on-surface">Tiến độ học tập</span>
                      <span className="font-bold text-primary">{percent}%</span>
                    </div>
                    <ProgressBar value={percent} size="lg" variant="primary" />
                    <div className="mt-1.5 text-[11px] text-secondary">
                      Đã học {course.completedSessions} trên tổng số {course.totalSessions} buổi
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-outline-variant pt-4">
                  <a
                    href={course.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2 text-label-md font-semibold text-on-primary hover:bg-primary-hover shadow-xs"
                  >
                    <Video className="h-4 w-4" strokeWidth={2} />
                    Vào phòng học
                  </a>
                  <Link
                    to="/"
                    className="btn-interactive inline-flex items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-label-md font-semibold text-on-surface hover:bg-surface-container"
                  >
                    Chi tiết khóa học
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
