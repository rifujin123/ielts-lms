import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Supported IELTS trap and mistake categories
 */
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

export const TRAP_TYPE_MAP: Record<TrapType, TrapTypeMeta> = {
  TRAP_NOT_GIVEN: {
    key: 'TRAP_NOT_GIVEN',
    label: 'Bẫy NOT GIVEN / FALSE',
    shortLabel: 'Not Given / False',
    description: 'Nhầm lẫn giữa NOT GIVEN và FALSE',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    barColor: 'bg-amber-500',
  },
  VOCAB_UNKNOWN: {
    key: 'VOCAB_UNKNOWN',
    label: 'Từ vựng & Paraphrase',
    shortLabel: 'Từ vựng / Paraphrase',
    description: 'Thiếu từ vựng chủ chốt / Paraphrase',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    barColor: 'bg-rose-500',
  },
  TIME_PRESSURE: {
    key: 'TIME_PRESSURE',
    label: 'Áp lực thời gian',
    shortLabel: 'Áp lực thời gian',
    description: 'Đọc ẩu do thiếu thời gian',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
    barColor: 'bg-orange-500',
  },
  AUDIO_DISTRACTION: {
    key: 'AUDIO_DISTRACTION',
    label: 'Mất dấu Audio',
    shortLabel: 'Mất dấu Audio',
    description: 'Lạc mất dấu audio trong bài nghe',
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200',
    barColor: 'bg-sky-500',
  },
  SPELLING_ERROR: {
    key: 'SPELLING_ERROR',
    label: 'Lỗi chính tả',
    shortLabel: 'Sai chính tả',
    description: 'Sai chính tả từ vựng',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    barColor: 'bg-purple-500',
  },
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

// Alias for backwards-compatibility
export type LoggedError = LoggedMistake

/** Realistic seed data of past student mistakes for instant academic rendering */
export const INITIAL_MISTAKE_LOGS: LoggedMistake[] = [
  {
    id: 'mistake-mock-1',
    questionId: 'Q14',
    testTitle: 'Cambridge 18 Academic Reading Test 1',
    skill: 'reading',
    trapType: 'TRAP_NOT_GIVEN',
    questionPrompt:
      'The research team anticipated the negative environmental consequences before launching the pilot plant.',
    correctAnswer: 'NOT GIVEN',
    studentAnswer: 'FALSE',
    loggedAt: '2026-09-10T09:30:00.000Z',
    notes:
      'Đoạn văn chỉ mô tả quá trình xây dựng trạm thử nghiệm, hoàn toàn không đề cập đến việc nhóm nghiên cứu có dự đoán trước tác động hay không.',
  },
  {
    id: 'mistake-mock-2',
    questionId: 'Q28',
    testTitle: 'Cambridge 18 Academic Reading Test 1',
    skill: 'reading',
    trapType: 'TRAP_NOT_GIVEN',
    questionPrompt:
      'Traditional farming techniques have completely ceased across northern provinces.',
    correctAnswer: 'NOT GIVEN',
    studentAnswer: 'FALSE',
    loggedAt: '2026-09-10T10:15:00.000Z',
    notes:
      'Tác giả chỉ nói phương pháp cơ giới hóa đang lan rộng, không hề khẳng định phương pháp truyền thống đã hoàn toàn biến mất.',
  },
  {
    id: 'mistake-mock-3',
    questionId: 'Q08',
    testTitle: 'Cambridge 17 Academic Reading Test 3',
    skill: 'reading',
    trapType: 'VOCAB_UNKNOWN',
    questionPrompt: 'The municipal council decided to ______ the historic canal expansion scheme.',
    correctAnswer: 'abandon',
    studentAnswer: 'prolong',
    loggedAt: '2026-09-09T14:20:00.000Z',
    notes:
      'Không nhận diện được cụm từ đồng nghĩa "relinquish / discard" trong bài đọc tương ứng với "abandon" trong câu hỏi.',
  },
  {
    id: 'mistake-mock-4',
    questionId: 'Q23',
    testTitle: 'Cambridge 18 Listening Practice Test 2',
    skill: 'listening',
    trapType: 'AUDIO_DISTRACTION',
    questionPrompt: 'What caused the unexpected delay during the geotechnical survey?',
    correctAnswer: 'Inclement weather conditions',
    studentAnswer: 'Instrument malfunction',
    loggedAt: '2026-09-08T16:45:00.000Z',
    notes:
      'Bị phân tâm bởi người nói nhắc đến sự cố thiết bị đo vào tuần trước, trước khi chốt lại lý do hoãn là do bão tuyết kéo dài.',
  },
  {
    id: 'mistake-mock-5',
    questionId: 'Q36',
    testTitle: 'Cambridge 16 Academic Reading Test 4',
    skill: 'reading',
    trapType: 'TIME_PRESSURE',
    questionPrompt: 'The principal factor that prompted the mass relocation was...',
    correctAnswer: 'Escalating resource scarcity',
    studentAnswer: 'Cultural assimilation',
    loggedAt: '2026-09-07T11:00:00.000Z',
    notes:
      'Còn 2 phút cuối giờ nên quét vội từ khóa "culture" ở đoạn C thay vì đọc kỹ câu kết luận nguyên nhân gốc rễ ở đoạn D.',
  },
  {
    id: 'mistake-mock-6',
    questionId: 'Q04',
    testTitle: 'Cambridge 17 Listening Test 1',
    skill: 'listening',
    trapType: 'SPELLING_ERROR',
    questionPrompt: 'Student rental requirements: type of ________',
    correctAnswer: 'accommodation',
    studentAnswer: 'accomodation',
    loggedAt: '2026-09-06T15:10:00.000Z',
    notes: 'Sai chính tả từ vựng phổ biến: accommodation có hai chữ c (cc) và hai chữ m (mm).',
  },
]

export const INITIAL_ERROR_LOGS = INITIAL_MISTAKE_LOGS

export interface MistakeLogState {
  mistakes: LoggedMistake[]
  logMistake: (
    mistake: Omit<LoggedMistake, 'id' | 'loggedAt'> & { id?: string; loggedAt?: string },
  ) => void
  removeMistake: (id: string) => void
  clearMistakes: () => void
  resetToDefault: () => void
  // Aliases for transition
  errors: LoggedMistake[]
  logError: (
    mistake: Omit<LoggedMistake, 'id' | 'loggedAt'> & { id?: string; loggedAt?: string },
  ) => void
  removeError: (id: string) => void
  clearErrors: () => void
}

export const useMistakeLogStore = create<MistakeLogState>()(
  persist(
    (set) => ({
      mistakes: INITIAL_MISTAKE_LOGS,
      get errors() {
        return this.mistakes
      },

      logMistake: (mistakeData) =>
        set((state) => {
          const newMistake: LoggedMistake = {
            id: mistakeData.id || `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            loggedAt: mistakeData.loggedAt || new Date().toISOString(),
            ...mistakeData,
          }
          const updated = [newMistake, ...state.mistakes]
          return {
            mistakes: updated,
            errors: updated,
          }
        }),

      removeMistake: (id) =>
        set((state) => {
          const updated = state.mistakes.filter((item) => item.id !== id)
          return {
            mistakes: updated,
            errors: updated,
          }
        }),

      clearMistakes: () => set({ mistakes: [], errors: [] }),

      resetToDefault: () => set({ mistakes: INITIAL_MISTAKE_LOGS, errors: INITIAL_MISTAKE_LOGS }),

      // Aliases
      logError: (err) =>
        set((state) => {
          const newMistake: LoggedMistake = {
            id: err.id || `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            loggedAt: err.loggedAt || new Date().toISOString(),
            ...err,
          }
          const updated = [newMistake, ...state.mistakes]
          return { mistakes: updated, errors: updated }
        }),

      removeError: (id) =>
        set((state) => {
          const updated = state.mistakes.filter((item) => item.id !== id)
          return { mistakes: updated, errors: updated }
        }),

      clearErrors: () => set({ mistakes: [], errors: [] }),
    }),
    {
      name: 'mistake_log_storage_v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

// Backwards compatibility alias
export const useErrorLogStore = useMistakeLogStore
