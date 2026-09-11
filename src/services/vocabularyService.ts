// import { apiClient } from '@/lib/axios'
import { vocabularyMock } from '@/mocks/vocabulary.mock'
import type { VocabularySet } from '@/types/api.types'

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
}
