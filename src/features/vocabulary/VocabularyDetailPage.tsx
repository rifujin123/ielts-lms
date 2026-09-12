import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { ChevronRight, ArrowLeft, Search, Layers } from 'lucide-react'
import { vocabularyService } from '@/services/vocabularyService'
import { VocabularyWordCard } from './components/VocabularyWordCard'
import { FlashcardModal } from './components/FlashcardModal'
import { EmptyState } from '@/shared/components'
import { queryKeys } from '@/lib/queryKeys'

type FilterTab = 'all' | 'unmastered' | 'mastered' | 'starred'

export const VocabularyDetailPage: React.FC = () => {
  const { setId } = useParams<{ setId: string }>()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 250)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false)

  // Fetch vocabulary set detail
  const { data: setDetail, isLoading: _isLoading } = useQuery({
    queryKey: queryKeys.vocabulary.detail(setId),
    queryFn: () => vocabularyService.getVocabularySetDetail(setId || 'VOCAB-01'),
    enabled: Boolean(setId),
  })

  // Mutations for optimistic updates
  const masterMutation = useMutation({
    mutationFn: (wordId: string) =>
      vocabularyService.toggleWordMastered(setId || 'VOCAB-01', wordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vocabulary.detail(setId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.vocabulary.sets() })
    },
  })

  const starMutation = useMutation({
    mutationFn: (wordId: string) =>
      vocabularyService.toggleWordStarred(setId || 'VOCAB-01', wordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vocabulary.detail(setId) })
    },
  })

  const handleToggleMaster = (wordId: string) => {
    masterMutation.mutate(wordId)
  }

  const handleToggleStar = (wordId: string) => {
    starMutation.mutate(wordId)
  }

  const words = setDetail?.words || []

  // Filter & Search computation
  const filteredWords = words.filter((w) => {
    // 1. Search matching
    const query = debouncedSearch.toLowerCase().trim()
    const matchesSearch =
      !query ||
      w.word.toLowerCase().includes(query) ||
      w.vietnameseMeaning.toLowerCase().includes(query) ||
      w.collocations.some((c) => c.toLowerCase().includes(query))

    if (!matchesSearch) return false

    // 2. Filter matching
    if (activeFilter === 'mastered') return w.isMastered
    if (activeFilter === 'unmastered') return !w.isMastered
    if (activeFilter === 'starred') return w.isStarred
    return true
  })

  const totalCount = words.length
  const masteredCount = words.filter((w) => w.isMastered).length
  const unmasteredCount = totalCount - masteredCount
  const starredCount = words.filter((w) => w.isStarred).length

  return (
    <div className="flex flex-col gap-6">
      {/* ── Breadcrumb & Top Bar ───────────────────────────────── */}
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
            <Link to="/vocabulary" className="hover:text-on-surface">
              Từ vựng
            </Link>
            <ChevronRight className="h-4 w-4 text-secondary/70" strokeWidth={2} />
            <span className="font-semibold text-on-surface line-clamp-1">
              {setDetail?.title || 'Chi tiết bộ từ'}
            </span>
          </nav>

          <div className="mt-2 flex items-center gap-3">
            <Link
              to="/vocabulary"
              className="btn-interactive inline-flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low text-secondary hover:bg-surface-container-high hover:text-on-surface transition-colors"
              title="Quay lại danh sách bộ từ"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            </Link>
            <h1 className="text-headline-lg font-bold text-on-surface">
              {setDetail?.title || 'Bộ từ vựng'}
            </h1>
          </div>
        </div>

        {/* Action Button: Flashcard Mode */}
        {words.length > 0 && (
          <button
            type="button"
            onClick={() => setIsFlashcardOpen(true)}
            className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-label-md font-semibold text-on-primary hover:bg-primary-hover shadow-xs transition-colors"
          >
            <Layers className="h-4 w-4" strokeWidth={2} />
            <span>Chế độ Flashcard</span>
          </button>
        )}
      </div>

      {/* ── Search & Filter Tabs ───────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant pb-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`btn-interactive rounded-xl px-3.5 py-1.5 text-label-sm font-semibold border transition-all ${
              activeFilter === 'all'
                ? 'border-primary bg-primary text-on-primary shadow-xs'
                : 'border-outline-variant bg-surface-container-lowest text-secondary hover:border-outline hover:text-on-surface'
            }`}
          >
            Tất cả ({totalCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('unmastered')}
            className={`btn-interactive rounded-xl px-3.5 py-1.5 text-label-sm font-semibold border transition-all ${
              activeFilter === 'unmastered'
                ? 'border-primary bg-primary text-on-primary shadow-xs'
                : 'border-outline-variant bg-surface-container-lowest text-secondary hover:border-outline hover:text-on-surface'
            }`}
          >
            Chưa thuộc ({unmasteredCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('mastered')}
            className={`btn-interactive rounded-xl px-3.5 py-1.5 text-label-sm font-semibold border transition-all ${
              activeFilter === 'mastered'
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                : 'border-outline-variant bg-surface-container-lowest text-secondary hover:border-outline hover:text-on-surface'
            }`}
          >
            Đã thuộc ({masteredCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('starred')}
            className={`btn-interactive rounded-xl px-3.5 py-1.5 text-label-sm font-semibold border transition-all ${
              activeFilter === 'starred'
                ? 'border-amber-500 bg-amber-500 text-white shadow-xs'
                : 'border-outline-variant bg-surface-container-lowest text-secondary hover:border-outline hover:text-on-surface'
            }`}
          >
            Lưu ý ({starredCount})
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[240px]">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
            strokeWidth={1.8}
          />
          <input
            type="text"
            placeholder="Tìm từ vựng hoặc nghĩa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-xl border border-outline-variant bg-surface-container-lowest pl-9 pr-4 text-body-sm placeholder:text-secondary/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
          />
        </div>
      </div>

      {/* ── Word Cards Grid ────────────────────────────────────── */}
      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filteredWords.map((word, idx) => (
            <div key={word.id} className={`animate-fade-in-up stagger-${(idx % 4) + 1}`}>
              <VocabularyWordCard
                word={word}
                onToggleMaster={handleToggleMaster}
                onToggleStar={handleToggleStar}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <EmptyState
          title="Không tìm thấy từ vựng phù hợp"
          description={
            search
              ? 'Thử tìm kiếm với từ khóa khác hoặc xóa ô tìm kiếm.'
              : 'Bộ lọc hiện tại không có từ vựng nào.'
          }
          action={
            search || activeFilter !== 'all'
              ? {
                  label: 'Xóa bộ lọc',
                  onClick: () => {
                    setSearch('')
                    setActiveFilter('all')
                  },
                }
              : undefined
          }
        />
      )}

      {/* ── Flashcard Modal ────────────────────────────────────── */}
      <FlashcardModal
        words={filteredWords.length > 0 ? filteredWords : words}
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        onToggleMaster={handleToggleMaster}
        onToggleStar={handleToggleStar}
      />
    </div>
  )
}

export default VocabularyDetailPage
