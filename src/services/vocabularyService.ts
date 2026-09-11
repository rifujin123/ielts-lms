// import { apiClient } from '@/lib/axios'
import { vocabularyMock, vocabularyDetailMocks } from '@/mocks/vocabulary.mock'
import type { VocabularySet, VocabularySetDetail } from '@/types/api.types'

interface VocabStorageData {
  masteredWordIds: string[]
  starredWordIds: string[]
}

const getStorageKey = (setId: string) => `ielts_vocab_progress_${setId}`

function getLocalProgress(setId: string, defaultDetail: VocabularySetDetail): VocabStorageData {
  try {
    const raw = localStorage.getItem(getStorageKey(setId))
    if (raw) {
      return JSON.parse(raw) as VocabStorageData
    }
  } catch {
    // ignore parse error
  }
  // Initialize from defaults
  const masteredWordIds = defaultDetail.words.filter((w) => w.isMastered).map((w) => w.id)
  const starredWordIds = defaultDetail.words.filter((w) => w.isStarred).map((w) => w.id)
  const initialData: VocabStorageData = { masteredWordIds, starredWordIds }
  try {
    localStorage.setItem(getStorageKey(setId), JSON.stringify(initialData))
  } catch {
    // ignore storage quota error
  }
  return initialData
}

function saveLocalProgress(setId: string, data: VocabStorageData) {
  try {
    localStorage.setItem(getStorageKey(setId), JSON.stringify(data))
  } catch {
    // ignore
  }
}

export const vocabularyService = {
  /**
   * Lấy danh sách bộ từ vựng được giao
   */
  getVocabularySets: async (): Promise<VocabularySet[]> => {
    // 🔌 WIRE: GET /api/vocabulary
    // const { data } = await apiClient.get<VocabularySet[]>('/vocabulary')
    // return data
    return vocabularyMock
  },

  /**
   * Lấy chi tiết một bộ từ vựng cùng danh sách các từ do giáo viên chỉ định
   */
  getVocabularySetDetail: async (setId: string): Promise<VocabularySetDetail | null> => {
    // 🔌 WIRE: GET /api/vocabulary/:setId
    // const { data } = await apiClient.get<VocabularySetDetail>(`/vocabulary/${setId}`)
    // return data

    const baseSet = vocabularyDetailMocks[setId] || {
      id: setId,
      title: `Topic: Vocabulary Set ${setId}`,
      wordCount: 0,
      masteredCount: 0,
      status: 'not_started',
      tags: ['IELTS Prep'],
      description: 'Bộ từ vựng học thuật chuẩn do giáo viên chỉ định.',
      words: [],
    }

    // Merge student's local tracking state
    const progress = getLocalProgress(setId, baseSet)
    const wordsWithProgress = baseSet.words.map((word) => ({
      ...word,
      isMastered: progress.masteredWordIds.includes(word.id),
      isStarred: progress.starredWordIds.includes(word.id),
    }))

    const masteredCount = wordsWithProgress.filter((w) => w.isMastered).length
    const wordCount = wordsWithProgress.length

    return {
      ...baseSet,
      words: wordsWithProgress,
      masteredCount,
      wordCount,
      status:
        masteredCount === wordCount && wordCount > 0
          ? 'completed'
          : masteredCount > 0
            ? 'in_progress'
            : 'not_started',
    }
  },

  /**
   * Đánh dấu hoặc bỏ đánh dấu đã thuộc từ vựng
   */
  toggleWordMastered: async (setId: string, wordId: string): Promise<{ isMastered: boolean }> => {
    // 🔌 WIRE: POST /api/vocabulary/:setId/words/:wordId/master
    // const { data } = await apiClient.post<{ isMastered: boolean }>(`/vocabulary/${setId}/words/${wordId}/master`)
    // return data

    const baseSet = vocabularyDetailMocks[setId] || { words: [] }
    const progress = getLocalProgress(setId, baseSet as VocabularySetDetail)
    const isCurrentlyMastered = progress.masteredWordIds.includes(wordId)

    const nextMasteredIds = isCurrentlyMastered
      ? progress.masteredWordIds.filter((id) => id !== wordId)
      : [...progress.masteredWordIds, wordId]

    const nextData: VocabStorageData = {
      ...progress,
      masteredWordIds: nextMasteredIds,
    }
    saveLocalProgress(setId, nextData)

    return { isMastered: !isCurrentlyMastered }
  },

  /**
   * Đánh dấu hoặc bỏ đánh dấu sao/lưu ý từ vựng
   */
  toggleWordStarred: async (setId: string, wordId: string): Promise<{ isStarred: boolean }> => {
    // 🔌 WIRE: POST /api/vocabulary/:setId/words/:wordId/star
    // const { data } = await apiClient.post<{ isStarred: boolean }>(`/vocabulary/${setId}/words/${wordId}/star`)
    // return data

    const baseSet = vocabularyDetailMocks[setId] || { words: [] }
    const progress = getLocalProgress(setId, baseSet as VocabularySetDetail)
    const isCurrentlyStarred = progress.starredWordIds.includes(wordId)

    const nextStarredIds = isCurrentlyStarred
      ? progress.starredWordIds.filter((id) => id !== wordId)
      : [...progress.starredWordIds, wordId]

    const nextData: VocabStorageData = {
      ...progress,
      starredWordIds: nextStarredIds,
    }
    saveLocalProgress(setId, nextData)

    return { isStarred: !isCurrentlyStarred }
  },
}
