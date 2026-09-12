import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { ChevronRight, Search, Zap, Layers, BookOpen, BookMarked } from 'lucide-react'
import { vocabularyService } from '@/services/vocabularyService'
import { calcProgressPercent } from '@/lib/utils'
import { vocabularyMock } from '@/mocks/vocabulary.mock'
import { PersonalWordBank } from './components/PersonalWordBank'
import { EmptyState, NavigationTabs, ProgressBar } from '@/shared/components'

/**
 * VocabularyPage — Vocabulary Sets & Flashcards (screens 04, 11).
 * Shows word lists, mastery percentage, tags, and quick-study actions.
 *
 * Line count budget: 200-300 lines.
 */
export const VocabularyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') === 'personal' ? 'personal' : 'curriculum'

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  const { data: sets = vocabularyMock, isLoading: _isLoading } = useQuery({
    queryKey: ['vocabulary-sets', debouncedSearch],
    queryFn: () => vocabularyService.getVocabularySets(),
  })

  const filteredSets = (sets ?? []).filter((s) =>
    s.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  const handleTabChange = (tab: 'curriculum' | 'personal') => {
    if (tab === 'personal') {
      setSearchParams({ tab: 'personal' })
    } else {
      setSearchParams({})
    }
  }

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
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">
            {activeTab === 'personal' ? 'Sổ từ vựng cá nhân' : 'Từ vựng & Thuật ngữ'}
          </h1>
          <p className="text-body-sm text-secondary">
            {activeTab === 'personal'
              ? 'Kho từ vựng tích lũy từ bài thi Reading, Listening, Dictation và bài viết Writing.'
              : 'Phương pháp học từ vựng theo cụm chủ đề kết hợp Spaced Repetition (Lặp lại ngắt quãng).'}
          </p>
        </div>

        {/* Action Button */}
        {activeTab === 'curriculum' && (
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

            <button
              type="button"
              onClick={() => handleTabChange('personal')}
              className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-label-md font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs cursor-pointer"
            >
              <Zap className="h-4 w-4" strokeWidth={2} />
              Sổ từ vựng & Flashcard
            </button>
          </div>
        )}
      </div>

      {/* ── Navigation Tabs (0px Shift) ── */}
      <NavigationTabs
        tabs={[
          {
            id: 'curriculum',
            label: 'Bộ từ giáo trình',
            icon: BookOpen,
            count: `${sets.length} chủ đề`,
          },
          { id: 'personal', label: 'Sổ từ vựng của tôi', icon: BookMarked },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => handleTabChange(tabId as 'curriculum' | 'personal')}
      />

      {/* ── Tab Content ── */}
      {activeTab === 'personal' ? (
        <PersonalWordBank />
      ) : (
        <>
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
                <div className="text-[11px] font-semibold text-secondary uppercase">
                  Tiến độ chung
                </div>
              </div>
              <div className="h-10 w-px bg-outline-variant" />
              <div className="text-center">
                <div className="text-headline-md font-black text-tertiary">3 / 8</div>
                <div className="text-[11px] font-semibold text-secondary uppercase">
                  Bộ đã thuộc
                </div>
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

                    <Link to={`/vocabulary/${vocab.id}`} className="block">
                      <h3 className="mt-3 text-headline-sm font-bold text-on-surface hover:text-primary transition-colors">
                        {vocab.title}
                      </h3>
                    </Link>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="mb-1.5 flex justify-between text-body-sm">
                        <span className="text-secondary">
                          Đã thuộc {vocab.masteredCount} / {vocab.wordCount} từ
                        </span>
                        <span className="font-bold text-primary">{percent}%</span>
                      </div>
                      <ProgressBar value={percent} size="sm" variant="primary" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4">
                    <span className="text-[11px] text-secondary">
                      {vocab.lastStudied ? `Học gần nhất: ${vocab.lastStudied}` : 'Chưa bắt đầu'}
                    </span>
                    <Link
                      to={`/vocabulary/${vocab.id}`}
                      className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-label-sm font-bold text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Layers className="h-4 w-4" strokeWidth={2} />
                      Học ngay
                    </Link>
                  </div>
                </div>
              )
            })}

            {filteredSets.length === 0 && (
              <div className="col-span-2">
                <EmptyState
                  title="Không tìm thấy bộ từ vựng"
                  description="Thử tìm kiếm với từ khóa khác."
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export { VocabularyDetailPage } from './VocabularyDetailPage'
export default VocabularyPage
