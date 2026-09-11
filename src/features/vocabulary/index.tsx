import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { ChevronRight, Search, Zap, Layers, SearchX } from 'lucide-react'
import { vocabularyService } from '@/services/vocabularyService'
import { calcProgressPercent } from '@/lib/utils'
import { vocabularyMock } from '@/mocks/vocabulary.mock'

/**
 * VocabularyPage — Vocabulary Sets & Flashcards (screens 04, 11).
 * Shows word lists, mastery percentage, tags, and quick-study actions.
 *
 * Line count budget: 200-300 lines.
 */
export const VocabularyPage: React.FC = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  const { data: sets = vocabularyMock, isLoading: _isLoading } = useQuery({
    queryKey: ['vocabulary-sets', debouncedSearch],
    queryFn: () => vocabularyService.getVocabularySets(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  const filteredSets = (sets ?? []).filter((s) =>
    s.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
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
            <span className="font-semibold text-on-surface">Từ vựng</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">Từ vựng & Thuật ngữ</h1>
          <p className="text-body-sm text-secondary">
            Phương pháp học từ vựng theo cụm chủ đề kết hợp Spaced Repetition (Lặp lại ngắt quãng).
          </p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
              strokeWidth={1.8}
            />
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề từ vựng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl border border-outline-variant bg-surface-container-lowest pl-9 pr-4 text-body-sm placeholder:text-secondary/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            />
          </div>

          <Link
            to="/practice"
            className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-label-md font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
          >
            <Zap className="h-4 w-4" strokeWidth={2} />
            Ôn tập nhanh
          </Link>
        </div>
      </div>

      {/* ── Quick Stats Banner ──────────────────────────────────── */}
      <div className="animate-fade-in-up flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-6">
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">Tổng quan ghi nhớ</h2>
          <p className="text-body-sm text-secondary">
            Bạn đã làm chủ 240 / 600 từ vựng cốt lõi của khóa học này.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-headline-md font-black text-primary">40%</div>
            <div className="text-[11px] font-semibold text-secondary uppercase">Tiến độ chung</div>
          </div>
          <div className="h-10 w-px bg-outline-variant" />
          <div className="text-center">
            <div className="text-headline-md font-black text-tertiary">3 / 8</div>
            <div className="text-[11px] font-semibold text-secondary uppercase">Bộ đã thuộc</div>
          </div>
        </div>
      </div>

      {/* ── Vocabulary Sets Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredSets.map((vocab, idx) => {
          const percent = calcProgressPercent(vocab.masteredCount, vocab.wordCount)
          return (
            <div
              key={vocab.id}
              className={`animate-fade-in-up stagger-${(idx % 4) + 1} card-interactive flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-colors`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {vocab.tags.map((tag) => (
                      <span key={tag} className="badge-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {vocab.status === 'completed' && (
                    <span className="badge-minimal animate-pop-in">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Đã thuộc
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-headline-sm font-bold text-on-surface">{vocab.title}</h3>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-secondary">
                      Đã thuộc {vocab.masteredCount} / {vocab.wordCount} từ
                    </span>
                    <span className="font-bold text-primary">{percent}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-container">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4">
                <span className="text-[11px] text-secondary">
                  {vocab.lastStudied ? `Học gần nhất: ${vocab.lastStudied}` : 'Chưa bắt đầu'}
                </span>
                <button
                  type="button"
                  className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-label-sm font-bold text-primary hover:bg-primary/20 transition-colors"
                >
                  <Layers className="h-4 w-4" strokeWidth={2} />
                  Học ngay
                </button>
              </div>
            </div>
          )
        })}

        {filteredSets.length === 0 && (
          <div className="animate-fade-in-up col-span-2 flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center">
            <SearchX className="h-12 w-12 text-secondary/60" strokeWidth={1.5} />
            <h3 className="mt-3 text-headline-sm font-bold text-on-surface">
              Không tìm thấy bộ từ vựng
            </h3>
            <p className="mt-1 text-body-sm text-secondary">Thử tìm kiếm với từ khóa khác.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VocabularyPage
