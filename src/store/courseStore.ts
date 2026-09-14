import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CourseState {
  activeCourseId: string
  setActiveCourseId: (id: string) => void
  resetToDefaultCourse: () => void
}

export const DEFAULT_COURSE_ID = 'IELTS-6.5-2026'

/**
 * courseStore — Global store for managing active enrolled course context.
 * Persisted in localStorage so page refreshes and direct URL navigation
 * maintain consistent course selection.
 */
export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      activeCourseId: DEFAULT_COURSE_ID,
      setActiveCourseId: (id: string) => set({ activeCourseId: id }),
      resetToDefaultCourse: () => set({ activeCourseId: DEFAULT_COURSE_ID }),
    }),
    {
      name: 'ielts_lms_active_course_v1',
    },
  ),
)
