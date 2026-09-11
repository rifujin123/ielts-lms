import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useUIStore } from '@/store/uiStore'
import { Sidebar } from '@/shared/components/Sidebar'

export const MobileSidebar: React.FC = () => {
  const { isSidebarOpen, closeSidebar } = useUIStore()
  const location = useLocation()

  // Close sidebar on route change
  useEffect(() => {
    closeSidebar()
  }, [location.pathname, closeSidebar])

  if (!isSidebarOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
        onClick={closeSidebar}
      />

      {/* Drawer */}
      <div className="relative flex w-72 max-w-[85vw] flex-1 flex-col bg-surface-container-lowest shadow-xl">
        <div className="flex h-16 items-center justify-between border-b border-outline-variant px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-on-primary font-bold">
              DOL
            </div>
            <span className="text-headline-sm text-on-surface">Menu điều hướng</span>
          </div>
          <button
            onClick={closeSidebar}
            aria-label="Đóng menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-secondary hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <Sidebar className="w-full flex-1 border-r-0" onItemClick={closeSidebar} />
      </div>
    </div>
  )
}
