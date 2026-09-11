import React from 'react'
import { CheckCircle2, FileText } from 'lucide-react'
import type { IeltsQuestionItem } from '../../types/fullExam.types'

interface CompletionQuestionProps {
  question: IeltsQuestionItem
  value: string
  onChange: (val: string) => void
  isSubmitted?: boolean
  sectionInstruction?: string
}

export const CompletionQuestion: React.FC<CompletionQuestionProps> = ({
  question: q,
  value,
  onChange,
  isSubmitted = false,
  sectionInstruction = '',
}) => {
  const blankRegex = /_{2,}/
  const hasBlank = blankRegex.test(q.prompt)
  const promptParts = hasBlank ? q.prompt.split(blankRegex) : [q.prompt]
  const isAnswered = value.trim() !== ''

  return (
    <div className="w-full">
      {/* Inline Completion: bullet, prompt text, blue mono number, input */}
      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800 leading-relaxed">
        <span className="text-slate-400 text-base select-none">•</span>
        {promptParts[0] && <span>{promptParts[0]}</span>}

        <span className="font-bold text-blue-600 font-mono text-sm">{q.id}.</span>

        <input
          type="text"
          disabled={isSubmitted}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`Câu hỏi ${q.id}`}
          className={`h-9 min-w-40 max-w-xs rounded-lg border px-3 text-xs font-semibold transition-all focus:outline-hidden focus:ring-2 ${
            isAnswered
              ? 'border-slate-400 bg-white text-slate-900 ring-1 ring-slate-900/10'
              : 'border-slate-200 bg-slate-100/90 text-slate-800 focus:bg-white focus:border-slate-900 focus:ring-slate-900/10'
          }`}
        />

        {promptParts[1] && <span>{promptParts[1]}</span>}
      </div>

      {/* Specific Question Instruction if distinct */}
      {q.instruction && q.instruction !== sectionInstruction && (
        <div className="mt-1.5 ml-4 flex items-center gap-1.5 text-[11px] italic text-slate-500">
          <FileText className="h-3 w-3 text-slate-400 shrink-0" />
          <span>{q.instruction}</span>
        </div>
      )}

      {/* Submitted Review Mode Details */}
      {isSubmitted && (
        <div className="mt-3 ml-4 rounded-xl bg-emerald-50/70 border border-emerald-200/90 p-3 text-xs space-y-1.5">
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
