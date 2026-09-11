import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'

export const Header: React.FC = () => {
  const location = useLocation()
  const { toggleSidebar, activePhase, currentUser } = useUIStore()

  const isDashboard = location.pathname === '/dashboard'

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
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        {!isDashboard && (
          <Link
            to="/dashboard"
            aria-label="Về trang tổng quan"
            className="hidden items-center justify-center rounded-lg p-2 text-secondary hover:bg-surface-container hover:text-on-surface md:flex"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
        )}

        {/* DOL Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-on-primary font-bold shadow-xs">
            <span className="text-lg tracking-wider font-display">DOL</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-headline-sm tracking-tight text-on-surface">DOL English</span>
            <span className="block text-[10px] uppercase tracking-widest text-primary font-semibold">
              IELTS LMS
            </span>
          </div>
        </Link>

        {/* Course title for course pages */}
        {!isDashboard && (
          <div className="hidden items-center gap-2 border-l border-outline-variant pl-4 lg:flex">
            <span className="rounded bg-primary-container px-2 py-0.5 text-label-sm font-semibold text-on-primary-container">
              IELTS 6.5
            </span>
            <span className="text-body-sm font-medium text-secondary truncate max-w-[280px]">
              Online-IELTS-6.5-12.08.2026-20:00
            </span>
          </div>
        )}
      </div>

      {/* Center: Search for Dashboard */}
      {isDashboard && (
        <div className="hidden max-w-md flex-1 px-6 md:block">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-secondary">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm khóa học, tài liệu, bài giảng..."
              className="w-full rounded-full border border-outline-variant bg-surface-container-low py-1.5 pl-9 pr-4 text-body-sm text-on-surface focus:border-primary focus:bg-surface-container-lowest focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Phase Pill */}
        {!isDashboard && (
          <div className="hidden items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-low px-3 py-1 text-label-sm font-medium text-secondary sm:flex">
            <span className="h-2 w-2 rounded-full bg-tertiary"></span>
            <span>{activePhase.label}</span>
          </div>
        )}

        {/* Notifications */}
        <button
          aria-label="Thông báo"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
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
