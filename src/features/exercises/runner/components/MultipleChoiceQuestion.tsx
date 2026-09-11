import React from 'react'
import type { MultipleChoiceQuestionData } from '../types/gamifiedExercise.types'
import { soundEffects } from '../utils/soundEffects'
import { Check, X } from 'lucide-react'

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionData
  selectedOptionIds: string[]
  onToggleOption: (optionId: string) => void
  isEvaluated: boolean
  isCorrect?: boolean
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  selectedOptionIds,
  onToggleOption,
  isEvaluated,
}) => {
  const selectedCount = selectedOptionIds.length
  const requiredCount = question.requiredSelectCount || question.correctOptionIds.length

  return (
    <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto">
      {/* Context Snippet */}
      {question.context && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs text-sm sm:text-base text-slate-800 leading-relaxed font-serif">
          {question.context}
        </div>
      )}

      {/* Question Prompt & Counter Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {question.prompt}
        </h3>
        <div className="inline-flex items-center gap-1.5 self-start sm:self-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 whitespace-nowrap">
          <span>Đã chọn:</span>
          <span className="font-mono text-red-600">
            {selectedCount}/{requiredCount}
          </span>
        </div>
      </div>

      {/* Choice Options Stack */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((opt) => {
          const isSelected = selectedOptionIds.includes(opt.id)
          const isCorrectAnswer = question.correctOptionIds.includes(opt.id)

          let cardStyle = 'card-duo-choice'
          if (isEvaluated) {
            if (isCorrectAnswer) {
              cardStyle =
                'flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border-2 border-b-4 border-emerald-500 text-emerald-900 font-semibold shadow-xs'
            } else if (isSelected && !isCorrectAnswer) {
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
                onToggleOption(opt.id)
              }}
              className={cardStyle}
            >
              {/* Checkbox Circular Indicator */}
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
                  isEvaluated && isCorrectAnswer
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : isEvaluated && isSelected && !isCorrectAnswer
                      ? 'border-rose-600 bg-rose-600 text-white'
                      : isSelected
                        ? 'border-red-600 bg-red-600 text-white shadow-2xs'
                        : 'border-slate-300 bg-white'
                }`}
              >
                {isEvaluated && isCorrectAnswer ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : isEvaluated && isSelected && !isCorrectAnswer ? (
                  <X className="h-3.5 w-3.5" strokeWidth={3} />
                ) : isSelected ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : null}
              </div>

              {/* Option Text */}
              <div className="flex-1 text-left text-sm sm:text-base font-semibold">{opt.text}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
