import React from 'react'
import { Flag, Info } from 'lucide-react'
import type { ListeningSection } from '../types/fullExam.types'
import { UniversalQuestionRenderer } from './question-renderers'

interface ListeningSectionViewProps {
  section: ListeningSection
  answers: Record<number, string>
  onAnswerChange: (qId: number, val: string) => void
  flaggedQuestions: Record<string, boolean>
  onToggleFlag: (qId: number) => void
  isSubmitted?: boolean
}

export const ListeningSectionView: React.FC<ListeningSectionViewProps> = ({
  section,
  answers,
  onAnswerChange,
  flaggedQuestions,
  onToggleFlag,
  isSubmitted = false,
}) => {
  const [startQ, endQ] = section.questionRange
  const sectionInstruction = section.questions[0]?.instruction || ''

  return (
    <div className="space-y-4">
      {/* Section Main Instruction Callout */}
      {sectionInstruction && (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs border-l-4 border-l-red-600">
          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <Info className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Questions {startQ} – {endQ}
            </span>
            <p className="text-xs font-semibold text-slate-800 italic mt-0.5 leading-relaxed">
              {sectionInstruction}
            </p>
          </div>
        </div>
      )}

      {/* Questions Container in Clean DOL Academic Paper Format */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4 divide-y divide-slate-100">
        {section.questions.map((q) => {
          const currentAns = answers[q.id] || ''
          const isFlagged = !!flaggedQuestions[`LISTENING_${q.id}`]

          return (
            <div
              key={q.id}
              id={`listening-question-${q.id}`}
              className={`pt-4 first:pt-0 transition-all ${
                isFlagged ? 'bg-amber-50/40 -mx-3 px-3 py-2 rounded-xl' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Main Dynamic Question Content */}
                <div className="flex-1 min-w-0">
                  <UniversalQuestionRenderer
                    question={q}
                    value={currentAns}
                    onChange={(val) => onAnswerChange(q.id, val)}
                    isSubmitted={isSubmitted}
                    sectionInstruction={sectionInstruction}
                  />
                </div>

                {/* Flag Button */}
                <button
                  type="button"
                  onClick={() => onToggleFlag(q.id)}
                  title={isFlagged ? 'Bỏ cờ xem lại' : 'Gắn cờ câu này để xem lại'}
                  className={`btn-interactive flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition-all border shrink-0 ${
                    isFlagged
                      ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/80 text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Flag
                    className={`h-3.5 w-3.5 ${
                      isFlagged ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                    }`}
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
