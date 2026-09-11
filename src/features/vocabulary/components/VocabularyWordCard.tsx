import React, { useState } from 'react'
import { Volume2, Star, Brain } from 'lucide-react'
import type { VocabularyWord } from '@/types/api.types'

interface VocabularyWordCardProps {
  word: VocabularyWord
  onToggleMaster: (wordId: string) => void
  onToggleStar: (wordId: string) => void
}

/**
 * Underlines target keyword inside the example sentence
 */
function renderHighlightedExample(sentence: string, target?: string, fallbackWord?: string) {
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

export const VocabularyWordCard: React.FC<VocabularyWordCardProps> = ({
  word,
  onToggleMaster,
  onToggleStar,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [isExpandedCollocations, setIsExpandedCollocations] = useState(false)

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(word.word)
    utterance.lang = 'en-GB'
    utterance.rate = 0.88

    utterance.onstart = () => setIsPlayingAudio(true)
    utterance.onend = () => setIsPlayingAudio(false)
    utterance.onerror = () => setIsPlayingAudio(false)

    window.speechSynthesis.speak(utterance)
  }

  return (
    <div
      className={`card-interactive group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 shadow-xs ${
        word.isMastered
          ? 'border-emerald-300 bg-emerald-50/20 dark:border-emerald-800 dark:bg-emerald-950/10'
          : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
      }`}
    >
      {/* ── Top Row: Word, Types, Badges & Toggles ─────────────── */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-headline-md font-bold tracking-tight text-on-surface capitalize">
              {word.word}
            </h3>

            {/* Audio Pronunciation Button */}
            <button
              type="button"
              onClick={handlePlayAudio}
              title="Nghe phát âm chuẩn (UK)"
              className={`btn-interactive inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                isPlayingAudio
                  ? 'border-primary bg-primary text-on-primary shadow-xs'
                  : 'border-outline-variant bg-surface-container-low text-primary hover:bg-primary/10'
              }`}
            >
              <Volume2
                className={`h-4 w-4 ${isPlayingAudio ? 'animate-pulse' : ''}`}
                strokeWidth={2}
              />
            </button>
          </div>

          {/* Quick Action Toggles */}
          <div className="flex items-center gap-1.5">
            {/* Star toggle */}
            <button
              type="button"
              onClick={() => onToggleStar(word.id)}
              title={word.isStarred ? 'Bỏ lưu ý' : 'Đánh dấu từ cần lưu ý'}
              className="btn-interactive inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-container-high transition-colors"
            >
              <Star
                className={`h-4 w-4 transition-transform active:scale-125 ${
                  word.isStarred
                    ? 'fill-amber-400 text-amber-500'
                    : 'text-secondary/70 hover:text-amber-500'
                }`}
                strokeWidth={1.8}
              />
            </button>

            {/* Mastered toggle (Brain icon) */}
            <button
              type="button"
              onClick={() => onToggleMaster(word.id)}
              title={
                word.isMastered ? 'Đã thuộc (Bấm để bỏ)' : 'Chưa thuộc (Bấm để đánh dấu đã thuộc)'
              }
              className={`btn-interactive inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${
                word.isMastered
                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                  : 'border-outline-variant bg-surface-container-low text-secondary hover:border-emerald-400 hover:text-emerald-600'
              }`}
            >
              <Brain className="h-4 w-4" strokeWidth={word.isMastered ? 2.2 : 1.8} />
            </button>
          </div>
        </div>

        {/* Phonetics & Tag Row */}
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-body-sm text-secondary">
          <span className="font-mono text-secondary/90 font-medium">{word.phonetic}</span>
          <span className="h-3 w-px bg-outline-variant" />
          <span className="rounded-md bg-surface-container px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-secondary">
            {word.partOfSpeech}
          </span>
        </div>

        {/* Meaning Section */}
        <div className="mt-3.5 space-y-1">
          <p className="text-body-md font-semibold text-primary dark:text-primary-light">
            {word.vietnameseMeaning}
          </p>
          {word.englishDefinition && (
            <p className="text-body-sm text-secondary italic">{word.englishDefinition}</p>
          )}
        </div>

        {/* Contextual IELTS Example */}
        <div className="mt-3.5 rounded-xl border border-outline-variant/60 bg-surface-container-low/60 p-3 text-body-sm text-on-surface/90 leading-relaxed">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary block mb-1">
            Ngữ cảnh đề thi:
          </span>
          “{renderHighlightedExample(word.exampleSentence, word.highlightWord, word.word)}”
        </div>
      </div>

      {/* ── Bottom Section: Collocations (Option A: Top 3 + Expandable) ── */}
      {word.collocations &&
        word.collocations.length > 0 &&
        (() => {
          const MAX_VISIBLE = 3
          const total = word.collocations.length
          const hasMore = total > MAX_VISIBLE
          const visibleCollocations = isExpandedCollocations
            ? word.collocations
            : word.collocations.slice(0, MAX_VISIBLE)

          return (
            <div className="mt-3.5 pt-2.5 border-t border-outline-variant/60">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary/70">
                  Collocations & Cụm thường gặp:
                </span>
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => setIsExpandedCollocations(!isExpandedCollocations)}
                    className="btn-interactive text-[10.5px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    {isExpandedCollocations ? 'Thu gọn' : `+${total - MAX_VISIBLE} cụm`}
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {visibleCollocations.map((colloc, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-outline-variant bg-surface-container-lowest px-2 py-0.5 text-[11px] font-medium text-secondary shadow-2xs hover:border-primary/40 hover:text-primary transition-colors cursor-default"
                  >
                    {colloc}
                  </span>
                ))}
                {!isExpandedCollocations && hasMore && (
                  <button
                    type="button"
                    onClick={() => setIsExpandedCollocations(true)}
                    className="btn-interactive rounded-md border border-dashed border-outline-variant bg-surface-container-low px-2 py-0.5 text-[10.5px] font-semibold text-secondary hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                  >
                    +{total - MAX_VISIBLE} nữa
                  </button>
                )}
              </div>
            </div>
          )
        })()}
    </div>
  )
}
