import { apiClient } from '@/lib/axios'
import { getMock } from '@/mocks'
import type { FullIeltsExamManifest, FullExamStudentResponses } from '../types/fullExam.types'
import { cambridgeFull4SkillMock } from '../data'
import { testsMock } from '@/mocks/tests.mock'

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
   * Fetches the complete or skill-specific exam manifest by ID.
   * 🔌 WIRE: GET /api/exams/:examId
   * When BE sends the JSON manifest matching FullIeltsExamManifest,
   * FE renders only the configured skills dynamically (1 skill or all 4).
   */
  async getExamManifest(examId: string): Promise<FullIeltsExamManifest> {
    if (getMock()) {
      const foundTest = testsMock.find((t) => t.id === examId)
      if (!foundTest) {
        return cambridgeFull4SkillMock
      }

      // Single-skill: Writing
      if (foundTest.skill.toLowerCase() === 'writing') {
        return {
          id: foundTest.id,
          title: foundTest.title,
          code: `${foundTest.id}-WRITING`,
          type: 'ACADEMIC',
          mode: 'PRACTICE',
          description: foundTest.subCategory,
          skills: {
            writing: cambridgeFull4SkillMock.skills.writing,
          },
        }
      }

      // Single-skill: Reading
      if (foundTest.skill.toLowerCase() === 'reading') {
        return {
          id: foundTest.id,
          title: foundTest.title,
          code: `${foundTest.id}-READING`,
          type: 'ACADEMIC',
          mode: 'PRACTICE',
          description: foundTest.subCategory,
          skills: {
            reading: cambridgeFull4SkillMock.skills.reading,
          },
        }
      }

      // Single-skill: Listening
      if (foundTest.skill.toLowerCase() === 'listening') {
        return {
          id: foundTest.id,
          title: foundTest.title,
          code: `${foundTest.id}-LISTENING`,
          type: 'ACADEMIC',
          mode: 'PRACTICE',
          description: foundTest.subCategory,
          skills: {
            listening: cambridgeFull4SkillMock.skills.listening,
          },
        }
      }

      // Single-skill: Speaking
      if (foundTest.skill.toLowerCase() === 'speaking') {
        return {
          id: foundTest.id,
          title: foundTest.title,
          code: `${foundTest.id}-SPEAKING`,
          type: 'ACADEMIC',
          mode: 'PRACTICE',
          description: foundTest.subCategory,
          skills: {
            speaking: cambridgeFull4SkillMock.skills.speaking,
          },
        }
      }

      // Full 4-skill or multi-skill test
      return {
        ...cambridgeFull4SkillMock,
        id: foundTest.id,
        title: foundTest.title,
        code: `${foundTest.id}-FULL`,
      }
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
