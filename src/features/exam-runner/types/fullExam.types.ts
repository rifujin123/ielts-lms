/**
 * Universal 4-Skill IELTS Computer-Based Testing (CBT) Schema
 * 100% Data-Driven: Allows Backend (BE) to publish any new exam JSON
 * and Frontend (FE) will dynamically render without code changes.
 */

export type IeltsSkillType = 'LISTENING' | 'READING' | 'WRITING' | 'SPEAKING'

export type IeltsQuestionType =
  | 'TRUE_FALSE_NOT_GIVEN'
  | 'YES_NO_NOT_GIVEN'
  | 'MULTIPLE_CHOICE'
  | 'MULTIPLE_RESPONSE'
  | 'FORM_COMPLETION'
  | 'NOTE_COMPLETION'
  | 'SUMMARY_COMPLETION'
  | 'SENTENCE_COMPLETION'
  | 'MATCHING_HEADINGS'
  | 'MATCHING_INFORMATION'
  | 'MATCHING_FEATURES'
  | 'MAP_DIAGRAM_LABELING'
  | 'TABLE_COMPLETION'

export interface IeltsQuestionOption {
  key: string // e.g. 'A', 'B', 'C', 'D'
  text: string
}

export interface IeltsQuestionItem {
  id: number // Global or Section Question index (1 to 40)
  type: IeltsQuestionType
  instruction?: string
  prompt: string
  options?: IeltsQuestionOption[]
  matchingPool?: { id: string; title: string }[]
  targetLabel?: string // e.g. "Paragraph A", "Location 14 on Map"
  correctAnswer: string | string[]
  explanation: string
  referenceLocation?: string
}

/* ── 1. LISTENING SKILL SCHEMA ─────────────────────────────────── */
export interface ListeningSection {
  sectionNumber: 1 | 2 | 3 | 4
  title: string
  scenario: string // e.g. "A telephone conversation regarding a conference booking"
  audioUrl?: string // Streaming audio URL from BE (CDN or S3)
  questionRange: [number, number] // e.g. [1, 10]
  questions: IeltsQuestionItem[]
}

export interface ListeningExamSkill {
  durationMinutes: number // 30 mins + 2 mins review
  totalQuestions: 40
  sections: ListeningSection[]
}

/* ── 2. READING SKILL SCHEMA ──────────────────────────────────── */
export interface ReadingPassage {
  id: 1 | 2 | 3
  title: string
  subtitle?: string
  contentParagraphs: {
    label?: string // 'A', 'B', 'C'...
    text: string
  }[]
  questionRange: [number, number] // e.g. [1, 13]
  questions: IeltsQuestionItem[]
}

export interface ReadingExamSkill {
  durationMinutes: number // 60 mins
  totalQuestions: 40
  passages: ReadingPassage[]
}

/* ── 3. WRITING SKILL SCHEMA ──────────────────────────────────── */
export interface WritingChartDataPoint {
  category: string // e.g. "Germany", "Denmark"
  startYearValue?: number // e.g. 17 (%)
  endYearValue?: number // e.g. 42 (%)
  startYearLabel?: string // e.g. "2010"
  endYearLabel?: string // e.g. "2020"
  percentage?: number
  colorClass?: string // e.g. "bg-blue-500"
}

export interface WritingTask {
  taskNumber: 1 | 2
  title: string
  prompt: string
  minWords: number // 150 for Task 1, 250 for Task 2
  recommendedMinutes: number // 20 mins for Task 1, 40 mins for Task 2
  visualType?: 'BAR_CHART' | 'LINE_GRAPH' | 'PIE_CHART' | 'TABLE' | 'MAP' | 'PROCESS'
  chartImageUrl?: string // URL of visual prompt
  chartSvgContent?: string // Inline SVG visual
  chartDataPoints?: WritingChartDataPoint[]
  sampleModelAnswer?: string // For review mode
}

export interface WritingExamSkill {
  durationMinutes: number // 60 mins total
  tasks: WritingTask[]
}

/* ── 4. SPEAKING SKILL SCHEMA ─────────────────────────────────── */
export interface SpeakingPart1 {
  partNumber: 1
  topic: string // e.g. "Hometown and Daily Habits"
  description: string
  questions: { id: number; text: string }[]
}

export interface SpeakingPart2 {
  partNumber: 2
  topicTitle: string // e.g. "Describe a memorable journey..."
  cueCardPoints: string[] // Bullets: Where you went, Who with, Why memorable...
  prepTimeSeconds: number // 60 seconds
  speakTimeSeconds: number // 120 seconds
}

export interface SpeakingPart3 {
  partNumber: 3
  discussionTopic: string // e.g. "Transportation systems and urbanization"
  questions: { id: number; text: string; guidance?: string }[]
}

export interface SpeakingExamSkill {
  durationMinutes: number // 11 to 14 mins
  part1: SpeakingPart1
  part2: SpeakingPart2
  part3: SpeakingPart3
}

/* ── FULL 4-SKILL EXAM MANIFEST (API CONTRACT) ────────────────── */
export interface FullIeltsExamManifest {
  id: string
  title: string
  code: string // e.g. "CAM-18-ACAD-FULL-01"
  type: 'ACADEMIC' | 'GENERAL_TRAINING'
  mode?: ExamMode // 'STRICT' (Do Giáo viên / Hệ thống cấu hình) | 'PRACTICE' (Tự luyện tập)
  description?: string
  skills: {
    listening?: ListeningExamSkill
    reading?: ReadingExamSkill
    writing?: WritingExamSkill
    speaking?: SpeakingExamSkill
  }
}

/* ── STUDENT EXAM RESPONSES & SUBMISSION ──────────────────────── */
export interface FullExamStudentResponses {
  examId: string
  selectedSkill: IeltsSkillType
  listeningAnswers: Record<number, string>
  readingAnswers: Record<number, string>
  writingSubmissions: {
    task1: string
    task2: string
  }
  speakingAudioUrls: Record<number, string> // Question/Part index to local blob/uploaded audio URL
  flaggedQuestions: Record<string, boolean> // e.g. "LISTENING_14": true
  timeRemainingSeconds: Record<IeltsSkillType, number>
  isSkillCompleted: Record<IeltsSkillType, boolean>
  isFullExamSubmitted: boolean
}

export type ExamMode = 'STRICT' | 'PRACTICE'

export interface TeacherRubricAssessment {
  teacherId: string
  teacherName: string
  teacherAvatarUrl?: string
  gradedAt: string
  overallBand: number
  status: 'SUBMITTED_PENDING_REVIEW' | 'GRADING_IN_PROGRESS' | 'GRADED_PUBLISHED'
  slaHoursRemaining?: number
  writingTask1: {
    taskAchievement: number // 1.0 - 9.0
    coherenceCohesion: number
    lexicalResource: number
    grammaticalRangeAccuracy: number
    overallTask1: number
    feedbackComments: string
  }
  writingTask2: {
    taskResponse: number
    coherenceCohesion: number
    lexicalResource: number
    grammaticalRangeAccuracy: number
    overallTask2: number
    feedbackComments: string
  }
  speaking: {
    fluencyCoherence: number
    lexicalResource: number
    grammaticalRangeAccuracy: number
    pronunciation: number
    overallSpeaking: number
    audioFeedbackUrl?: string
    examinerNotes: string
  }
}
