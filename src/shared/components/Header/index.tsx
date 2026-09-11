import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, ChevronLeft, Bell } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

/**
 * Header — Top navigation bar, unified across all routes with back chevron.
 */
export const Header: React.FC = () => {
  const navigate = useNavigate()
  const { toggleSidebar, activePhase, currentUser } = useUIStore()

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/dashboard')
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

        {/* Back navigation left-chevron */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="Quay lại"
          title="Quay lại"
          className="flex items-center justify-center rounded-lg p-1.5 text-secondary hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
        </button>

        {/* Branding Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/branding.png"
            alt="IELTS Hồ Thành"
            className="h-10 max-w-[140px] object-contain"
          />
        </Link>

        {/* Course title badge */}
        <div className="hidden items-center gap-2 border-l border-outline-variant pl-4 lg:flex">
          <span className="rounded bg-primary-container px-2 py-0.5 text-label-sm font-semibold text-on-primary-container">
            IELTS 6.5
          </span>
          <span className="text-body-sm font-medium text-secondary truncate max-w-[280px]">
            Online-IELTS-6.5-12.08.2026-20:00
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Phase Pill */}
        <div className="animate-pop-in hidden items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-label-sm font-medium text-secondary sm:flex">
          <span className="h-2 w-2 rounded-full bg-tertiary"></span>
          <span>{activePhase.label}</span>
        </div>

        {/* Notifications */}
        <button
          aria-label="Thông báo"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:bg-surface-container transition-colors"
        >
          <Bell className="h-5 w-5" strokeWidth={1.8} />
          <span className="animate-pop-in absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-outline-variant">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-label-md font-bold text-on-secondary-container">
            {currentUser.initials}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface-container-lowest bg-tertiary" />
          </div>
          <div className="hidden text-left xl:block">
            <div className="text-label-md font-semibold text-on-surface leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-secondary leading-tight">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
