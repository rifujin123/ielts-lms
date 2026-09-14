import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useCourseStore } from '@/store/courseStore'
import type { CourseCard } from '@/types/api.types'

interface CourseProgressSnapshotProps {
  courses: CourseCard[]
}

export const CourseProgressSnapshot: React.FC<CourseProgressSnapshotProps> = ({ courses }) => {
  const navigate = useNavigate()
  const { setActiveCourseId } = useCourseStore()

  const handleEnterCourse = (courseId: string) => {
    setActiveCourseId(courseId)
    navigate('/overview')
  }

  const handleViewDetail = (courseId: string) => {
    navigate(`/courses/${courseId}`)
  }

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-5 w-5 text-on-surface" strokeWidth={1.75} />
          <h2 className="text-title-sm font-bold text-on-surface">Tiến độ khóa học của bạn</h2>
        </div>
        <button
          onClick={() => navigate('/courses')}
          className="text-xs font-semibold text-secondary hover:text-on-surface transition-colors inline-flex items-center gap-1"
        >
          Xem tất cả ({courses.length})
          <ArrowRight className="h-3 w-3" strokeWidth={2} />
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="py-8 text-center text-secondary">
          <p className="text-body-sm">Bạn chưa ghi danh vào khóa học nào.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {courses.map((course) => {
            const progressPercent = Math.round(
              (course.completedSessions / (course.totalSessions || 1)) * 100,
            )

            const subjectLabel =
              course.type === 'IELTS'
                ? 'IELTS'
                : course.type === 'TOAN'
                  ? 'Toán'
                  : 'Đánh giá năng lực'

            return (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-lg border border-outline-variant bg-surface-container-low/50 p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-surface-container-highest px-2 py-0.5 text-[11px] font-semibold text-on-surface">
                      {subjectLabel}
                    </span>
                    <span className="text-xs font-semibold text-secondary">{course.band}</span>
                  </div>

                  <h3
                    onClick={() => handleViewDetail(course.id)}
                    className="mt-2 text-body-sm font-bold text-on-surface line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                    title={course.name}
                  >
                    {course.name}
                  </h3>

                  <p className="mt-1 text-xs text-secondary">GV: {course.instructor}</p>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-medium text-secondary mb-1.5">
                      <span>Tiến độ học tập</span>
                      <span className="font-bold text-on-surface">
                        {course.completedSessions}/{course.totalSessions} buổi ({progressPercent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-[11px] text-secondary">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
                    <span>Chuyên cần: {course.attendanceRate ?? 100}%</span>
                    <span className="mx-1 text-outline-variant">•</span>
                    <span>Điểm TB: {course.averageScore ?? '6.5'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewDetail(course.id)}
                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
                  >
                    Chi tiết
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEnterCourse(course.id)}
                    className="btn-interactive inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary shadow-xs transition-colors hover:bg-primary-hover"
                  >
                    Vào học
                    <ArrowRight className="h-3 w-3" strokeWidth={2} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
