import type { CourseInfo, CourseCard } from '@/types/api.types'

export const courseInfoMock: CourseInfo = {
  id: 'IELTS-6.5-2026',
  name: 'Online-IELTS-6.5-12.08.2026-20:00',
  level: 'IELTS 6.5 Intensive',
  status: 'active',
  phase: {
    number: 2,
    name: 'Giai đoạn 2: Luyện đề & Tăng tốc kỹ năng',
    isActive: true,
    isCompleted: false,
  },
  startDate: '2026-08-12',
  endDate: '2026-11-20',
  classTime: '20:00 - 22:00',
  zoomLink: 'https://zoom.us/j/8829012389',
  zoomRoom: 'Phòng 802-HT',
  zaloGroupName: 'IELTS Hồ Thành 6.5 - K26 Online',
  zaloGroupLink: 'https://zalo.me/g/ielts-hothanh-65',
  totalExercises: 48,
  totalAssignments: 16,
  semester: 'Học kỳ Thu 2026',
  studentStatus: 'active',
  schedule: [
    {
      dayKey: 'Mon',
      dayName: 'Thứ 2',
      isClassDay: true,
      time: '20:00 - 22:00',
      room: 'Phòng Zoom 802',
    },
    { dayKey: 'Tue', dayName: 'Thứ 3', isClassDay: false },
    {
      dayKey: 'Wed',
      dayName: 'Thứ 4',
      isClassDay: true,
      time: '20:00 - 22:00',
      room: 'Phòng Zoom 802',
    },
    { dayKey: 'Thu', dayName: 'Thứ 5', isClassDay: false },
    {
      dayKey: 'Fri',
      dayName: 'Thứ 6',
      isClassDay: true,
      time: '20:00 - 22:00',
      room: 'Phòng Zoom 802',
    },
    { dayKey: 'Sat', dayName: 'Thứ 7', isClassDay: false },
    { dayKey: 'Sun', dayName: 'Chủ nhật', isClassDay: false },
  ],
  instructors: [
    {
      id: 'INS-01',
      name: 'Nguyễn Lê Trúc Linh',
      title: 'Giảng viên chuyên môn IELTS Reading & Writing',
      ieltsScore: '8.5 Overall',
      skills: ['Reading 9.0', 'Writing 8.0', 'Linearthinking Specialist'],
      certification: 'CELTA Cambridge, Thạc sĩ Ngôn ngữ học',
      isOnline: true,
    },
  ],
  objectiveDescription:
    'Khóa học trang bị cho học viên phương pháp tư duy học thuật độc quyền từ IELTS Hồ Thành, tập trung giải quyết triệt để vấn đề dịch từng từ khi đọc, thiếu liên kết khi viết, và bí ý tưởng khi nói. Mục tiêu chuẩn đầu ra tối thiểu 6.5+ Overall.',
  objectiveHighlights: [
    { text: 'Nắm vững kỹ thuật đọc cấu trúc hóa văn bản và skimming tư duy theo Linearthinking' },
    { text: 'Xây dựng dàn bài Task 2 mạch lạc, tránh lạc đề và dùng từ vựng học thuật chuẩn xác' },
    { text: 'Tự tin phản xạ Speaking Part 2 & 3 với phương pháp phát triển ý đa chiều' },
  ],
  classRules: [
    {
      order: 1,
      title: 'Chuyên cần & Đúng giờ',
      description:
        'Học viên cần tham gia đúng giờ (trước 5 phút). Bật webcam trong suốt buổi học trực tuyến để đảm bảo tương tác.',
    },
    {
      order: 2,
      title: 'Hoàn thành bài tập trước hạn',
      description:
        'Nộp bài tập trên hệ thống LMS ít nhất 4 tiếng trước giờ vào lớp để giáo viên kịp thời chấm và sửa bài.',
    },
    {
      order: 3,
      title: 'Chính sách vắng học & Điểm danh',
      description:
        'Nếu vắng có lý do, cần báo qua Zalo trước 2 tiếng. Không vắng quá 3 buổi học trong một giai đoạn.',
    },
    {
      order: 4,
      title: 'Tôn trọng & Tương tác tích cực',
      description:
        'Chủ động phát biểu, hoàn thành bài tập nhóm và giữ không khí học tập văn minh, nghiêm túc.',
    },
  ],
}

export const activeCoursesMock: CourseCard[] = [
  {
    id: 'IELTS-6.5-2026',
    name: 'Online-IELTS-6.5-12.08.2026-20:00',
    level: 'IELTS 6.5 Intensive',
    type: 'IELTS',
    band: '6.5+',
    status: 'active',
    schedule: ['Mon', 'Wed', 'Fri'],
    classTime: '20:00 - 22:00',
    zoomLink: 'https://zoom.us/j/8829012389',
    instructor: 'Nguyễn Lê Trúc Linh',
    totalSessions: 36,
    completedSessions: 12,
    currentSession: 13,
    nextSessionDate: '2026-09-14T20:00:00',
    description: 'Chinh phục mục tiêu 6.5+ với phương pháp Linearthinking độc quyền.',
  },
]
