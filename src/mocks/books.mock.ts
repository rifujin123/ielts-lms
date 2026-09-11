import type { CourseBook } from '@/types/api.types'

export const booksMock: CourseBook[] = [
  {
    id: 'BOOK-01',
    title: 'IELTS Hồ Thành Reading 6.5+ Master Method',
    subtitle: 'Giáo trình cốt lõi kỹ năng Đọc hiểu tuyến tính',
    type: 'main',
    coverColor: '#dc2626',
    coverImage:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    units: [
      {
        id: 'UNIT-01',
        number: 1,
        title: 'Unit 1: Fundamentals of Linearthinking in Reading',
        status: 'completed',
        isBookmarked: true,
        lessons: [
          {
            id: 'L-01',
            title: 'Lesson 1.1: Why Word-by-Word Reading Fails',
            type: 'video',
            durationMinutes: 20,
            isCompleted: true,
          },
          {
            id: 'L-02',
            title: 'Lesson 1.2: Clause Simplification Technique',
            type: 'reading',
            durationMinutes: 25,
            isCompleted: true,
          },
        ],
      },
      {
        id: 'UNIT-02',
        number: 2,
        title: 'Unit 2: Information Structure & Logical Connectors',
        status: 'in_progress',
        isBookmarked: false,
        lessons: [
          {
            id: 'L-03',
            title: 'Lesson 2.1: Semantic Connections Between Sentences',
            type: 'video',
            durationMinutes: 30,
            isCompleted: true,
          },
          {
            id: 'L-04',
            title: 'Lesson 2.2: Practice Passage - Environmental Shifts',
            type: 'exercise',
            durationMinutes: 40,
            isCompleted: false,
          },
        ],
      },
      {
        id: 'UNIT-03',
        number: 3,
        title: 'Unit 3: Mastering True / False / Not Given',
        status: 'upcoming',
        isBookmarked: false,
        lessons: [
          {
            id: 'L-05',
            title: 'Lesson 3.1: Identifying Verification Traps',
            type: 'video',
            durationMinutes: 25,
            isCompleted: false,
          },
        ],
      },
    ],
  },
  {
    id: 'BOOK-02',
    title: 'IELTS Hồ Thành Academic Writing Task 2 - Coherence & Cohesion',
    subtitle: 'Cẩm nang tư duy lập luận và phát triển đoạn văn',
    type: 'supplementary',
    coverColor: '#16a34a',
    coverImage:
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
    units: [
      {
        id: 'UNIT-W1',
        number: 1,
        title: 'Unit 1: Clear Thesis & Body Paragraph Blueprints',
        status: 'in_progress',
        isBookmarked: true,
        lessons: [
          {
            id: 'L-W01',
            title: 'Lesson 1.1: The 4-Sentence Body Formula',
            type: 'video',
            durationMinutes: 35,
            isCompleted: true,
          },
        ],
      },
    ],
  },
]
