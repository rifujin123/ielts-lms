import React, { useEffect } from 'react'
import type { SingleChoiceQuestionData } from '../types/gamifiedExercise.types'
import { soundEffects } from '../utils/soundEffects'
import { Check, X } from 'lucide-react'

interface SingleChoiceQuestionProps {
  question: SingleChoiceQuestionData
  selectedOptionId: string | null
  onSelectOption: (optionId: string) => void
  isEvaluated: boolean
  isCorrect?: boolean
}

export const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  isEvaluated,
  isCorrect,
}) => {
  // Keyboard shortcut listener (1, 2, 3, 4)
  useEffect(() => {
    if (isEvaluated) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key, 10)
      if (num >= 1 && num <= question.options.length) {
        const targetOption = question.options[num - 1]
        if (targetOption) {
          soundEffects.playTap()
          onSelectOption(targetOption.id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question.options, isEvaluated, onSelectOption])

  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
      {/* Context / Passage Snippet */}
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
        {question.instruction && (
          <p className="text-xs text-slate-500 mt-1 font-medium">{question.instruction}</p>
        )}
      </div>

      {/* Choice Options Stack */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt, idx) => {
          const isSelected = selectedOptionId === opt.id
          const isAnswerKey = isEvaluated && opt.id === question.correctOptionId
          const isChosenIncorrect = isEvaluated && isSelected && !isCorrect

          let cardStyle = 'card-duo-choice'
          if (isEvaluated) {
            if (isAnswerKey) {
              cardStyle =
                'flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border-2 border-b-4 border-emerald-500 text-emerald-900 font-semibold shadow-xs'
            } else if (isChosenIncorrect) {
              cardStyle =
                'flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border-2 border-b-4 border-rose-400 text-rose-900 font-semibold shadow-xs'
            } else {
              cardStyle =
                'flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-400 opacity-60 font-medium'
            }
          } else if (isSelected) {
            cardStyle += ' card-duo-choice-selected ring-2 ring-red-500/20'
          }

          return (
            <button
              key={opt.id}
              type="button"
              disabled={isEvaluated}
              onClick={() => {
                soundEffects.playTap()
                onSelectOption(opt.id)
              }}
              className={cardStyle}
            >
              {/* Keyboard Shortcut / Order Badge */}
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold font-mono transition-colors ${
                  isEvaluated && isAnswerKey
                    ? 'bg-emerald-600 text-white'
                    : isEvaluated && isChosenIncorrect
                      ? 'bg-rose-600 text-white'
                      : isSelected
                        ? 'bg-red-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {isEvaluated && isAnswerKey ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : isEvaluated && isChosenIncorrect ? (
                  <X className="h-4 w-4" strokeWidth={3} />
                ) : (
                  idx + 1
                )}
              </span>

              {/* Option Text & Hint */}
              <div className="flex-1 text-left">
                <div className="text-sm sm:text-base font-semibold">{opt.text}</div>
                {opt.hint && <div className="text-xs text-slate-500 mt-0.5">{opt.hint}</div>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
