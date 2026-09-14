import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCog, LogOut, ChevronDown } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { toast } from '@/shared/components/Toast/toastStore'

export const UserDropdown: React.FC = () => {
  const navigate = useNavigate()
  const { currentUser } = useUIStore()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleLogout = () => {
    setIsOpen(false)
    toast.success('Đã đăng xuất thành công', {
      description: 'Phiên làm việc của bạn đã kết thúc an toàn.',
    })
  }

  const handleNavigate = (path: string) => {
    setIsOpen(false)
    navigate(path)
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Mở menu cá nhân học viên"
        className="flex items-center gap-2 pl-2.5 py-1 pr-1.5 rounded-full border border-transparent hover:border-outline-variant hover:bg-surface-container-low transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-container text-label-md font-bold text-on-secondary-container shadow-xs">
          {currentUser.initials}
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-surface-container-lowest bg-tertiary" />
        </div>
        <div className="hidden text-left xl:block">
          <div className="text-label-md font-semibold text-on-surface leading-tight">
            {currentUser.name}
          </div>
          <div className="text-[11px] text-secondary leading-tight">{currentUser.role}</div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={2}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="animate-pop-in absolute right-0 top-full mt-2 w-72 origin-top-right rounded-2xl border border-outline-variant bg-surface-container-lowest p-2 shadow-xl z-50 focus:outline-none"
        >
          {/* User mini summary - clean & unboxed */}
          <div className="flex items-center gap-3 px-3 py-2.5 border-b border-outline-variant/60 mb-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-title-sm font-bold text-on-primary-container shadow-xs">
              {currentUser.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-label-md font-bold text-on-surface truncate">{currentUser.name}</p>
              <p className="text-[12px] text-secondary truncate">thaotran@example.com</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-0.5 py-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => handleNavigate('/profile')}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-label-md font-medium text-on-surface hover:bg-surface-container transition-colors duration-150 cursor-pointer text-left group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-150">
                <UserCog className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <div className="leading-snug">Tài khoản</div>
                <div className="text-[11px] text-secondary font-normal">
                  Thông tin, bảo mật & lớp học
                </div>
              </div>
            </button>
          </div>

          <div className="my-1.5 border-t border-outline-variant/60" />

          {/* Logout Action */}
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-label-md font-medium text-error hover:bg-error-container/20 transition-colors duration-150 cursor-pointer text-left"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-error-container/40 text-error">
              <LogOut className="h-4 w-4" strokeWidth={2} />
            </div>
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  )
}
