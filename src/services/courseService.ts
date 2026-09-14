// import { apiClient } from '@/lib/axios'
import { courseInfoMock, activeCoursesMock, studentGlobalProgressMock } from '@/mocks/course.mock'
import type { CourseInfo, CourseCard, StudentGlobalProgress } from '@/types/api.types'

export const courseService = {
  /**
   * Lấy thông tin chi tiết của khóa học (Course info / Course detail)
   */
  getCourseInfo: async (_courseId?: string): Promise<CourseInfo> => {
    // 🔌 WIRE: GET /api/courses/:courseId/info
    // const { data } = await apiClient.get<CourseInfo>(`/courses/${_courseId}/info`)
    // return data
    return courseInfoMock
  },

  /**
   * Lấy danh sách các khóa học học viên đang tham gia (Dashboard / My Courses)
   */
  getActiveCourses: async (): Promise<CourseCard[]> => {
    // 🔌 WIRE: GET /api/courses/enrolled
    // const { data } = await apiClient.get<CourseCard[]>('/courses/enrolled')
    // return data
    return activeCoursesMock
  },

  /**
   * Lấy chi tiết của một khóa học theo ID
   */
  getCourseById: async (courseId: string): Promise<CourseCard | undefined> => {
    // 🔌 WIRE: GET /api/courses/:courseId
    // const { data } = await apiClient.get<CourseCard>(`/courses/${courseId}`)
    // return data
    return activeCoursesMock.find((c) => c.id === courseId)
  },

  /**
   * Lấy tiến độ tổng quan mọi môn học của học viên (Master Dashboard)
   */
  getStudentGlobalProgress: async (): Promise<StudentGlobalProgress> => {
    // 🔌 WIRE: GET /api/student/global-progress
    // const { data } = await apiClient.get<StudentGlobalProgress>('/student/global-progress')
    // return data
    return studentGlobalProgressMock
  },
}
