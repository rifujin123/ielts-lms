import React, { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  Header,
  Sidebar,
  MobileSidebar,
  PageLoader,
  FeatureErrorBoundary,
  ToastContainer,
} from '@/shared/components'

export const AppLayout: React.FC = () => {
  const location = useLocation()
  const isDistractionFree =
    location.pathname.startsWith('/exam') || location.pathname.startsWith('/materials/reader')
  const isNoSidebarRoute = location.pathname.startsWith('/profile')

  if (isDistractionFree) {
    return (
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 font-body text-slate-900">
        <FeatureErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </FeatureErrorBoundary>
        {/* Global Toast Container for Animated Notifications */}
        <ToastContainer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-body text-on-surface">
      {/* Sticky Top Header */}
      <Header />

      {/* Mobile Drawer (Hidden on profile page) */}
      {!isNoSidebarRoute && <MobileSidebar />}

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1 min-w-0">
        {/* Desktop Sidebar (Hidden on profile page) */}
        {!isNoSidebarRoute && (
          <Sidebar className="hidden sticky top-16 h-[calc(100vh-64px)] md:flex" />
        )}

        {/* Content Outlet with per-feature ErrorBoundary and Suspense */}
        <main
          className={
            isNoSidebarRoute
              ? 'flex-1 overflow-x-hidden px-4 py-6 sm:px-6 md:px-8 max-w-6xl mx-auto w-full'
              : 'flex-1 overflow-x-hidden px-4 py-6 sm:px-6 md:px-8'
          }
        >
          <FeatureErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </FeatureErrorBoundary>
        </main>
      </div>

      {/* Global Toast Container for Animated Notifications */}
      <ToastContainer />
    </div>
  )
}
