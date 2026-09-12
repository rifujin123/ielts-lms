import React from 'react'
import { Flag, CheckCircle2, XCircle, Info } from 'lucide-react'
import type { IeltsQuestion } from '../types/ielts.types'
import { useIeltsExamStore } from '../store/ieltsExamStore'

interface QuestionCardProps {
  question: IeltsQuestion
  hideInstruction?: boolean
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  hideInstruction = false,
}) => {
  const {
    activeQuestionId,
    setActiveQuestion,
    answers,
    setAnswer,
    flaggedQuestions,
    toggleFlag,
    isSubmitted,
    scoreResult,
  } = useIeltsExamStore()

  const currentAnswer = answers[question.id] || ''
  const isFlagged = !!flaggedQuestions[question.id]
  const isActive = activeQuestionId === question.id

  // If submitted, get result info
  const detail = scoreResult?.questionDetails.find((d) => d.questionId === question.id)
  const isCorrect = detail?.isCorrect

  return (
    <div
      id={`question-${question.id}`}
      onClick={() => !isActive && setActiveQuestion(question.id)}
      className={`relative rounded-2xl border transition-all p-5 shadow-xs ${
        isActive
          ? 'border-slate-900 bg-white ring-2 ring-slate-900/10'
          : 'border-slate-200 bg-white/90 hover:border-slate-300'
      }`}
    >
      {/* ── Card Header: Number & Flag Toggle ─────────────────────── */}
      <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              isActive
                ? 'bg-slate-900 text-white'
                : currentAnswer.trim()
                  ? 'bg-slate-200 text-slate-800'
                  : 'border border-slate-300 bg-white text-slate-600'
            }`}
          >
            {question.id}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {question.type.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Review mode result badge */}
          {isSubmitted && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5" /> Incorrect
                </>
              )}
            </span>
          )}

          {/* Flag for review button */}
          {!isSubmitted && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleFlag(question.id)
              }}
              title={isFlagged ? 'Unmark review' : 'Flag question for review'}
              className={`btn-interactive flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all border ${
                isFlagged
                  ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Flag
                className={`h-3.5 w-3.5 ${isFlagged ? 'fill-white text-white' : 'text-slate-400'}`}
                strokeWidth={2}
              />
              <span>{isFlagged ? 'Review (Flagged)' : 'Review'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Authentic IELTS CBT Question Instruction & Legend ───────────────── */}
      {!hideInstruction &&
        (question.type === 'TRUE_FALSE_NOT_GIVEN' || question.type === 'YES_NO_NOT_GIVEN') && (
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/90 p-3.5 text-xs text-slate-800">
            <div className="font-semibold text-slate-900 mb-1 leading-snug">
              {question.type === 'YES_NO_NOT_GIVEN'
                ? 'Do the following statements agree with the views/claims of the writer in Reading Passage?'
                : 'Do the following statements agree with the information given in Reading Passage?'}
            </div>
            <div className="text-slate-500 mb-2 italic text-[11px]">
              In boxes on your answer sheet, choose:
            </div>
            <div className="space-y-1.5 rounded-lg border border-slate-200/90 bg-white p-2.5 text-[11px] sm:text-xs">
              {question.type === 'YES_NO_NOT_GIVEN' ? (
                <>
                  <div className="grid grid-cols-[85px_1fr] items-baseline gap-2">
                    <span className="font-bold text-slate-900 tracking-wide">YES</span>
                    <span className="text-slate-600">
                      if the statement agrees with the views/claims of the writer
                    </span>
                  </div>
                  <div className="grid grid-cols-[85px_1fr] items-baseline gap-2">
                    <span className="font-bold text-slate-900 tracking-wide">NO</span>
                    <span className="text-slate-600">
                      if the statement contradicts the views/claims of the writer
                    </span>
                  </div>
                  <div className="grid grid-cols-[85px_1fr] items-baseline gap-2">
                    <span className="font-bold text-slate-900 tracking-wide">NOT GIVEN</span>
                    <span className="text-slate-600">
                      if it is impossible to say what the writer thinks about this
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-[85px_1fr] items-baseline gap-2">
                    <span className="font-bold text-slate-900 tracking-wide">TRUE</span>
                    <span className="text-slate-600">
                      if the statement agrees with the information
                    </span>
                  </div>
                  <div className="grid grid-cols-[85px_1fr] items-baseline gap-2">
                    <span className="font-bold text-slate-900 tracking-wide">FALSE</span>
                    <span className="text-slate-600">
                      if the statement contradicts the information
                    </span>
                  </div>
                  <div className="grid grid-cols-[85px_1fr] items-baseline gap-2">
                    <span className="font-bold text-slate-900 tracking-wide">NOT GIVEN</span>
                    <span className="text-slate-600">if there is no information on this</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      {!hideInstruction &&
        question.instruction &&
        question.type !== 'TRUE_FALSE_NOT_GIVEN' &&
        question.type !== 'YES_NO_NOT_GIVEN' && (
          <p className="mb-3 text-xs italic text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {question.instruction}
          </p>
        )}

      {/* ── Question Prompt ────────────────────────────────────────── */}
      <div className="text-sm font-medium text-slate-800 mb-4 leading-relaxed">
        {question.paragraphTarget && (
          <span className="font-bold text-red-600 mr-2">[{question.paragraphTarget}]</span>
        )}
        {question.prompt}
      </div>

      {/* ── Interactive Question Controls ─────────────────────────── */}
      <div className="mt-2">
        {/* Case 1: Authentic IELTS on Computer (CBT) Radio Options */}
        {(question.type === 'TRUE_FALSE_NOT_GIVEN' || question.type === 'YES_NO_NOT_GIVEN') && (
          <div
            role="radiogroup"
            aria-label={`Options for question ${question.id}`}
            className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-4 pt-1"
          >
            {(question.type === 'TRUE_FALSE_NOT_GIVEN'
              ? ['TRUE', 'FALSE', 'NOT GIVEN']
              : ['YES', 'NO', 'NOT GIVEN']
            ).map((val) => {
              const isSelected = currentAnswer === val
              return (
                <label
                  key={val}
                  onClick={() => !isSubmitted && setAnswer(question.id, val)}
                  className={`group inline-flex items-center gap-2.5 cursor-pointer select-none py-2 px-3.5 rounded-lg border transition-all text-xs font-semibold ${
                    isSubmitted ? 'cursor-default pointer-events-none' : 'hover:bg-slate-50'
                  } ${
                    isSelected
                      ? 'border-slate-900 bg-slate-100/90 text-slate-900 shadow-2xs ring-1 ring-slate-900/10'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-white'
                        : 'border-slate-400 bg-white group-hover:border-slate-600'
                    }`}
                  >
                    {isSelected && <span className="h-2 w-2 rounded-full bg-slate-900" />}
                  </span>
                  <span className="tracking-wide">{val}</span>
                </label>
              )
            })}
          </div>
        )}

        {/* Case 2: Multiple Choice Options */}
        {question.type === 'MULTIPLE_CHOICE' && question.options && (
          <div className="flex flex-col gap-2">
            {question.options.map((opt) => {
              const isSelected = currentAnswer === opt.key
              return (
                <button
                  key={opt.key}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => setAnswer(question.id, opt.key)}
                  className={`btn-interactive flex items-start gap-3 rounded-xl p-3 text-left transition-all border ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50 text-slate-900 ring-1 ring-slate-900/10'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'border border-slate-300 bg-white text-slate-600'
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-xs font-medium pt-0.5 leading-relaxed">{opt.text}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Case 3: Sentence / Summary Completion (Text input) */}
        {(question.type === 'SENTENCE_COMPLETION' || question.type === 'SUMMARY_COMPLETION') && (
          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              disabled={isSubmitted}
              value={currentAnswer}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100 transition-colors"
            />
          </div>
        )}

        {/* Case 4: Matching Headings Dropdown */}
        {question.type === 'MATCHING_HEADINGS' && question.matchingHeadingsPool && (
          <div className="flex flex-col gap-2">
            <select
              disabled={isSubmitted}
              value={currentAnswer}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              aria-label={`Select heading for ${question.paragraphTarget || 'paragraph'}`}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-100 transition-colors"
            >
              <option value="">-- Choose matching heading --</option>
              {question.matchingHeadingsPool.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Review Mode Explanations ──────────────────────────────── */}
      {isSubmitted && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
            <Info className="h-4 w-4 text-blue-600" />
            <span>
              Correct Answer:{' '}
              <span className="text-emerald-700 font-mono">
                {Array.isArray(question.correctAnswer)
                  ? question.correctAnswer.join(' / ')
                  : question.correctAnswer}
              </span>
            </span>
          </div>
          <p className="text-slate-600 mt-1 leading-relaxed">{question.explanation}</p>
          {question.referenceLocation && (
            <div className="mt-2 text-[11px] font-semibold text-slate-400">
              Passage Reference: {question.referenceLocation}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
