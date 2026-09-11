import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { courseService } from '@/services/courseService'
import { calcProgressPercent } from '@/lib/utils'
import { activeCoursesMock } from '@/mocks/course.mock'

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
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-secondary">
            search
          </span>
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
            <span className="material-symbols-outlined text-primary text-xl">school</span>
          </div>
          <p className="mt-2 text-headline-md font-bold text-on-surface">1 Khóa học</p>
          <span className="text-[11px] text-tertiary font-medium">Tiến độ đều đặn</span>
        </div>

        <div className="animate-fade-in-up stagger-2 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-secondary">Buổi đã học</span>
            <span className="material-symbols-outlined text-tertiary text-xl">event_available</span>
          </div>
          <p className="mt-2 text-headline-md font-bold text-on-surface">12 / 36 Buổi</p>
          <span className="text-[11px] text-secondary">Hoàn thành 33%</span>
        </div>

        <div className="animate-fade-in-up stagger-3 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-secondary">Bài tập cần làm</span>
            <span className="material-symbols-outlined text-amber-500 text-xl">assignment</span>
          </div>
          <p className="mt-2 text-headline-md font-bold text-on-surface">2 Bài mới</p>
          <span className="text-[11px] text-amber-600 font-medium">Hạn nộp trong 3 ngày</span>
        </div>

        <div className="animate-fade-in-up stagger-4 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold text-secondary">Điểm danh</span>
            <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
          </div>
          <p className="mt-2 text-headline-md font-bold text-tertiary">100%</p>
          <span className="text-[11px] text-secondary">Không vắng buổi nào</span>
        </div>
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
          {filteredCourses.map((course) => {
            const percent = calcProgressPercent(course.completedSessions, course.totalSessions)
            return (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs hover:border-primary/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="animate-pop-in rounded-md bg-red-100 px-2.5 py-0.5 text-label-sm font-bold text-primary">
                      {course.level}
                    </span>
                    <span className="animate-pop-in inline-flex items-center gap-1 text-label-sm font-semibold text-tertiary">
                      <span className="h-2 w-2 rounded-full bg-tertiary" />
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
                      <span className="material-symbols-outlined text-base">person</span>
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">schedule</span>
                      <span>{course.classTime}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex justify-between text-body-sm">
                      <span className="font-semibold text-on-surface">Tiến độ học tập</span>
                      <span className="font-bold text-primary">{percent}%</span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-container">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-secondary">
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
                    <span className="material-symbols-outlined text-lg">videocam</span>
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
