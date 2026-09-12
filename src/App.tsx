import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/shared/layouts/AppLayout'
import { PageLoader } from '@/shared/components/PageLoader'
import { GlobalErrorBoundary } from '@/shared/components/ErrorBoundary'
import { GlobalErrorHandler } from '@/shared/providers/GlobalErrorHandler'

// ── Lazy-loaded feature pages ─────────────────────────────────────
// Each feature is code-split at the route level for lean bundles.

const CourseInfoPage = lazy(() => import('@/features/course-info'))
const DashboardPage = lazy(() => import('@/features/dashboard'))
const RoadmapPage = lazy(() => import('@/features/roadmap'))
const PersonalRoadmapPage = lazy(() =>
  import('@/features/roadmap').then((m) => ({ default: m.PersonalRoadmapPage })),
)
const ExercisesPage = lazy(() => import('@/features/exercises'))
const VocabularyPage = lazy(() => import('@/features/vocabulary'))
const VocabularyDetailPage = lazy(() =>
  import('@/features/vocabulary').then((m) => ({ default: m.VocabularyDetailPage })),
)
const MaterialsPage = lazy(() => import('@/features/materials'))
const BooksPage = lazy(() => import('@/features/materials').then((m) => ({ default: m.BooksPage })))
const PdfReaderPage = lazy(() =>
  import('@/features/materials').then((m) => ({ default: m.PdfReaderPage })),
)
const HomeworkPage = lazy(() => import('@/features/homework'))
const FinalTestPage = lazy(() => import('@/features/final-test'))
const TestsPage = lazy(() => import('@/features/tests'))
const ClassroomPage = lazy(() => import('@/features/classroom'))
const AttendancePage = lazy(() =>
  import('@/features/classroom').then((m) => ({ default: m.AttendancePage })),
)
const ExamRunnerPage = lazy(() => import('@/features/exam-runner'))
const DictationPage = lazy(() => import('@/features/dictation'))
const TopicsPage = lazy(() => import('@/features/topics'))
const ProfilePage = lazy(() => import('@/features/profile'))
const MistakeLogPage = lazy(() => import('@/features/mistake-log'))

/**
 * App — root router tree.
 * Wrapped with GlobalErrorBoundary and GlobalErrorHandler.
 * All feature routes are children of AppLayout (header + sidebar shell).
 * Suspense boundary at this level handles lazy-load fallbacks.
 */
export default function App() {
  return (
    <GlobalErrorBoundary>
      <GlobalErrorHandler>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                {/* ── Course Info (ROOT) ── screen 16 */}
                <Route index element={<CourseInfoPage />} />

                {/* ── Dashboard ── screen 02 */}
                <Route path="dashboard" element={<DashboardPage />} />

                {/* ── Roadmap ── screens 03, 08 */}
                <Route path="roadmap" element={<RoadmapPage />} />
                <Route path="roadmap/personal" element={<PersonalRoadmapPage />} />

                {/* ── Exercises ── screens 01, 09 */}
                <Route path="exercises" element={<ExercisesPage />} />

                {/* ── Vocabulary ── screens 04, 11 */}
                <Route path="vocabulary" element={<VocabularyPage />} />
                <Route path="vocabulary/:setId" element={<VocabularyDetailPage />} />

                {/* ── Materials ── screens 05, 15 */}
                <Route path="materials" element={<MaterialsPage />} />
                <Route path="materials/books" element={<BooksPage />} />
                <Route path="materials/reader" element={<PdfReaderPage />} />

                {/* ── Homework / Syllabus ── screen 07 */}
                <Route path="homework" element={<HomeworkPage />} />

                {/* ── Final Test ── screen 06 */}
                <Route path="final-test" element={<FinalTestPage />} />

                {/* ── Online Tests ── screen 12 */}
                <Route path="tests" element={<TestsPage />} />

                {/* ── Classroom & Attendance ── screens 13, 14 */}
                <Route path="classroom" element={<ClassroomPage />} />
                <Route path="attendance" element={<AttendancePage />} />

                {/* ── Topics & Video Dictation (Movie Short Clips) ── */}
                <Route path="topics" element={<TopicsPage />} />
                <Route path="topics/dictation/:lessonId" element={<DictationPage />} />
                <Route path="topics/dictation" element={<DictationPage />} />
                <Route path="dictation" element={<DictationPage />} />
                <Route path="dictation/:lessonId" element={<DictationPage />} />

                {/* ── Computer-Based Exam Runner (CBT) ── */}
                <Route path="exam" element={<ExamRunnerPage />} />
                <Route path="exam/:testId" element={<ExamRunnerPage />} />

                {/* ── Student Profile & Account Settings ── */}
                <Route path="profile" element={<ProfilePage />} />

                {/* ── Personal Mistake Log & Trap Analytics (Epic 4) ── */}
                <Route path="mistake-log" element={<MistakeLogPage />} />
                <Route path="error-log" element={<MistakeLogPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </GlobalErrorHandler>
    </GlobalErrorBoundary>
  )
}
