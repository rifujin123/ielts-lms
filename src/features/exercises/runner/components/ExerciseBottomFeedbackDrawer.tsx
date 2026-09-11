import React, { useEffect } from 'react'
import { CheckCircle2, XCircle, ArrowRight, HelpCircle } from 'lucide-react'

export type EvaluationStatus = 'idle' | 'correct' | 'incorrect'

interface ExerciseBottomFeedbackDrawerProps {
  status: EvaluationStatus
  isAnswerReady: boolean
  onCheckAnswer: () => void
  onNextQuestion: () => void
  onOpenExplanation?: () => void
  correctAnswerSummary?: string
}

export const ExerciseBottomFeedbackDrawer: React.FC<ExerciseBottomFeedbackDrawerProps> = ({
  status,
  isAnswerReady,
  onCheckAnswer,
  onNextQuestion,
  onOpenExplanation,
  correctAnswerSummary,
}) => {
  // Enter key support: Enter to Check, Enter to Continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (status === 'idle' && isAnswerReady) {
          onCheckAnswer()
        } else if (status === 'correct' || status === 'incorrect') {
          onNextQuestion()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [status, isAnswerReady, onCheckAnswer, onNextQuestion])

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-30 border-t transition-all duration-300 select-none shadow-lg ${
        status === 'correct'
          ? 'border-emerald-300 bg-emerald-100/90 backdrop-blur-xs text-emerald-950'
          : status === 'incorrect'
            ? 'border-rose-300 bg-rose-100/95 backdrop-blur-xs text-rose-950'
            : 'border-slate-200 bg-white text-slate-800'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-3.5 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Left Side: Status Messaging */}
        <div className="flex-1">
          {status === 'idle' && (
            <div className="hidden sm:block text-xs font-medium text-slate-400">
              {isAnswerReady
                ? 'Nhấn Enter hoặc bấm Kiểm tra để nộp câu trả lời'
                : 'Chọn đáp án để tiếp tục'}
            </div>
          )}

          {status === 'correct' && (
            <div className="flex items-center gap-3 animate-pop-in">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-emerald-900 leading-tight">
                  Chính xác! Tuyệt vời
                </h4>
              </div>
            </div>
          )}

          {status === 'incorrect' && (
            <div className="flex items-center gap-3 animate-pop-in">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-xs">
                <XCircle className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-bold text-rose-950 leading-tight">
                  Chưa chính xác
                </h4>
                {correctAnswerSummary && (
                  <p className="text-xs sm:text-sm font-bold text-rose-800 mt-0.5">
                    Đáp án đúng: {correctAnswerSummary}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center justify-end shrink-0">
          {status === 'idle' ? (
            <button
              type="button"
              disabled={!isAnswerReady}
              onClick={onCheckAnswer}
              className={`btn-duo-3d w-full sm:w-auto px-8 sm:px-10 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-wider uppercase transition-all shadow-xs ${
                isAnswerReady
                  ? 'bg-red-600 border-red-800 text-white hover:bg-red-500 hover:brightness-105 active:translate-y-1'
                  : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed border-b-4'
              }`}
            >
              Kiểm tra
            </button>
          ) : status === 'correct' ? (
            <button
              type="button"
              onClick={onNextQuestion}
              className="btn-duo-3d w-full sm:w-auto flex items-center justify-center gap-2 px-8 sm:px-10 py-3 rounded-2xl bg-emerald-600 border-emerald-800 text-white hover:bg-emerald-500 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs active:translate-y-1"
            >
              <span>Tiếp tục</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenExplanation}
                className="btn-interactive flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 rounded-2xl border-2 border-rose-300 bg-white hover:bg-rose-50 text-rose-700 text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Đáp án &amp; Giải thích</span>
              </button>

              <button
                type="button"
                onClick={onNextQuestion}
                className="btn-duo-3d flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-2xl bg-rose-600 border-rose-800 text-white hover:bg-rose-500 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs active:translate-y-1"
              >
                <span>Đã hiểu</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
