import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
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
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-semibold text-on-surface">Bài thi trực tuyến</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">
            Hệ thống bài thi trực tuyến
          </h1>
          <p className="text-body-sm text-secondary">
            Mô phỏng áp lực phòng thi thực tế với hệ thống tính giờ và chấm điểm tự động.
          </p>
        </div>

        {/* Type tabs */}
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-1 border border-outline-variant">
          {(['all', 'mini', 'mock', 'full'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTestType(type)}
              className={`rounded-lg px-3 py-1.5 text-label-sm font-semibold transition-colors ${
                testType === type
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              {type === 'all' && 'Tất cả'}
              {type === 'mini' && 'Mini Test'}
              {type === 'mock' && 'Skill Mock'}
              {type === 'full' && 'Full Test'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tests List ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs transition-colors hover:border-primary/40 sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold shadow-xs ${
                  test.type === 'full'
                    ? 'bg-red-100 text-primary'
                    : test.type === 'mini'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-emerald-100 text-tertiary'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {test.type === 'full' ? 'timer' : test.type === 'mini' ? 'speed' : 'quiz'}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-surface-container px-2 py-0.5 text-[11px] font-bold text-secondary uppercase">
                    {test.type}
                  </span>
                  <span className="text-[11px] text-secondary">
                    Thời gian làm bài: {test.duration} phút
                  </span>
                  <span className="rounded bg-primary-container/60 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {test.skill}
                  </span>
                </div>

                <h3 className="mt-1 text-headline-sm font-bold text-on-surface">{test.title}</h3>

                {test.score !== undefined && (
                  <div className="mt-1 inline-flex items-center gap-1 text-label-sm font-bold text-tertiary">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    Điểm thi: {test.score} / 9.0
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {test.status === 'completed' ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-label-sm font-semibold text-secondary hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-base">visibility</span>
                  Xem bảng điểm
                </button>
              ) : (
                <Link
                  to="/practice"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">play_arrow</span>
                  Bắt đầu làm bài
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
