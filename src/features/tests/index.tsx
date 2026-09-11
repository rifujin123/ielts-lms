import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Timer, Gauge, ClipboardCheck, Award, Eye, Play } from 'lucide-react'
import { testService } from '@/services/testService'
import type { TestType } from '@/types/api.types'
import { testsMock } from '@/mocks/tests.mock'

/**
 * TestsPage — Online Tests & Mock Exams (screen 12).
 * Allows students to filter tests by type, duration, and test status.
 * Line count budget: 200-300 lines.
 */
export const TestsPage: React.FC = () => {
  const [testType, setTestType] = useState<'all' | TestType>('all')

  const { data: tests = testsMock, isLoading: _isLoading } = useQuery({
    queryKey: ['online-tests'],
    queryFn: () => testService.getOnlineTests(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  const filteredTests = (tests ?? []).filter((test) =>
    testType === 'all' ? true : test.type === testType,
  )

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-body-sm text-secondary"
          >
            <Link to="/" className="hover:text-on-surface">
              Khóa học
            </Link>
            <ChevronRight className="h-4 w-4 text-secondary/70" strokeWidth={2} />
            <span className="font-semibold text-on-surface">Kiểm tra trực tuyến</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">Bài test & Thi thử</h1>
          <p className="text-body-sm text-secondary">
            Tổng hợp các bài Full Test, Mini Test và Mock test theo chuẩn Cambridge IELTS.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-1 border border-outline-variant">
          {(['all', 'full', 'mini', 'mock'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTestType(type)}
              className={`btn-interactive rounded-lg px-3 py-1.5 text-label-sm font-semibold transition-colors ${
                testType === type
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              {type === 'all' && 'Tất cả bài test'}
              {type === 'full' && 'Full Test'}
              {type === 'mini' && 'Mini Test'}
              {type === 'mock' && 'Skill Mock'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Test Cards List ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {filteredTests.map((test, idx) => (
          <div
            key={test.id}
            className={`animate-fade-in-up stagger-${(idx % 4) + 1} card-interactive flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs sm:flex-row sm:items-center`}
          >
            <div className="flex items-start gap-4">
              {/* Type icon avatar */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs ${
                  test.type === 'full'
                    ? 'bg-red-100 text-primary'
                    : test.type === 'mini'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-emerald-100 text-tertiary'
                }`}
              >
                {test.type === 'full' ? (
                  <Timer className="h-6 w-6" strokeWidth={2} />
                ) : test.type === 'mini' ? (
                  <Gauge className="h-6 w-6" strokeWidth={2} />
                ) : (
                  <ClipboardCheck className="h-6 w-6" strokeWidth={2} />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-tag animate-pop-in">{test.type}</span>
                  <span className="text-[11px] text-secondary">
                    Thời gian làm bài: {test.duration} phút
                  </span>
                  <span className="badge-minimal">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    {test.skill}
                  </span>
                </div>

                <h3 className="mt-1 text-headline-sm font-bold text-on-surface">{test.title}</h3>

                {test.score !== undefined && (
                  <div className="mt-1 inline-flex items-center gap-1 text-label-sm font-bold text-tertiary">
                    <Award className="h-4 w-4" strokeWidth={2} />
                    Điểm thi: {test.score} / 9.0
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {test.status === 'completed' ? (
                <Link
                  to={`/exam/${test.id}`}
                  className="btn-interactive inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-label-sm font-semibold text-secondary hover:bg-surface-container transition-colors"
                >
                  <Eye className="h-4 w-4" strokeWidth={2} />
                  Xem kết quả & Dẫn chứng
                </Link>
              ) : (
                <Link
                  to={`/exam/${test.id}`}
                  className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
                >
                  <Play className="h-4 w-4" strokeWidth={2} />
                  Vào thi CBT trực tuyến
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestsPage
