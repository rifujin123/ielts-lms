import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { booksMock } from '@/mocks/books.mock'
import type { CourseBook } from '@/types/api.types'

export const materialService = {
  /**
   * Lấy danh sách tài liệu và sách giáo trình
   */
  getBooks: async (): Promise<CourseBook[]> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/materials/books
      return booksMock
    }
    const { data } = await apiClient.get<CourseBook[]>('/materials/books')
    return data
  },
}
