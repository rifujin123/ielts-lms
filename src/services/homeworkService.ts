import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { homeworkMock, finalTestMock } from '@/mocks/homework.mock'
import type { HomeworkItem, FinalTest } from '@/types/api.types'

export const homeworkService = {
  /**
   * Lấy danh sách bài tập về nhà và giáo trình
   */
  getHomeworkList: async (): Promise<HomeworkItem[]> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/homework
      return homeworkMock
    }
    const { data } = await apiClient.get<HomeworkItem[]>('/homework')
    return data
  },

  /**
   * Lấy thông tin bài thi cuối khóa
   */
  getFinalTest: async (): Promise<FinalTest> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/final-test
      return finalTestMock
    }
    const { data } = await apiClient.get<FinalTest>('/final-test')
    return data
  },
}
