import { create } from 'zustand'
import type { FullIeltsExamManifest, IeltsSkillType, ExamMode } from '../types/fullExam.types'
import { cambridgeFull4SkillMock } from '../data'

interface FullExamStoreState {
  manifest: FullIeltsExamManifest
  activeSkill: IeltsSkillType
  activeSectionIndex: number // 0 to 3 for Listening sections or 0 to 2 for Reading passages
  examMode: ExamMode // 'STRICT' (Chế độ thi thật) | 'PRACTICE' (Chế độ luyện tập)
  tabSwitchCount: number

  // Skill responses
  listeningAnswers: Record<number, string>
  readingAnswers: Record<number, string>
  writingSubmissions: { task1: string; task2: string }
  speakingRecordings: Record<number, { blobUrl: string; duration: number }>

  flaggedQuestions: Record<string, boolean>
  timeRemaining: Record<IeltsSkillType, number>
  isTimerRunning: boolean
  isSubmitted: boolean
  isRubricModalOpen: boolean

  // Actions
  setManifest: (manifest: FullIeltsExamManifest) => void
  setActiveSkill: (skill: IeltsSkillType) => void
  setActiveSectionIndex: (index: number) => void
  setExamMode: (mode: ExamMode) => void
  incrementTabSwitchCount: () => void
  setIsRubricModalOpen: (open: boolean) => void
  setListeningAnswer: (qId: number, val: string) => void
  setReadingAnswer: (qId: number, val: string) => void
  setWritingTaskAnswer: (task: 'task1' | 'task2', content: string) => void
  setSpeakingRecording: (partId: number, blobUrl: string, duration: number) => void
  toggleFlag: (skill: IeltsSkillType, qId: number) => void
  tickTimer: () => void
  submitFullExam: () => void
  resetExam: () => void
}

const STORAGE_KEY = 'ielts_cbt_full_session_v1'

function loadSavedSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Error reading saved session:', e)
  }
  return null
}

function persistSession(data: Record<string, unknown>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Error saving session:', e)
  }
}

const defaultManifest = cambridgeFull4SkillMock
const saved = loadSavedSession()

export const useFullExamStore = create<FullExamStoreState>((set, get) => ({
  manifest: defaultManifest,
  activeSkill: (saved?.activeSkill as IeltsSkillType) ?? 'LISTENING',
  activeSectionIndex: saved?.activeSectionIndex ?? 0,
  examMode: (saved?.examMode as ExamMode) ?? defaultManifest.mode ?? 'STRICT',
  tabSwitchCount: saved?.tabSwitchCount ?? 0,
  isRubricModalOpen: false,

  listeningAnswers: saved?.listeningAnswers ?? {},
  readingAnswers: saved?.readingAnswers ?? {},
  writingSubmissions: saved?.writingSubmissions ?? { task1: '', task2: '' },
  speakingRecordings: saved?.speakingRecordings ?? {},

  flaggedQuestions: saved?.flaggedQuestions ?? {},
  timeRemaining: saved?.timeRemaining ?? {
    LISTENING: (defaultManifest.skills.listening?.durationMinutes ?? 32) * 60,
    READING: (defaultManifest.skills.reading?.durationMinutes ?? 60) * 60,
    WRITING: (defaultManifest.skills.writing?.durationMinutes ?? 60) * 60,
    SPEAKING: (defaultManifest.skills.speaking?.durationMinutes ?? 14) * 60,
  },
  isTimerRunning: !(saved?.isSubmitted ?? false),
  isSubmitted: saved?.isSubmitted ?? false,

  setManifest: (manifest) => {
    const firstSkill: IeltsSkillType = manifest.skills.listening
      ? 'LISTENING'
      : manifest.skills.reading
        ? 'READING'
        : manifest.skills.writing
          ? 'WRITING'
          : manifest.skills.speaking
            ? 'SPEAKING'
            : 'LISTENING'

    set({
      manifest,
      activeSkill: firstSkill,
      examMode: manifest.mode ?? 'STRICT',
      timeRemaining: {
        LISTENING: (manifest.skills.listening?.durationMinutes ?? 32) * 60,
        READING: (manifest.skills.reading?.durationMinutes ?? 60) * 60,
        WRITING: (manifest.skills.writing?.durationMinutes ?? 60) * 60,
        SPEAKING: (manifest.skills.speaking?.durationMinutes ?? 14) * 60,
      },
    })
  },

  setExamMode: (mode) => {
    set({ examMode: mode })
    const state = get()
    persistSession({
      ...state,
      examMode: mode,
    })
  },

  incrementTabSwitchCount: () => {
    set((state) => {
      const nextCount = state.tabSwitchCount + 1
      persistSession({
        ...state,
        tabSwitchCount: nextCount,
      })
      return { tabSwitchCount: nextCount }
    })
  },

  setIsRubricModalOpen: (open) => {
    set({ isRubricModalOpen: open })
  },

  setActiveSkill: (skill) => {
    set({ activeSkill: skill, activeSectionIndex: 0 })
    const state = get()
    persistSession({
      activeSkill: skill,
      activeSectionIndex: 0,
      examMode: state.examMode,
      tabSwitchCount: state.tabSwitchCount,
      listeningAnswers: state.listeningAnswers,
      readingAnswers: state.readingAnswers,
      writingSubmissions: state.writingSubmissions,
      flaggedQuestions: state.flaggedQuestions,
      timeRemaining: state.timeRemaining,
      isSubmitted: state.isSubmitted,
    })
  },

  setActiveSectionIndex: (index) => {
    set({ activeSectionIndex: index })
  },

  setListeningAnswer: (qId, val) => {
    set((state) => {
      const updated = { ...state.listeningAnswers, [qId]: val }
      persistSession({
        ...state,
        listeningAnswers: updated,
      })
      return { listeningAnswers: updated }
    })
  },

  setReadingAnswer: (qId, val) => {
    set((state) => {
      const updated = { ...state.readingAnswers, [qId]: val }
      persistSession({
        ...state,
        readingAnswers: updated,
      })
      return { readingAnswers: updated }
    })
  },

  setWritingTaskAnswer: (task, content) => {
    set((state) => {
      const updated = { ...state.writingSubmissions, [task]: content }
      persistSession({
        ...state,
        writingSubmissions: updated,
      })
      return { writingSubmissions: updated }
    })
  },

  setSpeakingRecording: (partId, blobUrl, duration) => {
    set((state) => {
      const updated = {
        ...state.speakingRecordings,
        [partId]: { blobUrl, duration },
      }
      return { speakingRecordings: updated }
    })
  },

  toggleFlag: (skill, qId) => {
    const key = `${skill}_${qId}`
    set((state) => {
      const isCurrently = !!state.flaggedQuestions[key]
      const updated = { ...state.flaggedQuestions, [key]: !isCurrently }
      persistSession({
        ...state,
        flaggedQuestions: updated,
      })
      return { flaggedQuestions: updated }
    })
  },

  tickTimer: () => {
    set((state) => {
      if (!state.isTimerRunning || state.isSubmitted) return state
      const currentRemaining = state.timeRemaining[state.activeSkill]
      if (currentRemaining <= 0) return state

      const newRemaining = {
        ...state.timeRemaining,
        [state.activeSkill]: currentRemaining - 1,
      }
      return { timeRemaining: newRemaining }
    })
  },

  submitFullExam: () => {
    set({ isSubmitted: true, isTimerRunning: false })
    persistSession({
      ...get(),
      isSubmitted: true,
    })
  },

  resetExam: () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore
    }
    const manifest = get().manifest
    set({
      activeSkill: 'LISTENING',
      activeSectionIndex: 0,
      examMode: manifest.mode ?? 'STRICT',
      listeningAnswers: {},
      readingAnswers: {},
      writingSubmissions: { task1: '', task2: '' },
      speakingRecordings: {},
      flaggedQuestions: {},
      timeRemaining: {
        LISTENING: (manifest.skills.listening?.durationMinutes ?? 32) * 60,
        READING: (manifest.skills.reading?.durationMinutes ?? 60) * 60,
        WRITING: (manifest.skills.writing?.durationMinutes ?? 60) * 60,
        SPEAKING: (manifest.skills.speaking?.durationMinutes ?? 14) * 60,
      },
      tabSwitchCount: 0,
      isRubricModalOpen: false,
      isTimerRunning: true,
      isSubmitted: false,
    })
  },
}))
