import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronRight,
  Bookmark,
  ChevronDown,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import { materialService } from '@/services/materialService'
import { booksMock } from '@/mocks/books.mock'
import { queryKeys } from '@/lib/queryKeys'

/**
 * BooksPage — Book Unit Explorer (screen 15).
 * Displays expandable units, lesson checklists, bookmarks, and reader links.
 * Line count budget: 200-300 lines.
 */
export const BooksPage: React.FC = () => {
  const navigate = useNavigate()
  const [expandedUnitId, setExpandedUnitId] = useState<string>('UNIT-01')

  const { data: books = booksMock, isLoading: _isLoading } = useQuery({
    queryKey: queryKeys.materials.books(),
    queryFn: () => materialService.getBooks(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

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
            <ChevronRight className="h-4 w-4 text-secondary/70" strokeWidth={2} />
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
            onClick={() => navigate(`/materials/reader?bookId=${currentBook?.id || 'BOOK-01'}`)}
            className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:bg-primary-hover shadow-xs transition-colors"
          >
            <BookOpen className="h-4 w-4 text-amber-400" strokeWidth={2} />
            <span>Đọc giáo trình PDF</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
              {currentBook?.totalPages || 3} trang
            </span>
          </button>
        </div>
      </div>

      {/* ── Units Accordion List ────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        {currentBook?.units.map((unit, idx) => {
          const isExpanded = expandedUnitId === unit.id
          return (
            <div
              key={unit.id}
              className={`animate-fade-in-up stagger-${(idx % 4) + 1} overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs transition-all`}
            >
              <button
                type="button"
                onClick={() => setExpandedUnitId(isExpanded ? '' : unit.id)}
                className="flex w-full items-center justify-between p-5 text-left hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low font-bold text-on-surface text-label-md">
                    {unit.number}
                  </div>
                  <div>
                    <h3 className="text-headline-sm font-bold text-on-surface">{unit.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-secondary">
                      <span>{unit.lessons.length} bài giảng</span>
                      <span>-</span>
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
                    <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500" strokeWidth={2} />
                  )}
                  <ChevronDown
                    className={`h-5 w-5 text-secondary transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    strokeWidth={2}
                  />
                </div>
              </button>

              {/* Lesson Items */}
              {isExpanded && (
                <div className="border-t border-outline-variant bg-surface-container-low/40 p-4">
                  <div className="flex flex-col gap-2.5">
                    {unit.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="card-interactive flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-3.5"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.isCompleted ? (
                            <CheckCircle2
                              className="h-5 w-5 text-tertiary shrink-0"
                              strokeWidth={2}
                            />
                          ) : (
                            <Circle className="h-5 w-5 text-secondary shrink-0" strokeWidth={2} />
                          )}
                          <div>
                            <h4 className="text-body-md font-semibold text-on-surface">
                              {lesson.title}
                            </h4>
                            <span className="text-[11px] text-secondary">
                              Thời lượng: {lesson.durationMinutes} phút
                            </span>
                          </div>
                        </div>

                        {lesson.type === 'reading' ? (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/materials/reader?bookId=${currentBook?.id || 'BOOK-01'}&unitId=${unit.id}`,
                              )
                            }
                            className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-label-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
                          >
                            <span>Đọc tài liệu</span>
                            <BookOpen className="h-3.5 w-3.5 text-amber-400" strokeWidth={2} />
                          </button>
                        ) : (
                          <Link
                            to="/exercises"
                            className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-1.5 text-label-sm font-semibold text-primary hover:bg-red-50 transition-colors"
                          >
                            <span>Học bài</span>
                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                          </Link>
                        )}
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
