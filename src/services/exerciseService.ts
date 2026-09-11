import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { exercisesMock } from '@/mocks/exercises.mock'
import type { Exercise, ExerciseFilters } from '@/types/api.types'

export const exerciseService = {
  /**
   * Lấy danh sách bài tập kèm bộ lọc kỹ năng, trạng thái và tìm kiếm
   */
  getExercises: async (filters?: Partial<ExerciseFilters>): Promise<Exercise[]> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/exercises
      let result = [...exercisesMock]
      if (filters?.skill && filters.skill !== 'all') {
        result = result.filter((e) => e.skill === filters.skill)
      }
      if (filters?.status && filters.status !== 'all') {
        result = result.filter((e) => e.status === filters.status)
      }
      if (filters?.search) {
        const query = filters.search.toLowerCase()
        result = result.filter((e) => e.title.toLowerCase().includes(query))
      }
      return result
    }
    const { data } = await apiClient.get<Exercise[]>('/exercises', { params: filters })
    return data
  },

  /**
   * Nộp bài tập
   */
  submitExercise: async (
    exerciseId: string,
    submission: unknown,
  ): Promise<{ success: boolean }> => {
    if (getMock()) {
      // 🔌 WIRE: POST /api/exercises/:exerciseId/submit
      console.log('Mock submit exercise:', exerciseId, submission)
      return { success: true }
    }
    const { data } = await apiClient.post<{ success: boolean }>(
      `/exercises/${exerciseId}/submit`,
      submission,
    )
    return data
  },
}
