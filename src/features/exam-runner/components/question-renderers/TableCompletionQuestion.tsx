import React from 'react'
import { CheckCircle2, FileText, Table as TableIcon } from 'lucide-react'
import type { IeltsQuestionItem } from '../../types/fullExam.types'

interface TableCompletionQuestionProps {
  question: IeltsQuestionItem
  value: string
  onChange: (val: string) => void
  isSubmitted?: boolean
  sectionInstruction?: string
}

export const TableCompletionQuestion: React.FC<TableCompletionQuestionProps> = ({
  question: q,
  value,
  onChange,
  isSubmitted = false,
  sectionInstruction = '',
}) => {
  const blankRegex = /_{2,}/
  const hasBlank = blankRegex.test(q.prompt)
  const isAnswered = value.trim() !== ''

  // Support pipe-delimited columns for table rows: "Column 1 | Column 2 | Column 3 with blank ______"
  const isPipeDelimited = q.prompt.includes('|')
  const columns = isPipeDelimited ? q.prompt.split('|').map((col) => col.trim()) : null

  return (
    <div className="w-full">
      {/* Tabular Layout */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
        {isPipeDelimited && columns && columns.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 text-xs">
            {columns.map((col, idx) => {
              const colHasBlank = blankRegex.test(col)
              if (colHasBlank) {
                const parts = col.split(blankRegex)
                return (
                  <div key={idx} className="p-3.5 bg-slate-50/50 flex flex-wrap items-center gap-2">
                    {parts[0] && <span className="font-medium text-slate-700">{parts[0]}</span>}
                    <span className="font-bold text-blue-600 font-mono text-sm">{q.id}.</span>
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      aria-label={`Điền đáp án câu ${q.id}`}
                      className={`h-8 min-w-32 rounded-lg border px-2.5 text-xs font-semibold transition-all focus:outline-hidden focus:ring-2 ${
                        isAnswered
                          ? 'border-slate-400 bg-white text-slate-900 ring-1 ring-slate-900/10'
                          : 'border-slate-200 bg-white text-slate-800 focus:border-slate-900 focus:ring-slate-900/10'
                      }`}
                    />
                    {parts[1] && <span className="font-medium text-slate-700">{parts[1]}</span>}
                  </div>
                )
              }
              return (
                <div key={idx} className="p-3.5 text-slate-700 font-semibold flex items-center">
                  <span>{col}</span>
                </div>
              )
            })}
          </div>
        ) : (
          /* Standard Single Row Table Card */
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-slate-50/40">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <TableIcon className="h-3.5 w-3.5" />
              </div>
              <div className="text-xs font-medium text-slate-800 leading-relaxed">
                {hasBlank ? (
                  (() => {
                    const parts = q.prompt.split(blankRegex)
                    return (
                      <div className="flex flex-wrap items-center gap-2">
                        {parts[0] && <span>{parts[0]}</span>}
                        <span className="font-bold text-blue-600 font-mono text-sm">{q.id}.</span>
                        <input
                          type="text"
                          disabled={isSubmitted}
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          aria-label={`Điền đáp án câu ${q.id}`}
                          className={`h-8 min-w-36 rounded-lg border px-2.5 text-xs font-semibold transition-all focus:outline-hidden focus:ring-2 ${
                            isAnswered
                              ? 'border-slate-400 bg-white text-slate-900 ring-1 ring-slate-900/10'
                              : 'border-slate-200 bg-white text-slate-800 focus:border-slate-900 focus:ring-slate-900/10'
                          }`}
                        />
                        {parts[1] && <span>{parts[1]}</span>}
                      </div>
                    )
                  })()
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 font-mono text-sm">{q.id}.</span>
                    <span>{q.prompt}</span>
                  </div>
                )}
              </div>
            </div>

            {!hasBlank && (
              <div className="shrink-0">
                <input
                  type="text"
                  disabled={isSubmitted}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  aria-label={`Điền đáp án câu ${q.id}`}
                  className={`h-8 w-44 rounded-lg border px-2.5 text-xs font-semibold transition-all focus:outline-hidden focus:ring-2 ${
                    isAnswered
                      ? 'border-slate-400 bg-white text-slate-900 ring-1 ring-slate-900/10'
                      : 'border-slate-200 bg-white text-slate-800 focus:border-slate-900 focus:ring-slate-900/10'
                  }`}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Specific Question Instruction */}
      {q.instruction && q.instruction !== sectionInstruction && (
        <div className="mt-1.5 ml-2 flex items-center gap-1.5 text-[11px] italic text-slate-500">
          <FileText className="h-3 w-3 text-slate-400 shrink-0" />
          <span>{q.instruction}</span>
        </div>
      )}

      {/* Submitted Review Mode Details */}
      {isSubmitted && (
        <div className="mt-3 rounded-xl bg-emerald-50/70 border border-emerald-200/90 p-3 text-xs space-y-1.5">
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
