// import { apiClient } from '@/lib/axios'
import { courseInfoMock, activeCoursesMock } from '@/mocks/course.mock'
import type { CourseInfo, CourseCard } from '@/types/api.types'

export const courseService = {
  /**
   * Lấy thông tin chi tiết của khóa học (Root page / Course info)
   */
  getCourseInfo: async (_courseId?: string): Promise<CourseInfo> => {
    // 🔌 WIRE: GET /api/courses/:courseId/info
    // const { data } = await apiClient.get<CourseInfo>(`/courses/${_courseId}/info`)
    // return data
    return courseInfoMock
  },

  /**
   * Lấy danh sách các khóa học đang theo học (Dashboard)
   */
  getActiveCourses: async (): Promise<CourseCard[]> => {
    // 🔌 WIRE: GET /api/courses/active
    // const { data } = await apiClient.get<CourseCard[]>('/courses/active')
    // return data
    return activeCoursesMock
  },
}
