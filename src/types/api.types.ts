/**
 * api.types.ts — Shared API types and interfaces.
 * All types here correspond 1:1 to backend API response shapes.
 * When the backend team finalises their schema, update these types.
 */

// ── Student ──────────────────────────────────────────────────────

export interface Student {
  id: string // e.g. 'DOL-8829'
  name: string
  initials: string
  role: string
  isOnline: boolean
  avatarUrl?: string
}

// ── Course Phase ─────────────────────────────────────────────────

export interface CoursePhase {
  number: number
  name: string
  isActive: boolean
  isCompleted: boolean
}

// ── Instructor ───────────────────────────────────────────────────

export interface Instructor {
  id: string
  name: string
  title: string
  avatarUrl?: string
  skills: string[]
  ieltsScore: string
  certification: string
  isOnline: boolean
}

// ── Schedule ─────────────────────────────────────────────────────

export type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'

export interface ScheduleDay {
  dayKey: DayKey
  dayName: string // e.g. 'Thứ 2'
  isClassDay: boolean
  time?: string // e.g. '20:00 - 22:00'
  room?: string // e.g. 'Phòng Zoom 802'
}

// ── Class Rules & Objectives ─────────────────────────────────────

export interface ClassRule {
  order: number
  title: string
  description: string
}

export interface CourseObjective {
  text: string
}

// ── Course Info (screen 16) ───────────────────────────────────────

export interface CourseInfo {
  id: string
  name: string
  level: string
  status: 'active' | 'upcoming' | 'completed'
  phase: CoursePhase
  startDate: string
  endDate: string
  schedule: ScheduleDay[]
  classTime: string
  zoomLink: string
  zoomRoom: string
  zaloGroupName: string
  zaloGroupLink: string
  totalExercises: number
  totalAssignments: number
  semester: string
  instructors: Instructor[]
  objectiveDescription: string
  objectiveHighlights: CourseObjective[]
  classRules: ClassRule[]
  studentStatus: 'active' | 'suspended' | 'graduated'
}

// ── Course Card (dashboard, screen 02) ───────────────────────────

export interface CourseCard {
  id: string
  name: string
  level: string
  type: 'IELTS' | 'SAT'
  band: string
  status: 'active' | 'upcoming' | 'completed'
  schedule: DayKey[]
  classTime: string
  zoomLink: string
  instructor: string
  totalSessions: number
  completedSessions: number
  currentSession: number
  nextSessionDate: string
  description: string
}

// ── Exercise ──────────────────────────────────────────────────────

export type ExerciseSkill = 'Reading' | 'Writing' | 'Listening' | 'Speaking'
export type ExerciseStatus = 'pending' | 'completed' | 'in_progress'

export interface Exercise {
  id: string
  title: string
  skill: ExerciseSkill
  status: ExerciseStatus
  dueDate?: string
  completedAt?: string
  score?: number
  questionCount: number
}

export interface ExerciseFilters {
  status: 'all' | ExerciseStatus
  skill: 'all' | ExerciseSkill
  sortBy: 'newest' | 'oldest'
  search: string
}

// ── Vocabulary ────────────────────────────────────────────────────

export interface VocabularySet {
  id: string
  title: string
  wordCount: number
  masteredCount: number
  status: 'not_started' | 'in_progress' | 'completed'
  lastStudied?: string
  tags: string[]
}

// ── Online Test ───────────────────────────────────────────────────

export type TestType = 'mock' | 'mini' | 'full'
export type TestSkill = 'Reading' | 'Writing' | 'Listening' | 'Speaking' | 'Full'
export type TestStatus = 'pending' | 'completed' | 'in_progress'

export interface OnlineTest {
  id: string
  title: string
  type: TestType
  skill: TestSkill
  status: TestStatus
  duration: number // minutes
  score?: number
  completedAt?: string
}

export interface TestFilters {
  type: 'all' | TestType
  skill: 'all' | TestSkill
  status: 'all' | TestStatus
}

// ── Session / Attendance ──────────────────────────────────────────

export type SessionStatus = 'attended' | 'absent' | 'upcoming' | 'cancelled'

export interface Session {
  id: string
  number: number
  date: string
  time: string
  status: SessionStatus
  topic?: string
  summary?: string
  materialsUrl?: string
  isStandard: boolean
}

// ── Homework ──────────────────────────────────────────────────────

export type HomeworkStatus = 'pending' | 'submitted' | 'graded'

export interface HomeworkItem {
  id: string
  title: string
  practiceCount: number
  status: HomeworkStatus
  dueDate?: string
  score?: number
}

// ── Roadmap ───────────────────────────────────────────────────────

export type RoadmapStatus = 'not_started' | 'in_progress' | 'completed'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export interface RoadmapItem {
  id: string
  title: string
  description: string
  type: string
  difficulty: Difficulty
  estimatedMinutes: number
  status: RoadmapStatus
  createdAt: string
}

// ── Books / Materials ─────────────────────────────────────────────

export type BookUnitStatus = 'completed' | 'in_progress' | 'upcoming'

export interface BookLesson {
  id: string
  title: string
  type: 'video' | 'reading' | 'exercise' | 'quiz'
  durationMinutes: number
  isCompleted: boolean
}

export interface BookUnit {
  id: string
  number: number
  title: string
  status: BookUnitStatus
  isBookmarked: boolean
  lessons: BookLesson[]
}

export interface CourseBook {
  id: string
  title: string
  subtitle?: string
  type: 'main' | 'supplementary' | 'vocabulary'
  coverColor: string
  coverImage?: string
  units: BookUnit[]
}

// ── Final Test ────────────────────────────────────────────────────

export type FinalTestStatus = 'not_taken' | 'in_progress' | 'submitted' | 'graded'

export interface FinalTest {
  id: string
  title: string
  status: FinalTestStatus
  targetBand: string
  scheduledDate?: string
  submittedAt?: string
  score?: number
  feedback?: string
}

// ── Pagination ────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// ── API Error ─────────────────────────────────────────────────────

export interface ApiError {
  message: string
  code: string
  status: number
}
