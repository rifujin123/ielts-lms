import React, { useState, useMemo } from 'react'
import { Search, GraduationCap } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { courseService } from '@/services/courseService'
import { queryKeys } from '@/lib/queryKeys'
import { CourseCardItem, CourseFilterTabs, type CourseStatusFilter } from './components'

/**
 * CoursesPage — Enrolled Courses Directory (`/courses`).
 * Shows only the courses the student is actively enrolled in or has completed.
 * Strictly no upsell, recommendation banners, or non-participating courses.
 */
export const CoursesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<CourseStatusFilter>('active')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: courses = [], isLoading } = useQuery({
    queryKey: queryKeys.courses.active(),
    queryFn: () => courseService.getActiveCourses(),
    staleTime: 5 * 60 * 1000,
  })

  // Calculate counts for tabs
  const counts = useMemo(() => {
    const active = courses.filter((c) => c.status === 'active').length
    const completed = courses.filter((c) => c.status === 'completed').length
    return { active, completed, all: courses.length }
  }, [courses])

  // Filtered list
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && c.status === 'active') ||
        (statusFilter === 'completed' && c.status === 'completed')

      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [courses, statusFilter, searchQuery])

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-on-surface" strokeWidth={1.75} />
            <h1 className="text-headline-sm font-bold tracking-tight text-on-surface">
              Khóa học của tôi
            </h1>
          </div>
          <p className="mt-1 text-body-sm text-secondary">
            Danh sách tất cả các chương trình học bạn đang tham gia tại trung tâm.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm khóa học, giảng viên..."
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2.5 pl-10 pr-4 text-body-sm text-on-surface placeholder:text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs (0px layout shift invariant) */}
      <CourseFilterTabs
        currentFilter={statusFilter}
        onFilterChange={setStatusFilter}
        counts={counts}
      />

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 animate-pulse rounded-xl border border-outline-variant bg-surface-container-low"
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-outline-variant py-16 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-secondary/60 mb-3" strokeWidth={1.5} />
          <h3 className="text-title-sm font-bold text-on-surface">Không tìm thấy khóa học nào</h3>
          <p className="mt-1 text-body-sm text-secondary max-w-md mx-auto">
            {searchQuery
              ? `Không có kết quả phù hợp với từ khóa "${searchQuery}". Vui lòng thử tìm kiếm khác.`
              : 'Bạn hiện không có khóa học nào ở trạng thái này.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCardItem key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CoursesPage
export { CourseDetailPage } from './CourseDetailPage'
