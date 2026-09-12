/**
 * IELTS CBT Computer-Based Testing — Type Definitions
 * Represents full Cambridge IELTS Academic & General Reading exam sessions.
 */

export type IeltsQuestionType =
  | 'TRUE_FALSE_NOT_GIVEN'
  | 'YES_NO_NOT_GIVEN'
  | 'MULTIPLE_CHOICE'
  | 'MULTIPLE_RESPONSE'
  | 'SUMMARY_COMPLETION'
  | 'SENTENCE_COMPLETION'
  | 'MATCHING_HEADINGS'
  | 'MATCHING_FEATURES'

export interface IeltsQuestionOption {
  key: string // 'A', 'B', 'C', 'D'
  text: string
}

export interface IeltsQuestion {
  id: number // 1 to 40
  passageId: 1 | 2 | 3
  type: IeltsQuestionType
  instruction?: string // e.g. "Do the following statements agree with the information given in Reading Passage 1?"
  prompt: string // The question text or statement
  options?: IeltsQuestionOption[] // For Multiple Choice
  matchingHeadingsPool?: { id: string; title: string }[] // For Matching Headings (i, ii, iii...)
  paragraphTarget?: string // For Matching Headings (e.g. 'Paragraph A')
  correctAnswer: string | string[] // Target answer(s) for auto-grading
  explanation: string // Explanatory text for review mode
  referenceLocation?: string // e.g. "Paragraph 2, lines 4-7"
}

export interface IeltsPassage {
  id: 1 | 2 | 3
  title: string
  subtitle?: string
  contentParagraphs: {
    label?: string // 'A', 'B', 'C', etc.
    text: string
  }[]
  questionRange: [number, number] // e.g. [1, 13]
}

export interface IeltsExamManifest {
  id: string
  title: string
  code: string // e.g. "CAM-18-ACAD-TEST-01"
  durationMinutes: number // 60
  totalQuestions: number // 40
  passages: IeltsPassage[]
  questions: IeltsQuestion[]
}

export interface TextHighlight {
  id: string
  passageId: 1 | 2 | 3
  text: string
  color: 'yellow' | 'emerald' | 'amber' | 'slate'
  createdAt: number
}

export interface UserExamResponse {
  questionId: number
  value: string
  isFlagged: boolean
  lastUpdated: number
}

export interface ExamSessionState {
  examId: string
  activePassageId: 1 | 2 | 3
  activeQuestionId: number
  answers: Record<number, string>
  flaggedQuestions: Record<number, boolean>
  highlights: TextHighlight[]
  timeRemainingSeconds: number
  isTimerRunning: boolean
  isTimerVisible: boolean
  fontSizeScale: 'sm' | 'base' | 'lg'
  isSubmitted: boolean
  submittedAt?: string
  scoreResult?: ExamScoreResult
}

export interface ExamScoreResult {
  correctCount: number
  totalQuestions: number
  bandScore: number
  passageScores: {
    passageId: 1 | 2 | 3
    correct: number
    total: number
  }[]
  questionDetails: {
    questionId: number
    userAnswer: string
    correctAnswer: string | string[]
    isCorrect: boolean
    explanation: string
  }[]
}
