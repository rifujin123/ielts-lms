// import { apiClient } from '@/lib/axios'
import { homeworkMock, finalTestMock } from '@/mocks/homework.mock'
import type { HomeworkItem, FinalTest } from '@/types/api.types'

export const homeworkService = {
  /**
   * Lấy danh sách bài tập về nhà và giáo trình
   */
  getHomeworkList: async (): Promise<HomeworkItem[]> => {
    // 🔌 WIRE: GET /api/homework
    // const { data } = await apiClient.get<HomeworkItem[]>('/homework')
    // return data
    return homeworkMock
  },

  /**
   * Lấy thông tin bài thi cuối khóa
   */
  getFinalTest: async (): Promise<FinalTest> => {
    // 🔌 WIRE: GET /api/final-test
    // const { data } = await apiClient.get<FinalTest>('/final-test')
    // return data
    return finalTestMock
  },
}
