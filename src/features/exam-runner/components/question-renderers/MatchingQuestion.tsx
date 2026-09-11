import React from 'react'
import { CheckCircle2, FileText } from 'lucide-react'
import type { IeltsQuestionItem } from '../../types/fullExam.types'

interface MatchingQuestionProps {
  question: IeltsQuestionItem
  value: string
  onChange: (val: string) => void
  isSubmitted?: boolean
  sectionInstruction?: string
}

export const MatchingQuestion: React.FC<MatchingQuestionProps> = ({
  question: q,
  value,
  onChange,
  isSubmitted = false,
  sectionInstruction = '',
}) => {
  const isAnswered = value.trim() !== ''

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2 flex-1">
          <span className="font-bold text-blue-600 font-mono text-sm shrink-0 pt-0.5">{q.id}.</span>
          <div className="text-sm font-semibold text-slate-800 leading-relaxed">
            {q.targetLabel && (
              <span className="mr-2 inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                {q.targetLabel}
              </span>
            )}
            <span>{q.prompt}</span>
          </div>
        </div>

        {/* Dropdown / Select for Matching */}
        <div className="shrink-0 pl-6 sm:pl-0">
          <select
            disabled={isSubmitted}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`Chọn đáp án cho câu ${q.id}`}
            className={`h-9 min-w-44 rounded-xl border px-3 text-xs font-bold transition-all focus:outline-hidden focus:ring-2 cursor-pointer ${
              isAnswered
                ? 'border-slate-400 bg-white text-slate-900 ring-1 ring-slate-900/10'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <option value="">-- Chọn đáp án --</option>
            {q.options?.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.key}. {opt.text}
              </option>
            ))}
            {q.matchingPool?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id}. {item.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Specific Question Instruction */}
      {q.instruction && q.instruction !== sectionInstruction && (
        <div className="mt-1.5 ml-6 flex items-center gap-1.5 text-[11px] italic text-slate-500">
          <FileText className="h-3 w-3 text-slate-400 shrink-0" />
          <span>{q.instruction}</span>
        </div>
      )}

      {/* Submitted Review Mode Details */}
      {isSubmitted && (
        <div className="mt-3 ml-6 rounded-xl bg-emerald-50/70 border border-emerald-200/90 p-3 text-xs space-y-1.5">
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
