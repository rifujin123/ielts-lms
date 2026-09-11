import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { attendanceMock } from '@/mocks/attendance.mock'
import type { Session } from '@/types/api.types'

export const attendanceService = {
  /**
   * Lấy danh sách điểm danh và tóm tắt buổi học
   */
  getAttendance: async (): Promise<Session[]> => {
    if (getMock()) {
      // 🔌 WIRE: GET /api/attendance
      return attendanceMock
    }
    const { data } = await apiClient.get<Session[]>('/attendance')
    return data
  },
}
