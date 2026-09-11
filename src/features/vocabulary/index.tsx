import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
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
    queryKey: ['vocabulary-sets'],
    queryFn: () => vocabularyService.getVocabularySets(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  const filteredSets = (sets ?? []).filter((item) =>
    debouncedSearch ? item.title.toLowerCase().includes(debouncedSearch.toLowerCase()) : true,
  )

  const totalWords = (sets ?? []).reduce((acc, s) => acc + s.wordCount, 0)
  const totalMastered = (sets ?? []).reduce((acc, s) => acc + s.masteredCount, 0)
  const overallPercent = calcProgressPercent(totalMastered, totalWords)

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
            <span className="font-semibold text-on-surface">Từ vựng</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">Kho từ vựng học thuật</h1>
          <p className="text-body-sm text-secondary">
            Học từ vựng theo cụm và ngữ cảnh với phương pháp ghi nhớ thông minh Spaced Repetition.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-secondary">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm chủ đề từ vựng..."
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-4 text-body-sm text-on-surface focus:border-primary focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* ── Overall Vocabulary Progress Banner ─────────────────── */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
            Tiến độ ghi nhớ toàn khóa
          </span>
          <h2 className="mt-1 text-headline-md font-bold text-on-surface">
            Đã thuộc {totalMastered} / {totalWords} từ vựng
          </h2>
          <p className="text-body-sm text-secondary">
            Duy trì ôn tập 15 phút mỗi ngày để nâng cao band điểm Lexical Resource.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-headline-sm font-bold text-primary border border-primary/20">
            {overallPercent}%
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">bolt</span>
            Ôn tập nhanh
          </button>
        </div>
      </div>

      {/* ── Vocabulary Sets Grid ────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filteredSets.map((vocab) => {
          const percent = calcProgressPercent(vocab.masteredCount, vocab.wordCount)
          return (
            <div
              key={vocab.id}
              className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs hover:border-primary/40 transition-colors"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {vocab.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-surface-container-low px-2 py-0.5 text-[11px] font-semibold text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {vocab.status === 'completed' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-container px-2.5 py-0.5 text-[11px] font-bold text-on-tertiary-container">
                      <span className="material-symbols-outlined text-xs">check</span>
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
                      className="h-full bg-primary rounded-full transition-all duration-300"
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
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-label-sm font-bold text-primary hover:bg-primary/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-base">style</span>
                  Học ngay
                </button>
              </div>
            </div>
          )
        })}

        {filteredSets.length === 0 && (
          <div className="col-span-2 flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center">
            <span className="material-symbols-outlined text-5xl text-secondary/60">translate</span>
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
