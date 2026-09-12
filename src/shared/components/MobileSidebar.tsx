import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'
import { Sidebar } from './Sidebar'

export const MobileSidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useUIStore()
  const location = useLocation()

  // Close sidebar on route change
  useEffect(() => {
    closeSidebar()
  }, [location.pathname, closeSidebar])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isSidebarOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSidebarOpen, closeSidebar])

  return (
    <div
      className={`fixed inset-0 z-50 flex md:hidden transition-all duration-300 ${
        isSidebarOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible delay-300'
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isSidebarOpen}
    >
      {/* Backdrop with smooth fade in/out */}
      <div
        className={`fixed inset-0 bg-on-surface/40 backdrop-blur-xs transition-opacity duration-300 ease-out ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeSidebar}
      />

      {/* Drawer Panel with smooth slide in/out */}
      <div
        className={`relative flex w-72 max-w-[85vw] flex-1 flex-col bg-surface-container-lowest shadow-2xl transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-outline-variant px-4">
          <div className="flex items-center gap-2">
            <img
              src="/branding.png"
              alt="IELTS Hồ Thành"
              className="h-8 max-w-[120px] object-contain"
            />
          </div>
          <button
            onClick={closeSidebar}
            aria-label="Đóng menu"
            className="btn-interactive flex h-9 w-9 items-center justify-center rounded-xl text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <Sidebar className="w-full flex-1 border-r-0" onItemClick={closeSidebar} />
      </div>
    </div>
  )
}
