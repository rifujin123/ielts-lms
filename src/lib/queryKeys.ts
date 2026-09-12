/**
 * Query Key Factory for TanStack Query v5.
 * Enforces type-safe, centralized key management across all features.
 * Adheres to the authoritative pattern recommended by TanStack Query maintainers.
 */
export const queryKeys = {
  courses: {
    all: ['courses'] as const,
    active: () => [...queryKeys.courses.all, 'active'] as const,
    detail: (courseId?: string) =>
      [...queryKeys.courses.all, 'detail', courseId ?? 'default'] as const,
  },
  vocabulary: {
    all: ['vocabulary'] as const,
    sets: (search?: string) =>
      search !== undefined
        ? ([...queryKeys.vocabulary.all, 'sets', search] as const)
        : ([...queryKeys.vocabulary.all, 'sets'] as const),
    detail: (setId?: string) =>
      [...queryKeys.vocabulary.all, 'detail', setId ?? 'default'] as const,
  },
  personalVocab: {
    all: ['personal-vocab'] as const,
    list: () => [...queryKeys.personalVocab.all, 'list'] as const,
  },
  homework: {
    all: ['homework'] as const,
    list: () => [...queryKeys.homework.all, 'list'] as const,
    finalTest: () => [...queryKeys.homework.all, 'final-test'] as const,
  },
  attendance: {
    all: ['attendance'] as const,
    records: () => [...queryKeys.attendance.all, 'records'] as const,
    sessions: () => [...queryKeys.attendance.all, 'sessions'] as const,
    summary: () => [...queryKeys.attendance.all, 'summary'] as const,
  },
  exercises: {
    all: ['exercises'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.exercises.all, 'list', filters ?? {}] as const,
  },
  roadmap: {
    all: ['roadmap'] as const,
    phases: () => [...queryKeys.roadmap.all, 'phases'] as const,
    items: () => [...queryKeys.roadmap.all, 'items'] as const,
  },
  tests: {
    all: ['tests'] as const,
    list: () => [...queryKeys.tests.all, 'list'] as const,
  },
  materials: {
    all: ['materials'] as const,
    books: () => [...queryKeys.materials.all, 'books'] as const,
  },
  studentProfile: {
    all: ['student-profile'] as const,
    current: () => [...queryKeys.studentProfile.all, 'current'] as const,
  },
} as const

export type QueryKeys = typeof queryKeys
