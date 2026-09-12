import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import { initialProfileMock } from '@/mocks/profile.mock'
import type {
  StudentProfile,
  ChangePasswordPayload,
  UpdatePhonePayload,
} from '@/types/profile.types'

const PROFILE_STORAGE_KEY = 'ielts_lms_student_profile'

export const studentProfileService = {
  /**
   * Lấy thông tin tài khoản và gói học học viên
   */
  getProfile: async (): Promise<StudentProfile> => {
    // 🔌 WIRE: GET /api/student/profile
    if (!getMock()) {
      const { data } = await apiClient.get<StudentProfile>('/student/profile')
      return data
    }

    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored) as StudentProfile
      } catch {
        // fallback
      }
    }
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(initialProfileMock))
    return initialProfileMock
  },

  /**
   * Cập nhật số điện thoại
   */
  updatePhone: async (payload: UpdatePhonePayload): Promise<StudentProfile> => {
    // 🔌 WIRE: PUT /api/student/profile/phone
    if (!getMock()) {
      const { data } = await apiClient.put<StudentProfile>('/student/profile/phone', payload)
      return data
    }

    const current = await studentProfileService.getProfile()
    const updated: StudentProfile = {
      ...current,
      phone: payload.phone.trim(),
    }
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated))
    return updated
  },

  /**
   * Đổi mật khẩu tài khoản
   */
  changePassword: async (
    payload: ChangePasswordPayload,
  ): Promise<{ success: boolean; message: string }> => {
    // 🔌 WIRE: POST /api/student/security/change-password
    if (!getMock()) {
      const { data } = await apiClient.post<{ success: boolean; message: string }>(
        '/student/security/change-password',
        payload,
      )
      return data
    }

    await new Promise((resolve) => setTimeout(resolve, 600))

    if (!payload.currentPassword) {
      throw new Error('Vui lòng nhập mật khẩu hiện tại.')
    }
    if (payload.newPassword.length < 8) {
      throw new Error('Mật khẩu mới phải có tối thiểu 8 ký tự.')
    }
    if (payload.newPassword !== payload.confirmPassword) {
      throw new Error('Mật khẩu xác nhận không khớp.')
    }
    if (payload.currentPassword === payload.newPassword) {
      throw new Error('Mật khẩu mới không được trùng với mật khẩu cũ.')
    }

    return {
      success: true,
      message: 'Mật khẩu đã được cập nhật thành công.',
    }
  },
}
