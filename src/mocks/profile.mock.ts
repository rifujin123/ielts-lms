import type { StudentProfile } from '@/types/profile.types'

export const initialProfileMock: StudentProfile = {
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
