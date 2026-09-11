import type { TeacherRubricAssessment } from '../types/fullExam.types'

/**
 * Realistic Mock Teacher Evaluation Rubric for demonstration & offline mode.
 * Separated cleanly from presentation components and scoring utilities
 * so it can be swapped 1:1 with real API responses from the backend.
 */
export const mockTeacherAssessment: TeacherRubricAssessment = {
  teacherId: 'TCH-082',
  teacherName: 'Thầy Hồ Thành (8.5 IELTS)',
  teacherAvatarUrl: '',
  gradedAt: '14:30 11/09/2026',
  overallBand: 7.5,
  status: 'GRADED_PUBLISHED',
  slaHoursRemaining: 0,
  writingTask1: {
    taskAchievement: 7.5,
    coherenceCohesion: 7.0,
    lexicalResource: 8.0,
    grammaticalRangeAccuracy: 7.0,
    overallTask1: 7.5,
    feedbackComments:
      'Bài viết có Overview rõ ràng, nêu bật được hai xu hướng chính của biểu đồ. Sử dụng từ vựng số liệu (surpassed, peaked at, a plateau) rất linh hoạt.',
  },
  writingTask2: {
    taskResponse: 7.0,
    coherenceCohesion: 7.5,
    lexicalResource: 7.0,
    grammaticalRangeAccuracy: 7.0,
    overallTask2: 7.0,
    feedbackComments:
      'Lập luận hai mặt cân bằng, luận điểm Body 2 phát triển sâu. Chú ý tránh một số lỗi lặp liên từ "However" và cấu trúc câu phức ở đoạn mở bài.',
  },
  speaking: {
    fluencyCoherence: 7.5,
    lexicalResource: 7.5,
    grammaticalRangeAccuracy: 7.0,
    pronunciation: 7.0,
    overallSpeaking: 7.5,
    audioFeedbackUrl: '',
    examinerNotes:
      'Phản xạ tự nhiên ở Part 1. Part 2 phát triển đủ các cue points trong thẻ câu hỏi, ngữ điệu (intonation) tốt. Part 3 cần mở rộng thêm các ví dụ thực tiễn để đạt 8.0.',
  },
}
