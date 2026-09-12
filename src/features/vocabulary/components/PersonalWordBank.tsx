import React, { useEffect, useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Star,
  BookMarked,
  CheckCircle2,
  Clock,
  AlertCircle,
  Repeat,
} from 'lucide-react'
import { personalVocabService } from '@/services/personalVocabService'
import type {
  PersonalWordEntry,
  WordMastery,
  VocabSourceSkill,
  CreatePersonalWordPayload,
} from '@/types/personalVocab.types'
import type { VocabularyWord } from '@/types/api.types'
import { toast } from '@/shared/components/Toast/toastStore'
import { PersonalWordCard } from './PersonalWordCard'
import { AddPersonalWordModal } from './AddPersonalWordModal'
import { FlashcardModal } from './FlashcardModal'

export const PersonalWordBank: React.FC = () => {
  const [words, setWords] = useState<PersonalWordEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [masteryFilter, setMasteryFilter] = useState<'all' | WordMastery | 'starred'>('all')
  const [sourceFilter, setSourceFilter] = useState<'all' | VocabSourceSkill>('all')

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false)

  const loadWords = async () => {
    try {
      const data = await personalVocabService.getWords()
      setWords(data)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWords()
  }, [])

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    } else {
      toast.info('Trình duyệt không hỗ trợ phát âm tự động')
    }
  }

  const handleToggleMastery = async (id: string, current: WordMastery) => {
    const nextMap: Record<WordMastery, WordMastery> = {
      needs_review: 'learning',
      learning: 'mastered',
      mastered: 'needs_review',
    }
    const next = nextMap[current]
    await personalVocabService.updateMastery(id, next)
    setWords((prev) => prev.map((w) => (w.id === id ? { ...w, masteryStatus: next } : w)))
    toast.success(
      next === 'mastered'
        ? 'Đã đánh dấu thuộc từ vựng này!'
        : next === 'learning'
          ? 'Đang ghi nhớ từ vựng'
          : 'Đã đưa vào danh sách cần ôn tập gấp',
    )
  }

  const handleToggleStar = async (id: string) => {
    const isStarred = await personalVocabService.toggleStar(id)
    setWords((prev) => prev.map((w) => (w.id === id ? { ...w, isStarred } : w)))
  }

  const handleDeleteWord = async (id: string) => {
    await personalVocabService.deleteWord(id)
    setWords((prev) => prev.filter((w) => w.id !== id))
    toast.info('Đã xóa từ khỏi sổ từ vựng cá nhân')
  }

  const handleAddWord = async (payload: CreatePersonalWordPayload) => {
    const created = await personalVocabService.addWord(payload)
    setWords((prev) => [created, ...prev])
    toast.success(`Đã lưu "${created.word}" vào sổ từ vựng!`)
  }

  // Filter logic
  const filteredWords = useMemo(() => {
    return words.filter((item) => {
      const query = search.toLowerCase()
      const matchesSearch =
        item.word.toLowerCase().includes(query) ||
        item.meaningVi.toLowerCase().includes(query) ||
        item.contextSentence.toLowerCase().includes(query) ||
        (item.collocations && item.collocations.some((c) => c.toLowerCase().includes(query)))

      if (!matchesSearch) return false

      if (masteryFilter === 'starred') {
        if (!item.isStarred) return false
      } else if (masteryFilter !== 'all') {
        if (item.masteryStatus !== masteryFilter) return false
      }

      if (sourceFilter !== 'all') {
        if (item.sourceSkill !== sourceFilter) return false
      }

      return true
    })
  }, [words, search, masteryFilter, sourceFilter])

  // Map personal words to VocabularyWord for the curriculum FlashcardModal
  const flashcardWords: VocabularyWord[] = useMemo(() => {
    return filteredWords.map((pw) => ({
      id: pw.id,
      setId: 'personal',
      word: pw.word,
      phonetic: pw.phonetic,
      partOfSpeech: pw.partOfSpeech === 'phrasal_verb' ? 'phrase' : pw.partOfSpeech,
      vietnameseMeaning: pw.meaningVi,
      englishDefinition: pw.personalNote,
      exampleSentence: pw.contextSentence,
      highlightWord: pw.word,
      collocations: pw.collocations || [],
      bandTarget: pw.sourceReference || 'Sổ từ cá nhân',
      isMastered: pw.masteryStatus === 'mastered',
      isStarred: !!pw.isStarred,
    }))
  }, [filteredWords])

  const handleToggleMasterFromFlashcard = async (wordId: string) => {
    const item = words.find((w) => w.id === wordId)
    if (!item) return
    const nextStatus: WordMastery = item.masteryStatus === 'mastered' ? 'needs_review' : 'mastered'
    await personalVocabService.updateMastery(wordId, nextStatus)
    setWords((prev) => prev.map((w) => (w.id === wordId ? { ...w, masteryStatus: nextStatus } : w)))
  }

  // Stats
  const stats = useMemo(() => {
    const total = words.length
    const needsReview = words.filter((w) => w.masteryStatus === 'needs_review').length
    const learning = words.filter((w) => w.masteryStatus === 'learning').length
    const mastered = words.filter((w) => w.masteryStatus === 'mastered').length
    return { total, needsReview, learning, mastered }
  }, [words])

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* ── Summary Stats ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-label-xs font-semibold text-secondary uppercase tracking-wider">
              Tổng từ trong sổ
            </span>
            <div className="text-headline-md font-bold text-on-surface mt-1">{stats.total}</div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container text-primary">
            <BookMarked className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>

        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-label-xs font-semibold text-secondary uppercase tracking-wider">
              Cần ôn gấp
            </span>
            <div className="text-headline-md font-bold text-error mt-1">{stats.needsReview}</div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error-container/40 text-error">
            <AlertCircle className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>

        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-label-xs font-semibold text-secondary uppercase tracking-wider">
              Đang nhớ
            </span>
            <div className="text-headline-md font-bold text-amber-500 mt-1">{stats.learning}</div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>

        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-label-xs font-semibold text-secondary uppercase tracking-wider">
              Đã làm chủ
            </span>
            <div className="text-headline-md font-bold text-tertiary mt-1">{stats.mastered}</div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary-container/30 text-tertiary">
            <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* ── Toolbar: Search & Action Buttons ── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
            strokeWidth={1.8}
          />
          <input
            type="text"
            placeholder="Tìm từ vựng, nghĩa tiếng Việt, câu ngữ cảnh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest pl-10 pr-4 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {filteredWords.length > 0 && (
            <button
              type="button"
              onClick={() => setIsFlashcardOpen(true)}
              className="btn-interactive flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-label-sm font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <Repeat className="h-4 w-4" strokeWidth={2} />
              Luyện Flashcard ({filteredWords.length})
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn-interactive flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-label-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" strokeWidth={2.2} />
            Thêm từ mới
          </button>
        </div>
      </div>

      {/* ── Filter Pills (0px Layout Shift) ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-label-xs font-semibold text-secondary mr-1">Trạng thái:</div>
        <button
          type="button"
          onClick={() => setMasteryFilter('all')}
          className={`rounded-full px-3 py-1 text-label-xs font-semibold transition-colors duration-150 cursor-pointer border ${
            masteryFilter === 'all'
              ? 'border-primary bg-primary text-white'
              : 'border-outline-variant bg-surface-container-lowest text-secondary hover:bg-surface-container'
          }`}
        >
          Tất cả ({words.length})
        </button>

        <button
          type="button"
          onClick={() => setMasteryFilter('needs_review')}
          className={`rounded-full px-3 py-1 text-label-xs font-semibold transition-colors duration-150 cursor-pointer border ${
            masteryFilter === 'needs_review'
              ? 'border-error bg-error text-white'
              : 'border-outline-variant bg-surface-container-lowest text-secondary hover:bg-surface-container'
          }`}
        >
          Cần ôn ({stats.needsReview})
        </button>

        <button
          type="button"
          onClick={() => setMasteryFilter('learning')}
          className={`rounded-full px-3 py-1 text-label-xs font-semibold transition-colors duration-150 cursor-pointer border ${
            masteryFilter === 'learning'
              ? 'border-amber-500 bg-amber-500 text-white'
              : 'border-outline-variant bg-surface-container-lowest text-secondary hover:bg-surface-container'
          }`}
        >
          Đang nhớ ({stats.learning})
        </button>

        <button
          type="button"
          onClick={() => setMasteryFilter('mastered')}
          className={`rounded-full px-3 py-1 text-label-xs font-semibold transition-colors duration-150 cursor-pointer border ${
            masteryFilter === 'mastered'
              ? 'border-tertiary bg-tertiary text-white'
              : 'border-outline-variant bg-surface-container-lowest text-secondary hover:bg-surface-container'
          }`}
        >
          Đã thuộc ({stats.mastered})
        </button>

        <button
          type="button"
          onClick={() => setMasteryFilter('starred')}
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-label-xs font-semibold transition-colors duration-150 cursor-pointer border ${
            masteryFilter === 'starred'
              ? 'border-amber-400 bg-amber-400 text-slate-900'
              : 'border-outline-variant bg-surface-container-lowest text-secondary hover:bg-surface-container'
          }`}
        >
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          Đã gắn sao ({words.filter((w) => w.isStarred).length})
        </button>

        <div className="h-4 w-px bg-outline-variant mx-1" />

        <div className="text-label-xs font-semibold text-secondary mr-1">Nguồn:</div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as 'all' | VocabSourceSkill)}
          className="rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-1 text-label-xs font-semibold text-secondary focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="all">Tất cả kỹ năng</option>
          <option value="reading">Reading Exam</option>
          <option value="listening">Listening</option>
          <option value="dictation">Video Dictation</option>
          <option value="writing">Sửa Writing</option>
          <option value="manual">Tự tích lũy</option>
        </select>
      </div>

      {/* ── Word Cards ── */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filteredWords.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-12 text-center">
          <BookMarked className="h-12 w-12 text-secondary/40 mb-3" strokeWidth={1.5} />
          <h3 className="text-title-md font-bold text-on-surface">Chưa có từ vựng nào phù hợp</h3>
          <p className="text-body-sm text-secondary mt-1 max-w-sm">
            Bấm "Thêm từ mới" để bắt đầu tích lũy kho từ vựng cá nhân trong quá trình làm bài thi
            IELTS!
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-label-sm font-semibold text-white hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Thêm từ đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWords.map((item) => (
            <PersonalWordCard
              key={item.id}
              item={item}
              onSpeak={speakWord}
              onToggleStar={handleToggleStar}
              onToggleMastery={handleToggleMastery}
              onDelete={handleDeleteWord}
            />
          ))}
        </div>
      )}

      {/* ── Add Word Modal ── */}
      <AddPersonalWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddWord}
      />

      {/* ── Curriculum Flashcard Modal (Reused) ── */}
      <FlashcardModal
        isOpen={isFlashcardOpen}
        onClose={() => setIsFlashcardOpen(false)}
        words={flashcardWords}
        onToggleMaster={handleToggleMasterFromFlashcard}
        onToggleStar={handleToggleStar}
      />
    </div>
  )
}
