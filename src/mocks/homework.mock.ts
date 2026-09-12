import type { HomeworkItem, FinalTest } from '@/types/api.types'

export const homeworkMock: HomeworkItem[] = [
  {
    id: 'HW-01',
    title: 'Bài tập Buổi 2: Tóm tắt ý chính và gạch chân Connectors (Reading)',
    practiceCount: 3,
    status: 'submitted',
    dueDate: '2026-08-16',
    score: 8.5,
    skill: 'Reading',
  },
  {
    id: 'HW-02',
    title: 'Bài tập Buổi 3: Viết 2 đoạn Body Task 2 về đề thi Globalization',
    practiceCount: 2,
    status: 'pending',
    dueDate: '2026-08-19',
    skill: 'Writing Task 2',
  },
  {
    id: 'HW-03',
    title: 'Bài tập Buổi 4: Nghe chép chính tả và nhận diện âm nối (Listening)',
    practiceCount: 5,
    status: 'pending',
    dueDate: '2026-08-23',
    skill: 'Listening',
  },
]

export const finalTestMock: FinalTest = {
  id: 'FT-2026',
  title: 'Kỳ thi Tốt nghiệp IELTS 6.5+ Cuối khóa (4 Kỹ năng)',
  status: 'not_taken',
  targetBand: '6.5 - 7.0 Overall',
  scheduledDate: '2026-11-22T08:00:00',
  feedback:
    'Bạn cần hoàn thành tối thiểu 85% bài tập trên hệ thống để đủ điều kiện thi tốt nghiệp.',
}
