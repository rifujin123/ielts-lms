import React, { useState } from 'react'
import { X, Flame, Heart } from 'lucide-react'

interface ExerciseTopBarProps {
  currentQuestionIndex: number
  totalQuestions: number
  streakCount: number
  livesCount: number
  onExit: () => void
}

export const ExerciseTopBar: React.FC<ExerciseTopBarProps> = ({
  currentQuestionIndex,
  totalQuestions,
  streakCount,
  livesCount,
  onExit,
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false)

  // Calculate percentage: for question 1, small start progress, up to 100%
  const progressPct = totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0

  return (
    <>
      <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/95 backdrop-blur-xs px-4 sm:px-8 py-3 select-none">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Exit (X) Button */}
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            title="Thoát bài tập"
            className="btn-interactive flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>

          {/* Smooth Elastic Progress Bar with Glass Highlight */}
          <div className="flex-1 max-w-xl">
            <div className="relative h-3.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200/80 shadow-2xs">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-400 ease-out shadow-xs"
                style={{ width: `${Math.max(5, progressPct)}%` }}
              >
                {/* Top glossy reflection line */}
                <div className="h-[2px] w-full bg-white/40 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Counters: Streak 🔥 + Hearts ❤️ + Sound 🔊 */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* Streak Flame Counter */}
            <div
              title={`Chuỗi đúng liên tiếp: ${streakCount}`}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-bold text-xs transition-all ${
                streakCount >= 3
                  ? 'bg-amber-100 text-amber-700 border border-amber-300 animate-pop-in'
                  : streakCount > 0
                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                    : 'text-slate-400'
              }`}
            >
              <Flame
                className={`h-4 w-4 ${streakCount > 0 ? 'fill-amber-500 text-amber-500' : ''}`}
                strokeWidth={2}
              />
              <span className="font-mono">{streakCount}</span>
            </div>

            {/* Lives / Heart Counter */}
            <div
              title={`Số lượt mạng còn lại: ${livesCount}`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600"
            >
              <Heart className="h-4 w-4 fill-rose-500 text-rose-500" strokeWidth={2} />
            </div>
          </div>
        </div>
      </header>

      {/* Safety Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in-up">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl border border-slate-200 text-center space-y-4 animate-pop-in">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <X className="h-7 w-7" strokeWidth={2.5} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Bạn có chắc muốn thoát?</h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                Tiến độ của bài tập ngắn này sẽ không được lưu nếu bạn rời đi bây giờ.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="btn-interactive flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
              >
                Tiếp tục làm bài
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirm(false)
                  onExit()
                }}
                className="btn-interactive flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs"
              >
                Rời khỏi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
