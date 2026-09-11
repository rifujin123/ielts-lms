import React, { useEffect } from 'react'
import { Trophy, CheckCircle2, RotateCcw, ArrowRight, Flame } from 'lucide-react'
import { soundEffects } from '../utils/soundEffects'

interface ExerciseCompleteScreenProps {
  lessonTitle: string
  totalQuestions: number
  correctCount: number
  streakCount: number
  onFinish: () => void
  onRetry?: () => void
}

export const ExerciseCompleteScreen: React.FC<ExerciseCompleteScreenProps> = ({
  lessonTitle,
  totalQuestions,
  correctCount,
  streakCount,
  onFinish,
  onRetry,
}) => {
  useEffect(() => {
    soundEffects.playVictory()
  }, [])

  const accuracyPct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30 flex flex-col justify-between select-none">
      {/* Confetti / Burst particles background */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
        {/* Decorative Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-70">
          <div className="absolute -top-10 left-1/4 w-3 h-3 bg-amber-400 rounded-full animate-bounce delay-100" />
          <div className="absolute top-20 right-1/4 w-4 h-4 bg-emerald-400 rounded-sm rotate-45 animate-pulse" />
          <div className="absolute top-1/3 left-1/5 w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping" />
          <div className="absolute top-1/2 right-1/5 w-3 h-3 bg-rose-400 rounded-sm rotate-12" />
          <div className="absolute bottom-1/4 left-1/3 w-3.5 h-3.5 bg-violet-400 rounded-full" />
          <div className="absolute bottom-20 right-1/3 w-2.5 h-2.5 bg-amber-500 rounded-sm rotate-45 animate-bounce" />
        </div>

        {/* Main Victory Card */}
        <div className="relative z-10 w-full max-w-md text-center animate-pop-in">
          {/* Trophy Icon with glowing ring */}
          <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-60" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400/30 to-amber-200/50 blur-md" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-xl shadow-amber-500/25 border-t-2 border-amber-200">
              <Trophy className="h-12 w-12 text-white drop-shadow-md" strokeWidth={2.2} />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Tuyệt vời! Hoàn thành xuất sắc!
          </h1>
          <p className="text-sm font-medium text-slate-500 mb-8 max-w-xs mx-auto">
            Bạn đã hoàn thành bài luyện tập{' '}
            <span className="font-semibold text-slate-700">{lessonTitle}</span>
          </p>

          {/* Metrics Grid (Accuracy & Streak) */}
          <div className="grid grid-cols-2 gap-3.5 mb-8">
            {/* Accuracy Card */}
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-center shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Chính xác</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">{accuracyPct}%</div>
              <div className="text-xs font-medium text-emerald-600/80 mt-0.5">
                {correctCount}/{totalQuestions} câu đúng
              </div>
            </div>

            {/* Streak Card */}
            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 text-center shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-rose-600 mb-1.5">
                <Flame className="h-4 w-4 fill-rose-500 text-rose-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Chuỗi</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-700">{streakCount}</div>
              <div className="text-xs font-medium text-rose-600/80 mt-0.5">Liên tiếp cao nhất</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Controls */}
      <footer className="w-full border-t border-slate-200 bg-white px-4 sm:px-8 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="btn-interactive flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors shrink-0"
              title="Luyện tập lại"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
              <span className="text-sm">Làm lại</span>
            </button>
          )}

          <button
            type="button"
            onClick={onFinish}
            className="btn-duo-3d flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-500 border-b-4 border-emerald-700 text-white font-bold text-base hover:bg-emerald-600 transition-colors shadow-md"
          >
            <span>Hoàn thành bài tập</span>
            <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </footer>
    </div>
  )
}
