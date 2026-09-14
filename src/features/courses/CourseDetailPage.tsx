import React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Calendar, Clock, ArrowRight } from 'lucide-react'
import { courseService } from '@/services/courseService'
import { queryKeys } from '@/lib/queryKeys'
import { useCourseStore } from '@/store/courseStore'

export const CourseDetailPage: React.FC = () => {
  const { courseId = '' } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const { setActiveCourseId } = useCourseStore()

  const { data: course, isLoading } = useQuery({
    queryKey: queryKeys.courses.detail(courseId),
    queryFn: () => courseService.getCourseById(courseId),
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse pb-12">
        <div className="h-6 w-36 rounded bg-surface-container-low" />
        <div className="h-44 rounded-2xl bg-surface-container-low" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="rounded-2xl border border-dashed border-outline-variant py-16 text-center">
        <h2 className="text-title-lg font-bold text-on-surface">Không tìm thấy khóa học</h2>
        <p className="mt-2 text-body-sm text-secondary">
          Khóa học với mã &quot;{courseId}&quot; không tồn tại hoặc bạn chưa được ghi danh.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-body-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách khóa học
        </Link>
      </div>
    )
  }

  const subjectLabel =
    course.type === 'IELTS' ? 'IELTS' : course.type === 'TOAN' ? 'Toán' : 'Đánh giá năng lực'

  const handleEnterCourse = () => {
    setActiveCourseId(course.id)
    navigate('/overview')
  }

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Back to courses navigation */}
      <button
        type="button"
        onClick={() => navigate('/courses')}
        className="inline-flex items-center gap-1.5 text-body-sm font-medium text-secondary hover:text-on-surface transition-colors cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        <span>Quay lại danh sách khóa học</span>
      </button>

      {/* Hero Course Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-gradient-to-r from-surface-container-lowest via-surface-container-low/40 to-surface-container-lowest p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
                {subjectLabel}
              </span>
              <span className="rounded-full border border-outline-variant px-3 py-1 text-xs font-medium text-secondary">
                Mục tiêu: {course.band}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                Đang học chính khóa
              </span>
            </div>

            <h1 className="text-headline-sm font-bold tracking-tight text-on-surface sm:text-headline-md">
              {course.name}
            </h1>
            <p className="max-w-3xl text-body-md text-secondary leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-secondary">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-on-surface/70" strokeWidth={1.75} />
                Lịch học: {course.schedule.join(', ')} ({course.classTime})
              </span>
              {course.startDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-on-surface/70" strokeWidth={1.75} />
                  Thời gian: {course.startDate} — {course.endDate || 'Hiện tại'}
                </span>
              )}
            </div>
          </div>

          {/* Top Enter CTA */}
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={handleEnterCourse}
              className="btn-interactive inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 text-body-md font-bold text-on-primary shadow-md transition-all duration-150 hover:bg-primary-hover hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer"
            >
              <span>Truy cập vào khóa học</span>
              <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
