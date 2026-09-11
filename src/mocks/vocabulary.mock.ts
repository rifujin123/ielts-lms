import type { VocabularySet } from '@/types/api.types'

export const vocabularyMock: VocabularySet[] = [
  {
    id: 'VOCAB-01',
    title: 'Topic: Climate Change & Environmental Conservation',
    wordCount: 35,
    masteredCount: 28,
    status: 'in_progress',
    lastStudied: '2026-09-09',
    tags: ['Academic Reading', 'Band 7.0+'],
  },
  {
    id: 'VOCAB-02',
    title: 'Topic: Artificial Intelligence & Future Workplace',
    wordCount: 40,
    masteredCount: 40,
    status: 'completed',
    lastStudied: '2026-09-06',
    tags: ['Writing Task 2', 'Technology'],
  },
  {
    id: 'VOCAB-03',
    title: 'Topic: Education Systems & Higher Academic Research',
    wordCount: 30,
    masteredCount: 12,
    status: 'in_progress',
    lastStudied: '2026-09-10',
    tags: ['Writing Task 2', 'Education'],
  },
  {
    id: 'VOCAB-04',
    title: 'Topic: Global Tourism & Cultural Heritage Preservations',
    wordCount: 25,
    masteredCount: 0,
    status: 'not_started',
    tags: ['Speaking Part 3', 'Culture'],
  },
]
