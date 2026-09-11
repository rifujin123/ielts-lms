import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { homeworkService } from '@/services/homeworkService'
import { PageLoader } from '@/shared/components/PageLoader'

/**
 * HomeworkPage — Homework Assignments & Syllabus (screen 07).
 * Shows homework submissions, due dates, scores, and syllabus overview.
 * Line count budget: 200-300 lines.
 */
export const HomeworkPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'homework' | 'syllabus'>('homework')

  const { data: homeworkList, isLoading } = useQuery({
    queryKey: ['homework-list'],
    queryFn: () => homeworkService.getHomeworkList(),
  })

  if (isLoading) return <PageLoader />

  const syllabusUnits = [
    {
      session: 'Buổi 1 - 4',
      focus: 'Reading Foundations',
      desc: 'Phương pháp nhận diện liên kết câu và cấu trúc tư duy',
    },
    {
      session: 'Buổi 5 - 8',
      focus: 'Writing Task 2 Logic',
      desc: 'Cách xây dựng luận điểm và lập dàn ý theo Linearthinking',
    },
    {
      session: 'Buổi 9 - 12',
      focus: 'Listening & Speaking',
      desc: 'Bẫy phát âm trong hội thoại học thuật và phản xạ ý',
    },
  ]

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
            <span className="font-semibold text-on-surface">Bài tập về nhà</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">
            Bài tập về nhà & Giáo trình
          </h1>
          <p className="text-body-sm text-secondary">
            Nộp bài tập định kỳ để giảng viên nhận xét chi tiết và chấm điểm trước mỗi buổi học.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-1 border border-outline-variant">
          <button
            type="button"
            onClick={() => setActiveTab('homework')}
            className={`rounded-lg px-4 py-1.5 text-label-sm font-semibold transition-colors ${
              activeTab === 'homework'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Bài tập về nhà
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('syllabus')}
            className={`rounded-lg px-4 py-1.5 text-label-sm font-semibold transition-colors ${
              activeTab === 'syllabus'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Khung giáo trình
          </button>
        </div>
      </div>

      {/* ── Main Content Area ───────────────────────────────────── */}
      {activeTab === 'homework' ? (
        <div className="grid grid-cols-1 gap-4">
          {(homeworkList ?? []).map((hw) => (
            <div
              key={hw.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs sm:flex-row sm:items-center"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    hw.status === 'submitted'
                      ? 'bg-tertiary-container text-tertiary'
                      : 'bg-primary-container text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {hw.status === 'submitted' ? 'task_alt' : 'pending_actions'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-surface-container px-2 py-0.5 text-[11px] font-bold text-secondary uppercase">
                      {hw.practiceCount} bài thực hành
                    </span>
                    {hw.dueDate && (
                      <span className="text-[11px] font-medium text-amber-700">
                        Hạn nộp: {hw.dueDate}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 text-headline-sm font-bold text-on-surface">{hw.title}</h3>

                  {hw.score !== undefined && (
                    <span className="mt-1 inline-flex items-center gap-1 text-label-sm font-bold text-tertiary">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Điểm: {hw.score} / 9.0
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                {hw.status === 'submitted' ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-label-sm font-semibold text-secondary hover:bg-surface-container"
                  >
                    Xem bài đã nộp
                  </button>
                ) : (
                  <Link
                    to="/practice"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary hover:bg-primary-hover shadow-xs"
                  >
                    <span className="material-symbols-outlined text-base">upload_file</span>
                    Nộp bài tập
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {syllabusUnits.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-label-md font-bold text-on-primary">
                {idx + 1}
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  {item.session}
                </span>
                <h3 className="text-headline-sm font-bold text-on-surface">{item.focus}</h3>
                <p className="mt-1 text-body-sm text-secondary">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HomeworkPage
