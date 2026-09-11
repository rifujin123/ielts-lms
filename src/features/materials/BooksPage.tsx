import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { materialService } from '@/services/materialService'
import { PageLoader } from '@/shared/components/PageLoader'

/**
 * BooksPage — Book Unit Explorer (screen 15).
 * Displays expandable units, lesson checklists, bookmarks, and reader links.
 * Line count budget: 200-300 lines.
 */
export const BooksPage: React.FC = () => {
  const [expandedUnitId, setExpandedUnitId] = useState<string>('UNIT-01')

  const { data: books, isLoading } = useQuery({
    queryKey: ['course-books'],
    queryFn: () => materialService.getBooks(),
  })

  if (isLoading) return <PageLoader />

  const currentBook = books?.[0]

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-body-sm text-secondary"
          >
            <Link to="/materials" className="hover:text-on-surface">
              Tài liệu
            </Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-semibold text-on-surface">Khám phá Units</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">
            {currentBook?.title ?? 'Giáo trình chi tiết'}
          </h1>
          <p className="text-body-sm text-secondary">{currentBook?.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container shadow-xs"
          >
            <span className="material-symbols-outlined text-base">bookmark</span>
            Bài đã lưu
          </button>
        </div>
      </div>

      {/* ── Units Accordion List ────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {currentBook?.units.map((unit) => {
          const isExpanded = expandedUnitId === unit.id
          return (
            <div
              key={unit.id}
              className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedUnitId(isExpanded ? '' : unit.id)}
                className="flex w-full items-center justify-between p-5 text-left hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${
                      unit.status === 'completed'
                        ? 'bg-tertiary-container text-tertiary'
                        : unit.status === 'in_progress'
                          ? 'bg-primary-container text-primary'
                          : 'bg-surface-container text-secondary'
                    }`}
                  >
                    {unit.number}
                  </div>
                  <div>
                    <h3 className="text-headline-sm font-bold text-on-surface">{unit.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-secondary">
                      <span>{unit.lessons.length} bài giảng</span>
                      <span>•</span>
                      <span className="capitalize">
                        {unit.status === 'completed'
                          ? 'Đã hoàn thành'
                          : unit.status === 'in_progress'
                            ? 'Đang học'
                            : 'Sắp tới'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {unit.isBookmarked && (
                    <span className="material-symbols-outlined text-amber-500 text-lg">
                      bookmark
                    </span>
                  )}
                  <span
                    className={`material-symbols-outlined text-xl text-secondary transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </div>
              </button>

              {/* Lesson Items */}
              {isExpanded && (
                <div className="border-t border-outline-variant bg-surface-container-low/40 p-4">
                  <div className="flex flex-col gap-2.5">
                    {unit.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-3.5"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`material-symbols-outlined text-xl ${
                              lesson.isCompleted ? 'text-tertiary' : 'text-secondary'
                            }`}
                          >
                            {lesson.isCompleted ? 'check_circle' : 'radio_button_unchecked'}
                          </span>
                          <div>
                            <h4 className="text-body-md font-semibold text-on-surface">
                              {lesson.title}
                            </h4>
                            <span className="text-[11px] text-secondary">
                              Thời lượng: {lesson.durationMinutes} phút
                            </span>
                          </div>
                        </div>

                        <Link
                          to="/practice"
                          className="inline-flex items-center gap-1 rounded-lg bg-surface-container-low px-3 py-1.5 text-label-sm font-semibold text-primary hover:bg-red-50 transition-colors"
                        >
                          Học bài
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BooksPage
