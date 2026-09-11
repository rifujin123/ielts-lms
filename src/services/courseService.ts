import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { courseInfoMock, activeCoursesMock } from '@/mocks/course.mock'
import type { CourseInfo, CourseCard } from '@/types/api.types'

export const courseService = {
  /**
   * Lấy thông tin chi tiết của khóa học (Root page / Course info)
   */
  getCourseInfo: async (courseId: string): Promise<CourseInfo> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/courses/:courseId/info
      return courseInfoMock
    }
    const { data } = await apiClient.get<CourseInfo>(`/courses/${courseId}/info`)
    return data
  },

  /**
   * Lấy danh sách các khóa học đang theo học (Dashboard)
   */
  getActiveCourses: async (): Promise<CourseCard[]> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/courses/active
      return activeCoursesMock
    }
    const { data } = await apiClient.get<CourseCard[]>('/courses/active')
    return data
  },
}
