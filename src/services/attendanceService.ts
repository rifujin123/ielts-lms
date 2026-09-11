// import { apiClient } from '@/lib/axios'
import { attendanceMock } from '@/mocks/attendance.mock'
import type { Session } from '@/types/api.types'

export const attendanceService = {
  /**
   * Lấy danh sách điểm danh và tóm tắt buổi học
   */
  getAttendance: async (): Promise<Session[]> => {
    // 🔌 WIRE: GET /api/attendance
    // const { data } = await apiClient.get<Session[]>('/attendance')
    // return data
    return attendanceMock
  },
}
