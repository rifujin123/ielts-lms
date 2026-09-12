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

export interface LoggedError {
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

/** Realistic seed data of past student mistakes for instant academic rendering */
export const INITIAL_ERROR_LOGS: LoggedError[] = [
  {
    id: 'err-mock-1',
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
    id: 'err-mock-2',
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
    id: 'err-mock-3',
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
    id: 'err-mock-4',
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
    id: 'err-mock-5',
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
    id: 'err-mock-6',
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

export interface ErrorLogState {
  errors: LoggedError[]
  logError: (
    error: Omit<LoggedError, 'id' | 'loggedAt'> & { id?: string; loggedAt?: string },
  ) => void
  removeError: (id: string) => void
  clearErrors: () => void
  resetToDefault: () => void
}

export const useErrorLogStore = create<ErrorLogState>()(
  persist(
    (set) => ({
      errors: INITIAL_ERROR_LOGS,

      logError: (errorData) =>
        set((state) => {
          const newError: LoggedError = {
            id: errorData.id || `err-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            loggedAt: errorData.loggedAt || new Date().toISOString(),
            ...errorData,
          }
          // Prepend newest error
          return {
            errors: [newError, ...state.errors],
          }
        }),

      removeError: (id) =>
        set((state) => ({
          errors: state.errors.filter((item) => item.id !== id),
        })),

      clearErrors: () => set({ errors: [] }),

      resetToDefault: () => set({ errors: INITIAL_ERROR_LOGS }),
    }),
    {
      name: 'error_log_storage_v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
