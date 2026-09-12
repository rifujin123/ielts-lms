import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { initialPersonalWordsMock } from '@/mocks/personalVocab.mock'
import type {
  PersonalWordEntry,
  CreatePersonalWordPayload,
  WordMastery,
} from '@/types/personalVocab.types'

const PERSONAL_VOCAB_STORAGE_KEY = 'ielts_lms_personal_vocab_entries'

export const personalVocabService = {
  getWords: async (): Promise<PersonalWordEntry[]> => {
    // 🔌 WIRE: GET /api/personal-vocab
    if (!getMock()) {
      const { data } = await apiClient.get<PersonalWordEntry[]>('/personal-vocab')
      return data
    }

    const raw = localStorage.getItem(PERSONAL_VOCAB_STORAGE_KEY)
    if (raw) {
      try {
        return JSON.parse(raw) as PersonalWordEntry[]
      } catch {
        // fallback
      }
    }
    localStorage.setItem(PERSONAL_VOCAB_STORAGE_KEY, JSON.stringify(initialPersonalWordsMock))
    return initialPersonalWordsMock
  },

  addWord: async (payload: CreatePersonalWordPayload): Promise<PersonalWordEntry> => {
    // 🔌 WIRE: POST /api/personal-vocab
    if (!getMock()) {
      const { data } = await apiClient.post<PersonalWordEntry>('/personal-vocab', payload)
      return data
    }

    const words = await personalVocabService.getWords()
    const newEntry: PersonalWordEntry = {
      id: `pw-${Date.now()}`,
      word: payload.word.trim(),
      phonetic: payload.phonetic?.trim() || '',
      partOfSpeech: payload.partOfSpeech,
      meaningVi: payload.meaningVi.trim(),
      contextSentence: payload.contextSentence.trim(),
      sourceSkill: payload.sourceSkill,
      sourceReference: payload.sourceReference?.trim(),
      collocations: payload.collocations || [],
      personalNote: payload.personalNote?.trim(),
      masteryStatus: 'needs_review',
      isStarred: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updatedList = [newEntry, ...words]
    localStorage.setItem(PERSONAL_VOCAB_STORAGE_KEY, JSON.stringify(updatedList))
    return newEntry
  },

  updateMastery: async (id: string, status: WordMastery): Promise<void> => {
    // 🔌 WIRE: PATCH /api/personal-vocab/:id/mastery
    if (!getMock()) {
      await apiClient.patch(`/personal-vocab/${id}/mastery`, { status })
      return
    }

    const words = await personalVocabService.getWords()
    const updatedList = words.map((w) =>
      w.id === id ? { ...w, masteryStatus: status, updatedAt: new Date().toISOString() } : w,
    )
    localStorage.setItem(PERSONAL_VOCAB_STORAGE_KEY, JSON.stringify(updatedList))
  },

  toggleStar: async (id: string): Promise<boolean> => {
    // 🔌 WIRE: PATCH /api/personal-vocab/:id/star
    if (!getMock()) {
      const { data } = await apiClient.patch<{ isStarred: boolean }>(`/personal-vocab/${id}/star`)
      return data.isStarred
    }

    const words = await personalVocabService.getWords()
    let newStar = false
    const updatedList = words.map((w) => {
      if (w.id === id) {
        newStar = !w.isStarred
        return { ...w, isStarred: newStar, updatedAt: new Date().toISOString() }
      }
      return w
    })
    localStorage.setItem(PERSONAL_VOCAB_STORAGE_KEY, JSON.stringify(updatedList))
    return newStar
  },

  updateNote: async (id: string, note: string): Promise<void> => {
    // 🔌 WIRE: PATCH /api/personal-vocab/:id/note
    if (!getMock()) {
      await apiClient.patch(`/personal-vocab/${id}/note`, { note })
      return
    }

    const words = await personalVocabService.getWords()
    const updatedList = words.map((w) =>
      w.id === id ? { ...w, personalNote: note, updatedAt: new Date().toISOString() } : w,
    )
    localStorage.setItem(PERSONAL_VOCAB_STORAGE_KEY, JSON.stringify(updatedList))
  },

  deleteWord: async (id: string): Promise<void> => {
    // 🔌 WIRE: DELETE /api/personal-vocab/:id
    if (!getMock()) {
      await apiClient.delete(`/personal-vocab/${id}`)
      return
    }

    const words = await personalVocabService.getWords()
    const updatedList = words.filter((w) => w.id !== id)
    localStorage.setItem(PERSONAL_VOCAB_STORAGE_KEY, JSON.stringify(updatedList))
  },
}
