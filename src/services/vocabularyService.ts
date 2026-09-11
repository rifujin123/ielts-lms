import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { vocabularyMock } from '@/mocks/vocabulary.mock'
import type { VocabularySet } from '@/types/api.types'

export const vocabularyService = {
  /**
   * Lấy danh sách bộ từ vựng được giao
   */
  getVocabularySets: async (): Promise<VocabularySet[]> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/vocabulary
      return vocabularyMock
    }
    const { data } = await apiClient.get<VocabularySet[]>('/vocabulary')
    return data
  },
}
