import { describe, it, expect, beforeEach } from 'vitest'
import { useCourseStore, DEFAULT_COURSE_ID } from '@/store/courseStore'
import { courseService } from '@/services/courseService'

describe('Multi-Course Portal Architecture', () => {
  beforeEach(() => {
    useCourseStore.getState().resetToDefaultCourse()
  })

  it('should initialize with default active course IELTS-6.5-2026', () => {
    const state = useCourseStore.getState()
    expect(state.activeCourseId).toBe(DEFAULT_COURSE_ID)
  })

  it('should update active course when setActiveCourseId is called', () => {
    useCourseStore.getState().setActiveCourseId('TOAN-12-THPT-2026')
    expect(useCourseStore.getState().activeCourseId).toBe('TOAN-12-THPT-2026')

    useCourseStore.getState().setActiveCourseId('DGNL-DHQG-2026')
    expect(useCourseStore.getState().activeCourseId).toBe('DGNL-DHQG-2026')
  })

  it('should fetch enrolled courses strictly scoped to IELTS, Toán, and ĐGNL', async () => {
    const courses = await courseService.getActiveCourses()
    expect(courses.length).toBeGreaterThanOrEqual(3)

    const subjects = courses.map((c) => c.type)
    expect(subjects).toContain('IELTS')
    expect(subjects).toContain('TOAN')
    expect(subjects).toContain('DGNL')

    // Must never contain unauthorized categories
    expect(subjects).not.toContain('SAT')
    expect(subjects).not.toContain('COMMUNICATION')
  })

  it('should retrieve individual course detail by courseId with fallback', async () => {
    const toanCourse = await courseService.getCourseById('TOAN-12-THPT-2026')
    expect(toanCourse).toBeDefined()
    expect(toanCourse?.instructor).toBe('Thầy Trần Quốc Anh')

    // Returns undefined on unknown ID so UI can show 404
    const notFound = await courseService.getCourseById('UNKNOWN-ID')
    expect(notFound).toBeUndefined()
  })

  it('should fetch student global progress metrics with upcoming sessions and deadlines', async () => {
    const progress = await courseService.getStudentGlobalProgress()
    expect(progress.totalEnrolledCourses).toBe(3)
    expect(progress.upcomingSessions.length).toBeGreaterThanOrEqual(3)
    expect(progress.urgentDeadlines.length).toBeGreaterThanOrEqual(1)
  })
})
