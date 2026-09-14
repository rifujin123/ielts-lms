import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, ChevronLeft, Bell } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { useCourseStore } from '@/store/courseStore'
import { activeCoursesMock } from '@/mocks/course.mock'
import { useQuery } from '@tanstack/react-query'
import { courseService } from '@/services/courseService'
import { queryKeys } from '@/lib/queryKeys'
import { UserDropdown } from './UserDropdown'

/**
 * Header — Top navigation bar, unified across all routes with back chevron.
 */
export const Header: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleSidebar, activePhase } = useUIStore()
  const { activeCourseId } = useCourseStore()

  // Step 0: Cổng học viên (Portal Level)
  const isPortalRoute =
    location.pathname === '/dashboard' ||
    location.pathname === '/courses' ||
    location.pathname.startsWith('/courses/')

  // Distinguish when the back button will exit to Cổng học viên:
  // Inside course workspace: on /overview (entry root screen) OR if no previous course history in tab session
  const isReadyToExitToPortal =
    location.pathname === '/overview' ||
    (!isPortalRoute &&
      typeof window !== 'undefined' &&
      (!window.history.state || window.history.state.idx === 0))

  const { data: courses = activeCoursesMock } = useQuery({
    queryKey: queryKeys.courses.active(),
    queryFn: () => courseService.getActiveCourses(),
    staleTime: 5 * 60 * 1000,
  })

  const currentCourse =
    courses.find((c) => c.id === activeCourseId) || courses[0] || activeCoursesMock[0]

  const handleBack = () => {
    if (isReadyToExitToPortal) {
      // Exit course workspace and return directly to Cổng học viên
      navigate('/courses')
    } else if (location.pathname.startsWith('/courses/')) {
      navigate('/courses')
    } else if (location.pathname === '/courses') {
      navigate('/dashboard')
    } else if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/courses')
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 md:px-8">
      {/* Left side */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle Navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-secondary hover:bg-surface-container md:hidden"
        >
          <Menu className="h-5 w-5" strokeWidth={2} />
        </button>

        {/* Back navigation left-chevron (Hidden on portal top-level routes /dashboard and /courses) */}
        {location.pathname !== '/dashboard' &&
          location.pathname !== '/courses' &&
          (isReadyToExitToPortal ? (
            /* Square button with 5px border line, transparent color when ready to jump to portal */
            <button
              type="button"
              onClick={handleBack}
              aria-label="Về Cổng học viên"
              title="Về Cổng học viên"
              className="btn-interactive flex h-8 w-8 items-center justify-center rounded-[5px] border border-outline bg-transparent text-secondary hover:border-primary hover:text-primary transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>
          ) : (
            /* Normal back button when jumping between screens inside the course */
            <button
              type="button"
              onClick={handleBack}
              aria-label="Quay lại"
              title="Quay lại"
              className="flex items-center justify-center rounded-lg p-1.5 text-secondary hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>
          ))}

        {/* Branding Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <img
            src="/branding.png"
            alt="IELTS Hồ Thành"
            className="h-10 max-w-[140px] object-contain"
          />
        </Link>

        {/* Step 1: Course Workspace Title Badge (Only shown inside classroom workspace) */}
        {!isPortalRoute && (
          <Link
            to="/courses"
            title="Đổi khóa học"
            className="hidden items-center gap-2 border-l border-outline-variant pl-4 lg:flex hover:opacity-85 transition-opacity"
          >
            <span className="rounded bg-primary px-2 py-0.5 text-label-sm font-semibold text-on-primary">
              {currentCourse?.type === 'IELTS'
                ? 'IELTS'
                : currentCourse?.type === 'TOAN'
                  ? 'Toán'
                  : 'ĐGNL'}
            </span>
            <span className="text-body-sm font-medium text-secondary truncate max-w-[280px]">
              {currentCourse?.name}
            </span>
            <span className="text-xs font-medium text-primary underline ml-1">Đổi khóa</span>
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Phase Pill or Portal Pill */}
        {isPortalRoute ? (
          <div className="animate-pop-in hidden items-center gap-1.5 rounded-full border border-primary/20 bg-primary-container/40 px-3 py-1 text-label-sm font-semibold text-on-primary-container sm:flex">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            <span>Cổng Học Viên Đa Môn</span>
          </div>
        ) : (
          <div className="animate-pop-in hidden items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-label-sm font-medium text-secondary sm:flex">
            <span className="h-2 w-2 rounded-full bg-tertiary"></span>
            <span>{activePhase.label}</span>
          </div>
        )}

        {/* Notifications */}
        <button
          aria-label="Thông báo"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:bg-surface-container transition-colors"
        >
          <Bell className="h-5 w-5" strokeWidth={1.8} />
          <span className="animate-pop-in absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User Dropdown with Avatar */}
        <div className="pl-2 border-l border-outline-variant">
          <UserDropdown />
        </div>
      </div>
    </header>
  )
}
