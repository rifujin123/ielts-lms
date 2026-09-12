import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { initialMistakeLogsMock } from '@/mocks/mistakeLog.mock'
import type { TrapType, TrapTypeMeta, LoggedMistake } from '@/types/mistakeLog.types'

export * from '@/types/mistakeLog.types'

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

export const INITIAL_MISTAKE_LOGS: LoggedMistake[] = initialMistakeLogsMock
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
      mistakes: initialMistakeLogsMock,
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

      resetToDefault: () =>
        set({ mistakes: initialMistakeLogsMock, errors: initialMistakeLogsMock }),

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
