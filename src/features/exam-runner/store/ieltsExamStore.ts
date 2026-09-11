import { create } from 'zustand'
import { cambridgeAcademicMock18 } from '../data'
import type { IeltsExamManifest, TextHighlight, ExamScoreResult } from '../types/ielts.types'

interface IeltsExamStoreState {
  manifest: IeltsExamManifest
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
  scoreResult: ExamScoreResult | null

  // Actions
  setActivePassage: (passageId: 1 | 2 | 3) => void
  setActiveQuestion: (questionId: number) => void
  setAnswer: (questionId: number, value: string) => void
  toggleFlag: (questionId: number) => void
  addHighlight: (highlight: Omit<TextHighlight, 'id' | 'createdAt'>) => void
  removeHighlight: (id: string) => void
  clearAllHighlights: () => void
  tickTimer: () => void
  toggleTimerVisibility: () => void
  setFontSizeScale: (scale: 'sm' | 'base' | 'lg') => void
  submitExam: () => void
  resetExam: () => void
}

const STORAGE_KEY_PREFIX = 'ielts_cbt_session_'

function loadPersistedData(examId: string) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${examId}`)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('Unable to read persisted CBT session:', err)
  }
  return null
}

function savePersistedData(examId: string, data: Record<string, unknown>) {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${examId}`, JSON.stringify(data))
  } catch (err) {
    console.warn('Unable to persist CBT session:', err)
  }
}

/**
 * Maps raw score (0-40) to standard IELTS Academic Reading Band Score.
 */
export function calculateAcademicReadingBand(rawScore: number): number {
  if (rawScore >= 39) return 9.0
  if (rawScore >= 37) return 8.5
  if (rawScore >= 35) return 8.0
  if (rawScore >= 33) return 7.5
  if (rawScore >= 30) return 7.0
  if (rawScore >= 27) return 6.5
  if (rawScore >= 23) return 6.0
  if (rawScore >= 19) return 5.5
  if (rawScore >= 15) return 5.0
  if (rawScore >= 13) return 4.5
  if (rawScore >= 10) return 4.0
  if (rawScore >= 8) return 3.5
  if (rawScore >= 6) return 3.0
  if (rawScore >= 4) return 2.5
  return 2.0
}

const defaultExam = cambridgeAcademicMock18
const saved = loadPersistedData(defaultExam.id)

export const useIeltsExamStore = create<IeltsExamStoreState>((set, get) => ({
  manifest: defaultExam,
  activePassageId: saved?.activePassageId ?? 1,
  activeQuestionId: saved?.activeQuestionId ?? 1,
  answers: saved?.answers ?? {},
  flaggedQuestions: saved?.flaggedQuestions ?? {},
  highlights: saved?.highlights ?? [],
  timeRemainingSeconds: saved?.timeRemainingSeconds ?? defaultExam.durationMinutes * 60,
  isTimerRunning: !(saved?.isSubmitted ?? false),
  isTimerVisible: true,
  fontSizeScale: 'base',
  isSubmitted: saved?.isSubmitted ?? false,
  scoreResult: saved?.scoreResult ?? null,

  setActivePassage: (passageId) => {
    set({ activePassageId: passageId })
    const state = get()
    savePersistedData(state.manifest.id, {
      answers: state.answers,
      flaggedQuestions: state.flaggedQuestions,
      highlights: state.highlights,
      timeRemainingSeconds: state.timeRemainingSeconds,
      activePassageId: passageId,
      activeQuestionId: state.activeQuestionId,
      isSubmitted: state.isSubmitted,
      scoreResult: state.scoreResult,
    })
  },

  setActiveQuestion: (questionId) => {
    const { manifest } = get()
    // Auto sync passage if question belongs to another passage
    const targetQ = manifest.questions.find((q) => q.id === questionId)
    const newPassageId = targetQ ? targetQ.passageId : get().activePassageId

    set({ activeQuestionId: questionId, activePassageId: newPassageId })
    const state = get()
    savePersistedData(state.manifest.id, {
      answers: state.answers,
      flaggedQuestions: state.flaggedQuestions,
      highlights: state.highlights,
      timeRemainingSeconds: state.timeRemainingSeconds,
      activePassageId: newPassageId,
      activeQuestionId: questionId,
      isSubmitted: state.isSubmitted,
      scoreResult: state.scoreResult,
    })
  },

  setAnswer: (questionId, value) => {
    set((state) => {
      const newAnswers = { ...state.answers, [questionId]: value }
      savePersistedData(state.manifest.id, {
        answers: newAnswers,
        flaggedQuestions: state.flaggedQuestions,
        highlights: state.highlights,
        timeRemainingSeconds: state.timeRemainingSeconds,
        activePassageId: state.activePassageId,
        activeQuestionId: state.activeQuestionId,
        isSubmitted: state.isSubmitted,
        scoreResult: state.scoreResult,
      })
      return { answers: newAnswers }
    })
  },

  toggleFlag: (questionId) => {
    set((state) => {
      const isCurrentlyFlagged = !!state.flaggedQuestions[questionId]
      const newFlags = { ...state.flaggedQuestions, [questionId]: !isCurrentlyFlagged }
      savePersistedData(state.manifest.id, {
        answers: state.answers,
        flaggedQuestions: newFlags,
        highlights: state.highlights,
        timeRemainingSeconds: state.timeRemainingSeconds,
        activePassageId: state.activePassageId,
        activeQuestionId: state.activeQuestionId,
        isSubmitted: state.isSubmitted,
        scoreResult: state.scoreResult,
      })
      return { flaggedQuestions: newFlags }
    })
  },

  addHighlight: (hl) => {
    const newHl: TextHighlight = {
      ...hl,
      id: 'hl_' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    }
    set((state) => {
      const newHighlights = [...state.highlights, newHl]
      savePersistedData(state.manifest.id, {
        answers: state.answers,
        flaggedQuestions: state.flaggedQuestions,
        highlights: newHighlights,
        timeRemainingSeconds: state.timeRemainingSeconds,
        activePassageId: state.activePassageId,
        activeQuestionId: state.activeQuestionId,
        isSubmitted: state.isSubmitted,
        scoreResult: state.scoreResult,
      })
      return { highlights: newHighlights }
    })
  },

  removeHighlight: (id) => {
    set((state) => {
      const newHighlights = state.highlights.filter((h) => h.id !== id)
      savePersistedData(state.manifest.id, {
        answers: state.answers,
        flaggedQuestions: state.flaggedQuestions,
        highlights: newHighlights,
        timeRemainingSeconds: state.timeRemainingSeconds,
        activePassageId: state.activePassageId,
        activeQuestionId: state.activeQuestionId,
        isSubmitted: state.isSubmitted,
        scoreResult: state.scoreResult,
      })
      return { highlights: newHighlights }
    })
  },

  clearAllHighlights: () => {
    set((state) => {
      savePersistedData(state.manifest.id, {
        answers: state.answers,
        flaggedQuestions: state.flaggedQuestions,
        highlights: [],
        timeRemainingSeconds: state.timeRemainingSeconds,
        activePassageId: state.activePassageId,
        activeQuestionId: state.activeQuestionId,
        isSubmitted: state.isSubmitted,
        scoreResult: state.scoreResult,
      })
      return { highlights: [] }
    })
  },

  tickTimer: () => {
    set((state) => {
      if (!state.isTimerRunning || state.timeRemainingSeconds <= 0) {
        return state
      }
      const newTime = state.timeRemainingSeconds - 1
      if (newTime <= 0) {
        // Auto-submit when time expires
        setTimeout(() => get().submitExam(), 0)
        return { timeRemainingSeconds: 0, isTimerRunning: false }
      }
      return { timeRemainingSeconds: newTime }
    })
  },

  toggleTimerVisibility: () => {
    set((state) => ({ isTimerVisible: !state.isTimerVisible }))
  },

  setFontSizeScale: (scale) => {
    set({ fontSizeScale: scale })
  },

  submitExam: () => {
    const { manifest, answers } = get()
    let correctCount = 0

    const passageCorrectMap: Record<1 | 2 | 3, { correct: number; total: number }> = {
      1: { correct: 0, total: 0 },
      2: { correct: 0, total: 0 },
      3: { correct: 0, total: 0 },
    }

    const questionDetails = manifest.questions.map((q) => {
      const userRaw = (answers[q.id] || '').trim().toLowerCase()
      const isCorrect = Array.isArray(q.correctAnswer)
        ? q.correctAnswer.some((ans) => ans.trim().toLowerCase() === userRaw)
        : q.correctAnswer.trim().toLowerCase() === userRaw

      if (isCorrect) {
        correctCount++
        passageCorrectMap[q.passageId].correct++
      }
      passageCorrectMap[q.passageId].total++

      return {
        questionId: q.id,
        userAnswer: answers[q.id] || '(Chưa làm)',
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      }
    })

    const bandScore = calculateAcademicReadingBand(correctCount)

    const scoreResult: ExamScoreResult = {
      correctCount,
      totalQuestions: manifest.totalQuestions,
      bandScore,
      passageScores: [
        { passageId: 1, ...passageCorrectMap[1] },
        { passageId: 2, ...passageCorrectMap[2] },
        { passageId: 3, ...passageCorrectMap[3] },
      ],
      questionDetails,
    }

    set({
      isSubmitted: true,
      isTimerRunning: false,
      scoreResult,
    })

    const state = get()
    savePersistedData(state.manifest.id, {
      answers: state.answers,
      flaggedQuestions: state.flaggedQuestions,
      highlights: state.highlights,
      timeRemainingSeconds: state.timeRemainingSeconds,
      activePassageId: state.activePassageId,
      activeQuestionId: state.activeQuestionId,
      isSubmitted: true,
      scoreResult,
    })
  },

  resetExam: () => {
    const { manifest } = get()
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${manifest.id}`)
    } catch {
      // Ignore
    }
    set({
      activePassageId: 1,
      activeQuestionId: 1,
      answers: {},
      flaggedQuestions: {},
      highlights: [],
      timeRemainingSeconds: manifest.durationMinutes * 60,
      isTimerRunning: true,
      isSubmitted: false,
      scoreResult: null,
    })
  },
}))
