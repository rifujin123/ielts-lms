import { create } from 'zustand'

/** Current authenticated student */
export interface CurrentUser {
  id: string
  name: string
  initials: string
  role: string
  isOnline: boolean
}

/** Active course phase selector state */
export interface ActivePhase {
  number: number
  label: string
}

interface UIState {
  // Sidebar
  isSidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void

  // Active course phase
  activePhase: ActivePhase
  setActivePhase: (phase: ActivePhase) => void

  // Current user (stub — replace with auth store when ready)
  currentUser: CurrentUser
  setCurrentUser: (user: CurrentUser) => void

  // Active course ID
  activeCourseId: string
  setActiveCourseId: (id: string) => void
}

/**
 * uiStore — Zustand store for UI-only state.
 * Server data (courses, exercises) lives in TanStack Query.
 */
export const useUIStore = create<UIState>((set) => ({
  // ── Sidebar ───────────────────────────────────────────────────
  isSidebarOpen: false,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

  // ── Phase selector ────────────────────────────────────────────
  activePhase: { number: 2, label: 'Giai đoạn 2' },
  setActivePhase: (phase) => set({ activePhase: phase }),

  // ── Current user (mock default — wire to auth on login) ───────
  currentUser: {
    id: 'DOL-8829',
    name: 'Trần Thảo',
    initials: 'TT',
    role: 'Học viên chính khóa',
    isOnline: true,
  },
  setCurrentUser: (user) => set({ currentUser: user }),

  // ── Active course ─────────────────────────────────────────────
  activeCourseId: 'IELTS-6.5-2026',
  setActiveCourseId: (id) => set({ activeCourseId: id }),
}))
