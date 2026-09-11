import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import type { FullIeltsExamManifest, FullExamStudentResponses } from '../types/fullExam.types'
import { cambridgeFull4SkillMock } from '../data/cambridgeFull4SkillMock'

export interface ExamSubmissionResult {
  success: boolean
  examId: string
  submittedAt: string
  scores?: {
    listeningScore?: number
    readingScore?: number
    overallBand?: number
  }
  message: string
}

export const ieltsExamService = {
  /**
   * Fetches the complete 4-skill exam manifest by ID.
   * 🔌 WIRE: GET /api/exams/:examId
   * When BE sends the JSON manifest matching FullIeltsExamManifest,
   * the FE will automatically render all 4 skills dynamically.
   */
  async getExamManifest(examId: string): Promise<FullIeltsExamManifest> {
    if (getMock()) {
      return cambridgeFull4SkillMock
    }
    const { data } = await apiClient.get<FullIeltsExamManifest>(`/exams/${examId}`)
    return data
  },

  /**
   * Submits student responses across any or all 4 skills.
   * 🔌 WIRE: POST /api/exams/:examId/submit
   */
  async submitExam(
    examId: string,
    submission: FullExamStudentResponses,
  ): Promise<ExamSubmissionResult> {
    if (getMock()) {
      return {
        success: true,
        examId,
        submittedAt: new Date().toISOString(),
        scores: {
          listeningScore: 7.5,
          readingScore: 8.0,
          overallBand: 7.5,
        },
        message: 'Bài thi IELTS 4 kỹ năng đã được nộp và lưu trữ thành công trên hệ thống.',
      }
    }
    const { data } = await apiClient.post<ExamSubmissionResult>(
      `/exams/${examId}/submit`,
      submission,
    )
    return data
  },
}
