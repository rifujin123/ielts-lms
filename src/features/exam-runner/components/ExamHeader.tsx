import React, { useEffect } from 'react'
import { Clock, Eye, EyeOff, Send, ArrowLeft } from 'lucide-react'
import { useIeltsExamStore } from '../store/ieltsExamStore'

interface ExamHeaderProps {
  onOpenSubmitModal: () => void
  onExitExam: () => void
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ onOpenSubmitModal, onExitExam }) => {
  const {
    manifest,
    activePassageId,
    setActivePassage,
    answers,
    timeRemainingSeconds,
    isTimerRunning,
    isTimerVisible,
    tickTimer,
    toggleTimerVisibility,
    fontSizeScale,
    setFontSizeScale,
    isSubmitted,
  } = useIeltsExamStore()

  // Background 1-second interval for countdown timer
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return

    const interval = setInterval(() => {
      tickTimer()
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerRunning, isSubmitted, tickTimer])

  // Format seconds to mm:ss
  const minutes = Math.floor(timeRemainingSeconds / 60)
  const seconds = timeRemainingSeconds % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isUrgent = timeRemainingSeconds < 300 // < 5 minutes

  // Compute answers completed per passage
  const getPassageAnsweredCount = (passageId: 1 | 2 | 3) => {
    const passage = manifest.passages.find((p) => p.id === passageId)
    if (!passage) return { answered: 0, total: 0 }
    const [start, end] = passage.questionRange
    let count = 0
    for (let i = start; i <= end; i++) {
      if (answers[i] && answers[i].trim() !== '') {
        count++
      }
    }
    return { answered: count, total: end - start + 1 }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-xs">
      {/* ── Left: Branding & Passage Tabs ─────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onExitExam}
          title="Thoát phòng thi"
          className="btn-interactive flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="hidden lg:flex items-center gap-2.5 pr-2.5 border-r border-slate-200">
          <img
            src="/branding.png"
            alt="IELTS Hồ Thành"
            className="h-8 w-auto max-w-[100px] object-contain"
          />
          <div>
            <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
              IELTS Hồ Thành
            </div>
            <div className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[220px]">
              {manifest.title}
            </div>
          </div>
        </div>

        {/* Passage Navigation Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 border border-slate-200">
          {manifest.passages.map((p) => {
            const { answered, total } = getPassageAnsweredCount(p.id)
            const isActive = activePassageId === p.id
            const isComplete = answered === total

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePassage(p.id)}
                className={`btn-interactive flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-900/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span>Passage {p.id}</span>
                <span
                  className={`inline-flex items-center rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isComplete
                      ? 'bg-emerald-100 text-emerald-700'
                      : isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {answered}/{total}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Center: Countdown Timer ───────────────────────────────── */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-mono text-sm font-bold tracking-tight shadow-xs transition-colors ${
            isUrgent && !isSubmitted
              ? 'animate-pulse bg-red-50 text-red-600 border border-red-200'
              : 'bg-slate-100 text-slate-800 border border-slate-200'
          }`}
        >
          <Clock className="h-4 w-4 text-slate-500" strokeWidth={2} />
          {isTimerVisible ? (
            <span>{isSubmitted ? 'Đã kết thúc' : formattedTime}</span>
          ) : (
            <span className="text-slate-400">••:••</span>
          )}
        </div>

        <button
          type="button"
          onClick={toggleTimerVisibility}
          title={isTimerVisible ? 'Ẩn đồng hồ đếm ngược' : 'Hiện đồng hồ'}
          className="btn-interactive hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
        >
          {isTimerVisible ? (
            <EyeOff className="h-4 w-4" strokeWidth={1.8} />
          ) : (
            <Eye className="h-4 w-4" strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* ── Right: Font Zoom & Submit Button ──────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Font size adjustments */}
        <div className="hidden md:flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFontSizeScale('sm')}
            title="Cỡ chữ nhỏ"
            className={`btn-interactive rounded-md px-2 py-1 transition-colors ${
              fontSizeScale === 'sm'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setFontSizeScale('base')}
            title="Cỡ chữ tiêu chuẩn"
            className={`btn-interactive rounded-md px-2 py-1 transition-colors ${
              fontSizeScale === 'base'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => setFontSizeScale('lg')}
            title="Cỡ chữ lớn"
            className={`btn-interactive rounded-md px-2 py-1 transition-colors ${
              fontSizeScale === 'lg'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            A+
          </button>
        </div>

        {/* Submit or Result view button */}
        {!isSubmitted ? (
          <button
            type="button"
            onClick={onOpenSubmitModal}
            className="btn-interactive inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition-all active:scale-95"
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2.2} />
            <span>Nộp bài</span>
          </button>
        ) : (
          <div className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            Đã nộp bài
          </div>
        )}
      </div>
    </header>
  )
}
