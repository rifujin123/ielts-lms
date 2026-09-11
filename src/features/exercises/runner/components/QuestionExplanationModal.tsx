import React, { useEffect } from 'react'
import { X, CheckCircle2, HelpCircle, BookOpen } from 'lucide-react'
import type { GamifiedQuestion } from '../types/gamifiedExercise.types'

interface QuestionExplanationModalProps {
  isOpen: boolean
  onClose: () => void
  question: GamifiedQuestion | null
  correctAnswerSummary?: string
}

export const QuestionExplanationModal: React.FC<QuestionExplanationModalProps> = ({
  isOpen,
  onClose,
  question,
  correctAnswerSummary,
}) => {
  // ESC key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !question) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in-up">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-pop-in"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2 text-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HelpCircle className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <h3 id="modal-title" className="text-base font-bold text-slate-900">
              Đáp án &amp; Giải thích
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="btn-interactive flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="custom-scrollbar overflow-y-auto p-6 space-y-5">
          {/* 1. Câu hỏi */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-slate-400" />
              <span>Câu hỏi</span>
            </span>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm font-medium text-slate-800 leading-relaxed">
              <p className="font-bold text-slate-900 mb-1">{question.prompt}</p>
              {question.context && (
                <p className="text-slate-600 italic mt-2 border-t border-slate-200/80 pt-2 text-xs leading-relaxed">
                  &ldquo;{question.context}&rdquo;
                </p>
              )}
              {question.type === 'word_bank_gap_fill' && (
                <p className="text-slate-700 font-mono text-xs mt-2 bg-white p-2.5 rounded-xl border border-slate-200/80">
                  {question.sentenceWithBlanks}
                </p>
              )}
            </div>
          </div>

          {/* 2. Đáp án đúng */}
          {correctAnswerSummary && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Đáp án đúng</span>
              </span>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-sm font-bold text-emerald-900 flex items-center gap-2.5 shadow-2xs">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                </div>
                <span>{correctAnswerSummary}</span>
              </div>
            </div>
          )}

          {/* 3. Giải thích chi tiết */}
          {question.explanation && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Giải thích chi tiết</span>
              </span>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 text-xs text-slate-700 leading-relaxed shadow-2xs space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                  <span>{question.explanation.rule}</span>
                </div>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line pl-4 border-l-2 border-slate-200">
                  {question.explanation.detail}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 px-6 py-3.5 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-interactive px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  )
}
