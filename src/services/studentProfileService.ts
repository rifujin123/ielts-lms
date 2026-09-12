import type {
  StudentProfile,
  ChangePasswordPayload,
  UpdatePhonePayload,
} from '@/types/profile.types'

const PROFILE_STORAGE_KEY = 'ielts_lms_student_profile'

const initialProfile: StudentProfile = {
  id: 'HT-8829',
  name: 'Trần Thảo',
  initials: 'TT',
  phone: '0912345678',
  email: 'thaotran@example.com',
  membershipStatus: 'active',
  expiryDate: '15/10/2026',
  remainingDays: 45,
  enrolledCourse: {
    id: 'course-master-65',
    title: 'IELTS Master 6.5+ Intensive',
    targetBand: '6.5 - 7.0 Overall',
    classCode: 'Online-IELTS-6.5-12.08.2026-20:00',
    schedule: 'Thứ 2 - Thứ 4 - Thứ 6 (19:30 - 21:00)',
    leadInstructor: {
      name: 'Thầy Hồ Thành',
      role: 'Head Instructor (M.A TESOL)',
    },
    teachingAssistant: {
      name: 'Cô Minh Anh',
      role: 'Teaching Assistant (IELTS 8.0)',
    },
    totalSessions: 24,
    completedSessions: 18,
    roomUrl: '/classroom',
  },
}

export const studentProfileService = {
  /**
   * Lấy thông tin tài khoản và gói học học viên
   */
  getProfile: async (): Promise<StudentProfile> => {
    // 🔌 WIRE: GET /api/student/profile
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored) as StudentProfile
      } catch {
        // fallback
      }
    }
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(initialProfile))
    return initialProfile
  },

  /**
   * Cập nhật số điện thoại
   */
  updatePhone: async (payload: UpdatePhonePayload): Promise<StudentProfile> => {
    // 🔌 WIRE: PUT /api/student/profile/phone
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
