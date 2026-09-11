/**
 * Centralized Mock Data Registry for IELTS Exam Runner
 *
 * All mock manifests, question pools, and teacher rubric fixtures
 * are isolated here, completely decoupled from presentation components.
 *
 * When connecting to live microservices:
 * 1. Keep these mock fixtures as reliable fallbacks in `ieltsExamService.ts`.
 * 2. Toggle `VITE_USE_MOCK=false` in `.env` to fetch live responses from the API.
 */

export { cambridgeFull4SkillMock } from './cambridgeFull4SkillMock'
export { cambridgeAcademicMock18 } from './cambridgeMock18'
export { mockTeacherAssessment } from './mockTeacherRubric'
