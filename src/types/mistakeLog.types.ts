export type TrapType =
  'TRAP_NOT_GIVEN' | 'VOCAB_UNKNOWN' | 'TIME_PRESSURE' | 'AUDIO_DISTRACTION' | 'SPELLING_ERROR'

export interface TrapTypeMeta {
  key: TrapType
  label: string
  shortLabel: string
  description: string
  badgeClass: string
  barColor: string
}

export interface LoggedMistake {
  id: string
  questionId: string
  testTitle: string
  skill: 'reading' | 'listening' | 'writing' | 'speaking' | string
  trapType: TrapType
  questionPrompt: string
  correctAnswer: string
  studentAnswer: string
  loggedAt: string
  notes?: string
}

export type LoggedError = LoggedMistake
