import type { RoadmapItem } from '@/types/api.types'

export const roadmapMock: RoadmapItem[] = [
  {
    id: 'RD-01',
    title: 'Nắm vững kỹ thuật Skimming & Scanning theo Linearthinking',
    description: 'Phương pháp giải quyết bẫy từ đồng nghĩa và định vị thông tin nhanh chóng.',
    type: 'Reading Core',
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    status: 'completed',
    createdAt: '2026-08-15',
  },
  {
    id: 'RD-02',
    title: 'Cấu trúc bài viết Writing Task 2 dạng Agree/Disagree',
    description: 'Cách triển khai luận điểm mạch lạc, liên kết ý chặt chẽ theo tư duy tuyến tính.',
    type: 'Writing Core',
    difficulty: 'intermediate',
    estimatedMinutes: 60,
    status: 'in_progress',
    createdAt: '2026-08-20',
  },
  {
    id: 'RD-03',
    title: 'Luyện tập Speaking Part 2: Khung tư duy 4 bước',
    description: 'Xử lý tình huống bí ý tưởng khi thuyết trình chủ đề cá nhân trong 2 phút.',
    type: 'Speaking Workshop',
    difficulty: 'advanced',
    estimatedMinutes: 30,
    status: 'not_started',
    createdAt: '2026-09-01',
  },
  {
    id: 'RD-04',
    title: 'Kỹ thuật nghe bẫy Distractors trong Listening Section 3',
    description: 'Nhận diện tín hiệu chuyển ý và sự thay đổi quyết định của người đối thoại.',
    type: 'Listening Master',
    difficulty: 'advanced',
    estimatedMinutes: 40,
    status: 'not_started',
    createdAt: '2026-09-05',
  },
]
