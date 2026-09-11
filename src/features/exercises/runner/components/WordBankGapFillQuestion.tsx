import React from 'react'
import type { WordBankGapFillQuestionData, WordBankItem } from '../types/gamifiedExercise.types'
import { soundEffects } from '../utils/soundEffects'
import { Check, X } from 'lucide-react'

interface WordBankGapFillQuestionProps {
  question: WordBankGapFillQuestionData
  placedWords: Record<string, WordBankItem | null>
  onPlaceWord: (blankId: string, word: WordBankItem) => void
  onRemoveWord: (blankId: string) => void
  isEvaluated: boolean
  isCorrect?: boolean
}

export const WordBankGapFillQuestion: React.FC<WordBankGapFillQuestionProps> = ({
  question,
  placedWords,
  onPlaceWord,
  onRemoveWord,
  isEvaluated,
}) => {
  // Set of word IDs that are currently placed in blanks
  const placedWordIds = new Set<string>()
  Object.values(placedWords).forEach((item) => {
    if (item) placedWordIds.add(item.id)
  })

  // Helper to place a word in the first available blank slot
  const handleWordBankClick = (item: WordBankItem) => {
    if (isEvaluated) return
    soundEffects.playTap()

    // Find the first blank that is currently empty
    const firstEmptyBlank = question.blanks.find((b) => !placedWords[b.blankId])
    if (firstEmptyBlank) {
      onPlaceWord(firstEmptyBlank.blankId, item)
    }
  }

  // Parse sentence into segments and blank slots
  const parts = question.sentenceWithBlanks.split(/(\[blank_\d+\])/g)

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      {/* Context / Tip Snippet */}
      {question.context && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs text-sm sm:text-base text-slate-800 leading-relaxed font-serif">
          {question.context}
        </div>
      )}

      {/* Question Prompt */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {question.prompt}
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Chạm vào từ để điền vào chỗ trống; chạm vào từ trong câu để gỡ ra.
        </p>
      </div>

      {/* ── Sentence Canvas with Interactive Blank Slots ──────────── */}
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        <div className="text-base sm:text-lg text-slate-800 leading-loose flex flex-wrap items-center gap-y-3 font-medium">
          {parts.map((part, index) => {
            const blankMatch = part.match(/\[(blank_\d+)\]/)
            if (!blankMatch) {
              return <span key={index}>{part}</span>
            }

            const blankId = blankMatch[1]
            const filledWord = placedWords[blankId]
            const targetBlankSpec = question.blanks.find((b) => b.blankId === blankId)
            const isWordCorrect =
              isEvaluated &&
              filledWord &&
              targetBlankSpec &&
              filledWord.word.toLowerCase() === targetBlankSpec.correctWord.toLowerCase()

            if (filledWord) {
              return (
                <button
                  key={index}
                  type="button"
                  disabled={isEvaluated}
                  onClick={() => {
                    soundEffects.playTap()
                    onRemoveWord(blankId)
                  }}
                  title={isEvaluated ? undefined : 'Chạm để gỡ từ này'}
                  className={`inline-flex items-center gap-1.5 mx-1.5 px-3.5 py-1.5 rounded-xl font-bold text-sm sm:text-base transition-all select-none border-2 border-b-4 ${
                    isEvaluated
                      ? isWordCorrect
                        ? 'bg-emerald-50 border-emerald-500 border-b-emerald-700 text-emerald-900 shadow-xs'
                        : 'bg-rose-50 border-rose-400 border-b-rose-600 text-rose-900 shadow-xs'
                      : 'bg-white border-red-400 border-b-red-600 text-red-700 shadow-xs hover:bg-red-50 hover:border-red-500 cursor-pointer active:translate-y-0.5'
                  }`}
                >
                  <span>{filledWord.word}</span>
                  {isEvaluated ? (
                    isWordCorrect ? (
                      <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                    ) : (
                      <X className="h-4 w-4 text-rose-600" strokeWidth={3} />
                    )
                  ) : null}
                </button>
              )
            }

            // Empty blank slot
            return (
              <span
                key={index}
                className="inline-flex items-center justify-center mx-1.5 min-w-[96px] h-10 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/80 px-3 text-xs text-slate-400 font-mono select-none"
              >
                (chỗ trống)
              </span>
            )
          })}
        </div>
      </div>

      {/* ── Word Bank (Pool) with 0px Layout Shift Placeholders ────── */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Ngân hàng từ vựng:
        </div>

        <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-slate-100/70 border border-slate-200/80 min-h-[64px]">
          {question.wordBank.map((item) => {
            const isPlaced = placedWordIds.has(item.id)

            if (isPlaced) {
              // 🛡️ ZERO LAYOUT SHIFT: Render an empty, outlined placeholder with identical dimensions
              return (
                <div
                  key={item.id}
                  aria-hidden="true"
                  className="px-4 py-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-200/50 text-transparent font-semibold text-sm sm:text-base select-none pointer-events-none"
                >
                  {item.word}
                </div>
              )
            }

            // Active clickable word chip
            return (
              <button
                key={item.id}
                type="button"
                disabled={isEvaluated}
                onClick={() => handleWordBankClick(item)}
                className="btn-duo-3d px-4 py-2 rounded-xl bg-white border-2 border-b-4 border-slate-200 border-b-slate-300 text-slate-800 font-semibold text-sm sm:text-base hover:bg-slate-50 hover:border-slate-300 shadow-xs active:border-b-2"
              >
                {item.word}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
