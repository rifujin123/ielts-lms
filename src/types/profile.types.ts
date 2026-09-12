export interface StudentProfile {
  id: string
  name: string
  initials: string
  phone: string
  email: string
  membershipStatus: 'active' | 'expiring_soon' | 'expired'
  expiryDate: string
  remainingDays: number
  enrolledCourse: {
    id: string
    title: string
    targetBand: string
    classCode: string
    schedule: string
    leadInstructor: {
      name: string
      role: string
      avatarUrl?: string
    }
    teachingAssistant: {
      name: string
      role: string
    }
    totalSessions: number
    completedSessions: number
    roomUrl?: string
  }
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdatePhonePayload {
  phone: string
}
