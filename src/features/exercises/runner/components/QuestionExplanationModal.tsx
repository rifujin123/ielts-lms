import React, { useEffect } from 'react'
import { X, Check } from 'lucide-react'
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

  // Helper to parse and render formulas into rounded outline pills
  const renderDetailWithFormulaPills = (text: string) => {
    // If text contains parenthesized chunks like (Due to N, S V.), split and wrap them in rounded pills
    const parts = text.split(/(\([^)]+\))/)
    return parts.map((part, index) => {
      if (part.startsWith('(') && part.endsWith(')')) {
        const cleanContent = part.slice(1, -1)
        return (
          <span
            key={index}
            className="inline-block rounded-full border border-slate-300 px-2.5 py-0.5 text-xs text-slate-800 font-medium my-0.5 mx-0.5"
          >
            {cleanContent}
          </span>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in-up">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl p-6 sm:p-7 flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-pop-in"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <h3 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900">
            Đáp án và giải thích
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="btn-interactive flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* 1. CÂU HỎI Section */}
        <div className="space-y-2">
          <div>
            <span className="inline-flex items-center px-3 py-0.5 rounded-full border border-blue-500 text-blue-600 text-[11px] font-bold uppercase tracking-wider">
              CÂU HỎI
            </span>
          </div>
          <p className="text-base font-bold text-slate-900 leading-snug">{question.prompt}</p>
          {question.context && (
            <p className="text-sm text-slate-600 italic">&ldquo;{question.context}&rdquo;</p>
          )}
          {question.type === 'word_bank_gap_fill' && (
            <p className="text-sm text-slate-800 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              {question.sentenceWithBlanks}
            </p>
          )}
        </div>

        {/* 2. ĐÁP ÁN ĐÚNG Section */}
        {correctAnswerSummary && (
          <div className="space-y-2">
            <div>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full border border-blue-500 text-blue-600 text-[11px] font-bold uppercase tracking-wider">
                ĐÁP ÁN ĐÚNG
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-slate-900">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs">
                <Check className="h-3 w-3" strokeWidth={3} />
              </div>
              <span>{correctAnswerSummary}</span>
            </div>
          </div>
        )}

        {/* 3. GIẢI THÍCH Section */}
        {question.explanation && (
          <div className="space-y-2.5">
            <div>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full border border-blue-500 text-blue-600 text-[11px] font-bold uppercase tracking-wider">
                GIẢI THÍCH
              </span>
            </div>
            <div className="text-sm text-slate-800 leading-relaxed space-y-2">
              <p className="font-semibold text-slate-900">{question.explanation.rule}</p>
              <div className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                {renderDetailWithFormulaPills(question.explanation.detail)}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer: Red "Đã hiểu" Button */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-interactive px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors active:scale-95"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  )
}
