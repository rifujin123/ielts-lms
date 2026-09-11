import type { OnlineTest } from '@/types/api.types'

export const testsMock: OnlineTest[] = [
  {
    id: 'TEST-01',
    title: 'Mini Mock Test #1: Reading & Listening Diagnostic',
    type: 'mini',
    skill: 'Full',
    status: 'completed',
    duration: 60,
    score: 7.0,
    completedAt: '2026-08-25',
  },
  {
    id: 'TEST-02',
    title: 'Progress Test: Academic Reading Vol 1 - 3 Passages',
    type: 'mock',
    skill: 'Reading',
    status: 'in_progress',
    duration: 60,
  },
  {
    id: 'TEST-03',
    title: 'Writing Task 2 Full Mock: Technology & Global Economy',
    type: 'mock',
    skill: 'Writing',
    status: 'pending',
    duration: 40,
  },
  {
    id: 'TEST-04',
    title: 'Listening Full Test: Cambridge IELTS Simulation 18',
    type: 'full',
    skill: 'Listening',
    status: 'pending',
    duration: 45,
  },
]
