// import { apiClient } from '@/lib/axios'
import { booksMock } from '@/mocks/books.mock'
import type { CourseBook } from '@/types/api.types'

export const materialService = {
  /**
   * Lấy danh sách tài liệu và sách giáo trình
   */
  getBooks: async (): Promise<CourseBook[]> => {
    // 🔌 WIRE: GET /api/materials/books
    // const { data } = await apiClient.get<CourseBook[]>('/materials/books')
    // return data
    return booksMock
  },
}
