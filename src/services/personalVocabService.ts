import type {
  PersonalWordEntry,
  CreatePersonalWordPayload,
  WordMastery,
} from '@/types/personalVocab.types'

const PERSONAL_VOCAB_STORAGE_KEY = 'ielts_lms_personal_vocab_entries'

const initialPersonalWords: PersonalWordEntry[] = [
  {
    id: 'pw-1',
    word: 'ephemeral',
    phonetic: '/ɪˈfem.ər.əl/',
    partOfSpeech: 'adjective',
    meaningVi: 'Phù du, chóng tàn, tồn tại trong thời gian rất ngắn',
    contextSentence: 'Fame in the age of social media is often fleeting and ephemeral.',
    sourceSkill: 'reading',
    sourceReference: 'Cam 18 - Reading Test 1 Passage 2',
    collocations: ['ephemeral nature', 'ephemeral pleasures', 'ephemeral fame'],
    personalNote: 'Rất hay dùng thay cho short-lived hoặc momentary trong Writing Task 2.',
    masteryStatus: 'learning',
    isStarred: true,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-05T14:30:00Z',
  },
  {
    id: 'pw-2',
    word: 'ubiquitous',
    phonetic: '/juːˈbɪk.wɪ.təs/',
    partOfSpeech: 'adjective',
    meaningVi: 'Phổ biến khắp nơi, có mặt ở mọi nơi',
    contextSentence:
      'Smartphones have become ubiquitous across all demographics in modern society.',
    sourceSkill: 'writing',
    sourceReference: 'Thầy Hồ Thành sửa Writing Task 2 - Tech topic',
    collocations: ['ubiquitous presence', 'ubiquitous influence'],
    personalNote: 'Từ band 8.0 nâng cấp cho từ omnipresent hoặc very common.',
    masteryStatus: 'mastered',
    isStarred: false,
    createdAt: '2026-08-28T09:15:00Z',
    updatedAt: '2026-09-02T16:00:00Z',
  },
  {
    id: 'pw-3',
    word: 'mitigate',
    phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Giảm thiểu, làm nhẹ bớt mức độ nghiêm trọng',
    contextSentence:
      'Governments must introduce strict policies to mitigate the adverse effects of climate change.',
    sourceSkill: 'reading',
    sourceReference: 'Cam 17 - Reading Test 3 Passage 1',
    collocations: ['mitigate the risk', 'mitigate the impact', 'mitigate damage'],
    personalNote: 'Đi kèm với damage/risk/effect, nhớ không nhầm với militate.',
    masteryStatus: 'mastered',
    isStarred: false,
    createdAt: '2026-08-25T11:00:00Z',
    updatedAt: '2026-09-08T08:00:00Z',
  },
  {
    id: 'pw-4',
    word: 'deteriorate',
    phonetic: '/dɪˈtɪə.ri.ə.reɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Xuống cấp, xấu đi, suy giảm trầm trọng',
    contextSentence: 'Air quality in major metropolises continues to deteriorate rapidly.',
    sourceSkill: 'dictation',
    sourceReference: 'Video Dictation: Global Warming Report',
    collocations: ['deteriorate rapidly', 'deteriorating condition'],
    personalNote: 'Phát âm hay bị nuốt âm ri-o. Nghe kĩ trong bài Listening Section 4.',
    masteryStatus: 'needs_review',
    isStarred: true,
    createdAt: '2026-09-08T15:20:00Z',
    updatedAt: '2026-09-08T15:20:00Z',
  },
  {
    id: 'pw-5',
    word: 'plausible',
    phonetic: '/ˈplɔː.zə.bəl/',
    partOfSpeech: 'adjective',
    meaningVi: 'Hợp lý, đáng tin cậy, có vẻ khả thi',
    contextSentence:
      'The researchers proposed a plausible explanation for the sudden population decline.',
    sourceSkill: 'listening',
    sourceReference: 'Cam 16 - Listening Part 3 Ecology Project',
    collocations: ['plausible explanation', 'plausible scenario'],
    personalNote: 'Trái nghĩa là implausible. Hay gặp trong dạng bài Multiple Choice.',
    masteryStatus: 'needs_review',
    isStarred: false,
    createdAt: '2026-09-10T14:10:00Z',
    updatedAt: '2026-09-10T14:10:00Z',
  },
]

export const personalVocabService = {
  getWords: async (): Promise<PersonalWordEntry[]> => {
    // 🔌 WIRE: GET /api/personal-vocab
    const raw = localStorage.getItem(PERSONAL_VOCAB_STORAGE_KEY)
    if (raw) {
      try {
        return JSON.parse(raw) as PersonalWordEntry[]
      } catch {
        // fallback
      }
    }
    localStorage.setItem(PERSONAL_VOCAB_STORAGE_KEY, JSON.stringify(initialPersonalWords))
    return initialPersonalWords
  },

  addWord: async (payload: CreatePersonalWordPayload): Promise<PersonalWordEntry> => {
    // 🔌 WIRE: POST /api/personal-vocab
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
    const words = await personalVocabService.getWords()
    const updatedList = words.map((w) =>
      w.id === id ? { ...w, masteryStatus: status, updatedAt: new Date().toISOString() } : w,
    )
    localStorage.setItem(PERSONAL_VOCAB_STORAGE_KEY, JSON.stringify(updatedList))
  },

  toggleStar: async (id: string): Promise<boolean> => {
    // 🔌 WIRE: PATCH /api/personal-vocab/:id/star
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
    const words = await personalVocabService.getWords()
    const updatedList = words.map((w) =>
      w.id === id ? { ...w, personalNote: note, updatedAt: new Date().toISOString() } : w,
    )
    localStorage.setItem(PERSONAL_VOCAB_STORAGE_KEY, JSON.stringify(updatedList))
  },

  deleteWord: async (id: string): Promise<void> => {
    // 🔌 WIRE: DELETE /api/personal-vocab/:id
    const words = await personalVocabService.getWords()
    const updatedList = words.filter((w) => w.id !== id)
    localStorage.setItem(PERSONAL_VOCAB_STORAGE_KEY, JSON.stringify(updatedList))
  },
}
