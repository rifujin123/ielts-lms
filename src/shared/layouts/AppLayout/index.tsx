import React, { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/shared/components/Header'
import { Sidebar } from '@/shared/components/Sidebar'
import { MobileSidebar } from '@/shared/components/MobileSidebar'
import { PageLoader } from '@/shared/components/PageLoader'
import { FeatureErrorBoundary } from '@/shared/components/ErrorBoundary'
import { ToastContainer } from '@/shared/components/Toast'

export const AppLayout: React.FC = () => {
  const location = useLocation()
  const isDistractionFree =
    location.pathname.startsWith('/exam') || location.pathname.startsWith('/materials/reader')

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

      {/* Mobile Drawer */}
      <MobileSidebar />

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1">
        {/* Desktop Sidebar (fixed height under header) */}
        <Sidebar className="hidden sticky top-16 h-[calc(100vh-64px)] md:flex" />

        {/* Content Outlet with per-feature ErrorBoundary and Suspense */}
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 md:px-8">
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
