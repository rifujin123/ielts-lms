import type { LoggedMistake } from '@/types/mistakeLog.types'

/** Realistic seed data of past student mistakes for instant academic rendering */
export const initialMistakeLogsMock: LoggedMistake[] = [
  {
    id: 'mistake-mock-1',
    questionId: 'Q14',
    testTitle: 'Cambridge 18 Academic Reading Test 1',
    skill: 'reading',
    trapType: 'TRAP_NOT_GIVEN',
    questionPrompt:
      'The research team anticipated the negative environmental consequences before launching the pilot plant.',
    correctAnswer: 'NOT GIVEN',
    studentAnswer: 'FALSE',
    loggedAt: '2026-09-10T09:30:00.000Z',
    notes:
      'Đoạn văn chỉ mô tả quá trình xây dựng trạm thử nghiệm, hoàn toàn không đề cập đến việc nhóm nghiên cứu có dự đoán trước tác động hay không.',
  },
  {
    id: 'mistake-mock-2',
    questionId: 'Q28',
    testTitle: 'Cambridge 18 Academic Reading Test 1',
    skill: 'reading',
    trapType: 'TRAP_NOT_GIVEN',
    questionPrompt:
      'Traditional farming techniques have completely ceased across northern provinces.',
    correctAnswer: 'NOT GIVEN',
    studentAnswer: 'FALSE',
    loggedAt: '2026-09-10T10:15:00.000Z',
    notes:
      'Tác giả chỉ nói phương pháp cơ giới hóa đang lan rộng, không hề khẳng định phương pháp truyền thống đã hoàn toàn biến mất.',
  },
  {
    id: 'mistake-mock-3',
    questionId: 'Q08',
    testTitle: 'Cambridge 17 Academic Reading Test 3',
    skill: 'reading',
    trapType: 'VOCAB_UNKNOWN',
    questionPrompt: 'The municipal council decided to ______ the historic canal expansion scheme.',
    correctAnswer: 'abandon',
    studentAnswer: 'prolong',
    loggedAt: '2026-09-09T14:20:00.000Z',
    notes:
      'Không nhận diện được cụm từ đồng nghĩa "relinquish / discard" trong bài đọc tương ứng với "abandon" trong câu hỏi.',
  },
  {
    id: 'mistake-mock-4',
    questionId: 'Q23',
    testTitle: 'Cambridge 18 Listening Practice Test 2',
    skill: 'listening',
    trapType: 'AUDIO_DISTRACTION',
    questionPrompt: 'What caused the unexpected delay during the geotechnical survey?',
    correctAnswer: 'Inclement weather conditions',
    studentAnswer: 'Instrument malfunction',
    loggedAt: '2026-09-08T16:45:00.000Z',
    notes:
      'Bị phân tâm bởi người nói nhắc đến sự cố thiết bị đo vào tuần trước, trước khi chốt lại lý do hoãn là do bão tuyết kéo dài.',
  },
  {
    id: 'mistake-mock-5',
    questionId: 'Q36',
    testTitle: 'Cambridge 16 Academic Reading Test 4',
    skill: 'reading',
    trapType: 'TIME_PRESSURE',
    questionPrompt: 'The principal factor that prompted the mass relocation was...',
    correctAnswer: 'Escalating resource scarcity',
    studentAnswer: 'Cultural assimilation',
    loggedAt: '2026-09-07T11:00:00.000Z',
    notes:
      'Còn 2 phút cuối giờ nên quét vội từ khóa "culture" ở đoạn C thay vì đọc kỹ câu kết luận nguyên nhân gốc rễ ở đoạn D.',
  },
  {
    id: 'mistake-mock-6',
    questionId: 'Q04',
    testTitle: 'Cambridge 17 Listening Test 1',
    skill: 'listening',
    trapType: 'SPELLING_ERROR',
    questionPrompt: 'Student rental requirements: type of ________',
    correctAnswer: 'accommodation',
    studentAnswer: 'accomodation',
    loggedAt: '2026-09-06T15:10:00.000Z',
    notes: 'Sai chính tả từ vựng phổ biến: accommodation có hai chữ c (cc) và hai chữ m (mm).',
  },
]
