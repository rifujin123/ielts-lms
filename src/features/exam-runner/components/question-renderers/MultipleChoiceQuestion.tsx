import React from 'react'
import { CheckCircle2, FileText } from 'lucide-react'
import type { IeltsQuestionItem } from '../../types/fullExam.types'

interface MultipleChoiceQuestionProps {
  question: IeltsQuestionItem
  value: string
  onChange: (val: string) => void
  isSubmitted?: boolean
  sectionInstruction?: string
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question: q,
  value,
  onChange,
  isSubmitted = false,
  sectionInstruction = '',
}) => {
  return (
    <div className="w-full">
      {/* Question Header: Blue Mono Numbering + Prompt */}
      <div className="flex items-start gap-2 mb-3">
        <span className="font-bold text-blue-600 font-mono text-sm shrink-0 pt-0.5">{q.id}.</span>
        <span className="text-sm font-semibold text-slate-800 leading-relaxed">{q.prompt}</span>
      </div>

      {/* 1 Row per Option with Custom Radio Buttons */}
      {q.options && q.options.length > 0 && (
        <div className="flex flex-col gap-2 pl-6 sm:pl-8 pt-1">
          {q.options.map((opt) => {
            const isSelected = value === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isSubmitted}
                onClick={() => onChange(opt.key)}
                className={`group flex items-center gap-3 py-1.5 px-2.5 rounded-xl text-left w-full cursor-pointer select-none transition-all ${
                  isSelected
                    ? 'bg-slate-100/90 text-slate-900 font-medium'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                {/* Radio Button Circle */}
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-white shadow-2xs'
                      : 'border-slate-300 bg-white group-hover:border-slate-400'
                  }`}
                >
                  {isSelected && <div className="h-2 w-2 rounded-full bg-slate-900" />}
                </div>

                {/* Option Letter and Text */}
                <span className="text-xs font-medium leading-relaxed">
                  <strong className="font-bold text-slate-900 mr-2">{opt.key}.</strong>
                  {opt.text}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Specific Question Instruction if distinct from section */}
      {q.instruction && q.instruction !== sectionInstruction && (
        <div className="mt-2 ml-6 sm:ml-8 flex items-center gap-1.5 text-[11px] italic text-slate-500">
          <FileText className="h-3 w-3 text-slate-400 shrink-0" />
          <span>{q.instruction}</span>
        </div>
      )}

      {/* Submitted Review Mode Details */}
      {isSubmitted && (
        <div className="mt-3 ml-6 sm:ml-8 rounded-xl bg-emerald-50/70 border border-emerald-200/90 p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>
                Đáp án đúng:{' '}
                <strong className="text-emerald-700 font-mono text-sm underline">
                  {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(' / ') : q.correctAnswer}
                </strong>
              </span>
            </div>
            {q.referenceLocation && (
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800">
                {q.referenceLocation}
              </span>
            )}
          </div>
          {q.explanation && (
            <p className="text-slate-700 leading-relaxed pt-1 border-t border-emerald-200/60">
              {q.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
