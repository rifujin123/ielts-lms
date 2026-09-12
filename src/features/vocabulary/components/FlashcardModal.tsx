import React, { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Volume2,
  VolumeX,
  Brain,
  Keyboard,
} from 'lucide-react'
import type { VocabularyWord } from '@/types/api.types'

interface FlashcardModalProps {
  words: VocabularyWord[]
  isOpen: boolean
  onClose: () => void
  onToggleMaster: (wordId: string) => void
  onToggleStar: (wordId: string) => void
}

/**
 * Underlines target keyword inside the example sentence
 */
function renderUnderlinedExample(sentence: string, target?: string, fallbackWord?: string) {
  const keyword = target || fallbackWord
  if (!keyword) return sentence

  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = sentence.split(regex)

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span
        key={i}
        className="font-bold text-on-surface underline underline-offset-4 decoration-primary decoration-2"
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  words,
  isOpen,
  onClose,
  onToggleMaster,
  onToggleStar,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [autoPlayAudio, setAutoPlayAudio] = useState(false)
  const [showAllCollocations, setShowAllCollocations] = useState(false)

  const currentWord = words[currentIndex]

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  const handleNext = useCallback(() => {
    if (currentIndex < words.length - 1) {
      setIsFlipped(false)
      setShowAllCollocations(false)
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, words.length])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setShowAllCollocations(false)
      setCurrentIndex((prev) => prev - 1)
    }
  }, [currentIndex])

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev)
  }, [])

  const handlePlayAudio = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation()
      if (!currentWord || !('speechSynthesis' in window)) return

      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.lang = 'en-GB'
      utterance.rate = 0.88

      utterance.onstart = () => setIsPlayingAudio(true)
      utterance.onend = () => setIsPlayingAudio(false)
      utterance.onerror = () => setIsPlayingAudio(false)

      window.speechSynthesis.speak(utterance)
    },
    [currentWord],
  )

  // Auto-play pronunciation when card changes if enabled
  useEffect(() => {
    if (autoPlayAudio && isOpen && currentWord) {
      const timer = setTimeout(() => {
        handlePlayAudio()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, autoPlayAudio, isOpen, handlePlayAudio, currentWord])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === ' ') {
        e.preventDefault()
        handleFlip()
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        handlePrev()
      } else if (e.key.toLowerCase() === 'm' && currentWord) {
        e.preventDefault()
        onToggleMaster(currentWord.id)
      } else if (e.key.toLowerCase() === 's' && currentWord) {
        e.preventDefault()
        onToggleStar(currentWord.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    isOpen,
    handleFlip,
    handleNext,
    handlePrev,
    onClose,
    currentWord,
    onToggleMaster,
    onToggleStar,
  ])

  if (!isOpen || !currentWord) return null

  const progressPercent = Math.round(((currentIndex + 1) / words.length) * 100)

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative flex w-full max-w-2xl max-h-[92vh] flex-col rounded-3xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-2xl dark:bg-surface-container-lowest my-auto overflow-y-auto animate-pop-in">
        {/* ── Top Bar: Title, Auto-play toggle & Close ─────────── */}
        <div className="flex items-center justify-between border-b border-outline-variant pb-4">
          <div className="flex items-center gap-2">
            <span className="badge-tag font-semibold text-primary bg-primary/10">Flashcard</span>
            <span className="text-body-sm font-semibold text-on-surface">
              {currentIndex + 1} / {words.length} từ
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Play Audio Toggle */}
            <button
              type="button"
              onClick={() => setAutoPlayAudio(!autoPlayAudio)}
              title={autoPlayAudio ? 'Tắt tự động phát âm' : 'Bật tự động phát âm khi chuyển từ'}
              className={`btn-interactive inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-label-sm font-medium transition-colors ${
                autoPlayAudio
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-outline-variant bg-surface-container-low text-secondary hover:text-on-surface'
              }`}
            >
              {autoPlayAudio ? (
                <Volume2 className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <VolumeX className="h-3.5 w-3.5" strokeWidth={1.8} />
              )}
              <span>Tự động đọc</span>
            </button>

            {/* Close modal button */}
            <button
              type="button"
              onClick={onClose}
              className="btn-interactive rounded-xl p-2 text-secondary hover:bg-surface-container-high hover:text-on-surface transition-colors"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── Progress Bar ────────────────────────────────────── */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* ── Card Area with Ergonomic Side Chevron Buttons ──── */}
        <div className="relative mt-6 flex items-center gap-3 md:gap-4">
          {/* Left Floating Chevron Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            title="Từ trước (Phím ←)"
            className="btn-interactive flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface shadow-sm hover:border-primary hover:bg-primary hover:text-on-primary active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
          </button>

          {/* Interactive 3D Flip Card */}
          <div
            onClick={handleFlip}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFlip()}
            className="flashcard-perspective min-h-[360px] flex-1 cursor-pointer select-none focus:outline-hidden"
          >
            <div
              className={`flashcard-inner relative h-full min-h-[360px] w-full rounded-2xl ${
                isFlipped ? 'flashcard-flipped' : ''
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="flashcard-face absolute inset-0 flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-low p-7 text-center hover:border-primary/40 hover:shadow-md transition-colors">
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-surface-container-high px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary">
                    {currentWord.partOfSpeech}
                  </span>
                </div>

                {/* Card Body (Front) */}
                <div className="my-auto py-4 space-y-4">
                  <h2 className="text-display-sm font-black tracking-tight text-on-surface capitalize">
                    {currentWord.word}
                  </h2>
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-mono text-body-md text-secondary">
                      {currentWord.phonetic}
                    </span>
                    <button
                      type="button"
                      onClick={handlePlayAudio}
                      title="Nghe phát âm chuẩn (UK)"
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                        isPlayingAudio
                          ? 'border-primary bg-primary text-on-primary shadow-xs'
                          : 'border-outline-variant bg-surface-container text-primary hover:bg-primary/15'
                      }`}
                    >
                      <Volume2
                        className={`h-4 w-4 ${isPlayingAudio ? 'animate-pulse' : ''}`}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                  <p className="text-[12px] text-secondary/60">
                    <span className="hidden sm:inline">
                      Nhấn <span className="font-semibold text-primary">Space</span> hoặc{' '}
                    </span>
                    chạm vào thẻ để lật xem nghĩa
                  </p>
                </div>

                {/* Card Bottom: Flip Indicator */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-secondary/60">
                  <RotateCw className="h-3 w-3" strokeWidth={1.8} />
                  <span>Click để lật xem nghĩa</span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="flashcard-face flashcard-face-back absolute inset-0 flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-low p-7 text-left hover:border-primary/40 hover:shadow-md transition-colors overflow-y-auto">
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-surface-container-high px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary">
                    {currentWord.partOfSpeech}
                  </span>
                </div>

                {/* Card Body (Back) */}
                <div className="my-auto py-2 space-y-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                      Định nghĩa:
                    </span>
                    <h3 className="mt-0.5 text-headline-sm font-bold text-primary dark:text-primary-light">
                      {currentWord.vietnameseMeaning}
                    </h3>
                    {currentWord.englishDefinition && (
                      <p className="mt-0.5 text-[12px] text-secondary italic">
                        {currentWord.englishDefinition}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl border border-outline-variant bg-surface-container p-3 text-[12.5px] text-on-surface leading-relaxed">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-secondary block mb-1">
                      Ví dụ IELTS:
                    </span>
                    “
                    {renderUnderlinedExample(
                      currentWord.exampleSentence,
                      currentWord.highlightWord,
                      currentWord.word,
                    )}
                    ”
                  </div>

                  {currentWord.collocations &&
                    currentWord.collocations.length > 0 &&
                    (() => {
                      const MAX_VISIBLE = 3
                      const total = currentWord.collocations.length
                      const hasMore = total > MAX_VISIBLE
                      const visibleCollocations = showAllCollocations
                        ? currentWord.collocations
                        : currentWord.collocations.slice(0, MAX_VISIBLE)

                      return (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary/70">
                              Cụm từ liên quan:
                            </span>
                            {hasMore && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowAllCollocations(!showAllCollocations)
                                }}
                                className="btn-interactive text-[10.5px] font-semibold text-primary hover:underline cursor-pointer"
                              >
                                {showAllCollocations
                                  ? 'Thu gọn'
                                  : `+${total - MAX_VISIBLE} cụm nữa`}
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {visibleCollocations.map((c, i) => (
                              <span
                                key={i}
                                className="rounded-md border border-outline-variant bg-surface-container-lowest px-2 py-0.5 text-[11px] font-medium text-secondary hover:text-on-surface transition-colors"
                              >
                                {c}
                              </span>
                            ))}
                            {!showAllCollocations && hasMore && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowAllCollocations(true)
                                }}
                                className="btn-interactive rounded-md border border-dashed border-outline-variant bg-surface-container px-2 py-0.5 text-[10.5px] font-semibold text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                              >
                                +{total - MAX_VISIBLE} nữa
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                </div>

                {/* Card Bottom: Flip Indicator */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-secondary/60">
                  <RotateCw className="h-3 w-3" strokeWidth={1.8} />
                  <span>Click để lật lại mặt trước</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Floating Chevron Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            title="Từ tiếp theo (Phím →)"
            className="btn-interactive flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low text-on-surface shadow-sm hover:border-primary hover:bg-primary hover:text-on-primary active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition-all"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Action Toolbar: Focused Study Marking ────────────── */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-outline-variant/60 pt-4">
          <div className="text-body-sm text-secondary font-medium">
            Tiến độ: <span className="font-bold text-on-surface">{currentIndex + 1}</span> /{' '}
            {words.length}
          </div>

          {/* Quick Markings */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onToggleStar(currentWord.id)}
              className={`btn-interactive inline-flex items-center rounded-xl border px-3.5 py-2 text-label-sm font-semibold transition-all ${
                currentWord.isStarred
                  ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-xs dark:border-amber-700 dark:bg-amber-950/20 dark:text-amber-300'
                  : 'border-outline-variant bg-surface-container-low text-secondary hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span>{currentWord.isStarred ? 'Đã lưu ý' : 'Lưu ý'}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleMaster(currentWord.id)}
              className={`btn-interactive inline-flex items-center gap-2 rounded-xl px-4 py-2 text-label-sm font-semibold border transition-all ${
                currentWord.isMastered
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                  : 'border-outline-variant bg-surface-container-low text-secondary hover:border-emerald-400 hover:text-emerald-700'
              }`}
            >
              <Brain className="h-4 w-4" strokeWidth={currentWord.isMastered ? 2.2 : 1.8} />
              <span>{currentWord.isMastered ? 'Đã thuộc' : 'Chưa thuộc'}</span>
            </button>
          </div>
        </div>

        {/* ── Keyboard Shortcuts Hint Footer (Desktop only) ──── */}
        <div className="mt-3.5 hidden sm:flex items-center justify-center gap-4 text-[11px] text-secondary/60">
          <div className="flex items-center gap-1">
            <Keyboard className="h-3 w-3" strokeWidth={1.8} />
            <span>Phím tắt:</span>
          </div>
          <span>
            <kbd className="rounded border border-outline-variant px-1.5 py-0.5">Space</kbd> Lật thẻ
          </span>
          <span>
            <kbd className="rounded border border-outline-variant px-1.5 py-0.5">←</kbd>{' '}
            <kbd className="rounded border border-outline-variant px-1.5 py-0.5">→</kbd> Chuyển từ
          </span>
          <span>
            <kbd className="rounded border border-outline-variant px-1.5 py-0.5">M</kbd> Đã thuộc
          </span>
          <span>
            <kbd className="rounded border border-outline-variant px-1.5 py-0.5">Esc</kbd> Đóng
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
