import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, UserCheck, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useCourseStore } from '@/store/courseStore'
import type { CourseCard } from '@/types/api.types'

interface CourseCardItemProps {
  course: CourseCard
}

export const CourseCardItem: React.FC<CourseCardItemProps> = ({ course }) => {
  const navigate = useNavigate()
  const { setActiveCourseId } = useCourseStore()

  const progressPercent = Math.round((course.completedSessions / (course.totalSessions || 1)) * 100)

  const subjectLabel =
    course.type === 'IELTS' ? 'IELTS' : course.type === 'TOAN' ? 'Toán' : 'Đánh giá năng lực'

  const handleEnterWorkspace = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveCourseId(course.id)
    navigate('/overview')
  }

  const handleViewDetail = () => {
    navigate(`/courses/${course.id}`)
  }

  return (
    <div
      onClick={handleViewDetail}
      className="group flex flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md cursor-pointer"
    >
      <div>
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="rounded bg-primary-container px-2.5 py-0.5 text-xs font-semibold text-on-primary-container">
            {subjectLabel}
          </span>
          <span className="rounded border border-outline-variant px-2 py-0.5 text-xs font-medium text-secondary">
            {course.band}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-title-sm font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
          {course.name}
        </h3>

        {/* Description */}
        <p className="mt-1.5 text-body-sm text-secondary line-clamp-2">{course.description}</p>

        {/* Meta details */}
        <div className="mt-4 space-y-2 border-t border-outline-variant/60 pt-3 text-xs text-secondary">
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 shrink-0 text-on-surface/70" strokeWidth={1.75} />
            <span>
              GV: <strong className="text-on-surface font-semibold">{course.instructor}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-on-surface/70" strokeWidth={1.75} />
            <span>
              {course.schedule.join(', ')} ({course.classTime})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-on-surface/70" strokeWidth={1.75} />
            <span>
              Buổi tiếp theo:{' '}
              <strong className="text-on-surface font-semibold">{course.currentSession}</strong>
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs font-medium text-secondary mb-1.5">
            <span>Tiến độ chương trình</span>
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

        {/* Metrics pill */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-secondary">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2} />
          <span>Chuyên cần: {course.attendanceRate ?? 100}%</span>
          <span className="mx-1 text-outline-variant">•</span>
          <span>Điểm TB: {course.averageScore ?? '6.5'}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-outline-variant/60 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleViewDetail()
          }}
          className="rounded-lg px-3 py-2 text-xs font-semibold text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
        >
          Xem chi tiết
        </button>
        <button
          type="button"
          onClick={handleEnterWorkspace}
          className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-on-primary shadow-xs transition-colors hover:bg-primary-hover"
        >
          Truy cập khóa học
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
