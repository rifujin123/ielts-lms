import type { Exercise } from '@/types/api.types'

export const exercisesMock: Exercise[] = [
  {
    id: 'EX-01',
    title: 'Reading Task 1: Matching Headings - The History of Navigation',
    skill: 'Reading',
    status: 'completed',
    dueDate: '2026-09-08',
    completedAt: '2026-09-07',
    score: 9.0,
    questionCount: 14,
  },
  {
    id: 'EX-02',
    title: 'Writing Task 2: Brainstorming Linearthinking - Education vs Economy',
    skill: 'Writing',
    status: 'in_progress',
    dueDate: '2026-09-12',
    questionCount: 1,
  },
  {
    id: 'EX-03',
    title: 'Listening Section 3: Academic Discussion on Marine Biology',
    skill: 'Listening',
    status: 'pending',
    dueDate: '2026-09-15',
    questionCount: 10,
  },
  {
    id: 'EX-04',
    title: 'Speaking Part 2: Describe a memorable journey you took by public transport',
    skill: 'Speaking',
    status: 'pending',
    dueDate: '2026-09-16',
    questionCount: 4,
  },
  {
    id: 'EX-05',
    title: 'Reading Task 2: Multiple Choice - Climate Change Solutions',
    skill: 'Reading',
    status: 'completed',
    dueDate: '2026-09-05',
    completedAt: '2026-09-04',
    score: 8.5,
    questionCount: 13,
  },
]
