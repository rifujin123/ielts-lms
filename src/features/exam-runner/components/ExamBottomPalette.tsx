import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  BookOpen,
  CheckCircle2,
} from 'lucide-react'
import { useIeltsExamStore } from '../store/ieltsExamStore'
import { useFullExamStore } from '../store/fullExamStore'

export const ExamBottomPalette: React.FC = () => {
  const {
    manifest,
    activePassageId,
    setActivePassage,
    activeQuestionId,
    setActiveQuestion,
    answers,
    flaggedQuestions,
    submitExam,
  } = useIeltsExamStore()

  const { isSubmitted, submitFullExam } = useFullExamStore()
  const [showQuestionPills, setShowQuestionPills] = useState<boolean>(true)

  const currentPassage =
    manifest.passages.find((p) => p.id === activePassageId) || manifest.passages[0]
  const [startQ, endQ] = currentPassage.questionRange
  const questionsInCurrentPassage = manifest.questions.filter((q) => q.id >= startQ && q.id <= endQ)

  const isLastQuestionOfPassage = activeQuestionId === endQ

  // Count answered questions in current passage
  let answeredInCurrent = 0
  for (let i = startQ; i <= endQ; i++) {
    if (typeof answers[i] === 'string' && answers[i].trim() !== '') {
      answeredInCurrent++
    }
  }

  const scrollToQuestion = (id: number) => {
    const el = document.getElementById(`question-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleSelectQuestion = (id: number) => {
    setActiveQuestion(id)
    scrollToQuestion(id)
  }

  const handlePassageSwitch = (passageId: 1 | 2 | 3) => {
    setActivePassage(passageId)
    const targetPassage = manifest.passages.find((p) => p.id === passageId)
    if (targetPassage) {
      setActiveQuestion(targetPassage.questionRange[0])
    }
    const qPanel = document.getElementById('reading-questions-panel')
    if (qPanel) qPanel.scrollTop = 0
  }

  const handlePrev = () => {
    if (activeQuestionId > 1) {
      const prevId = activeQuestionId - 1
      const targetPassage = manifest.passages.find(
        (p) => prevId >= p.questionRange[0] && prevId <= p.questionRange[1],
      )
      if (targetPassage && targetPassage.id !== activePassageId) {
        setActivePassage(targetPassage.id)
      }
      setActiveQuestion(prevId)
      setTimeout(() => scrollToQuestion(prevId), 50)
    }
  }

  const handleNext = () => {
    if (activeQuestionId < manifest.totalQuestions) {
      const nextId = activeQuestionId + 1
      const targetPassage = manifest.passages.find(
        (p) => nextId >= p.questionRange[0] && nextId <= p.questionRange[1],
      )
      if (targetPassage && targetPassage.id !== activePassageId) {
        setActivePassage(targetPassage.id)
      }
      setActiveQuestion(nextId)
      setTimeout(() => scrollToQuestion(nextId), 50)
    }
  }

  const handleNextPassage = () => {
    if (activePassageId < 3) {
      handlePassageSwitch((activePassageId + 1) as 1 | 2 | 3)
    }
  }

  return (
    <footer className="sticky bottom-0 z-30 shrink-0 border-t border-slate-200 bg-white shadow-lg select-none">
      {/* ── Row 1: Mobile-Optimized Question Jump Ribbon (Swipeable & Color-Coded) ── */}
      {showQuestionPills && (
        <div className="flex items-center justify-start sm:justify-center gap-1.5 border-b border-slate-100 py-2 px-3 sm:px-4 overflow-x-auto custom-scrollbar scroll-smooth">
          {questionsInCurrentPassage.map((q) => {
            const isAnswered = typeof answers[q.id] === 'string' && answers[q.id].trim() !== ''
            const isFlagged = !!flaggedQuestions[q.id]
            const isActive = activeQuestionId === q.id

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => handleSelectQuestion(q.id)}
                title={`Câu ${q.id} - ${isAnswered ? 'Đã làm' : 'Chưa làm'}${isFlagged ? ' (Gắn cờ)' : ''}`}
                className={`btn-interactive relative flex h-7 sm:h-8 min-w-8 shrink-0 items-center justify-center rounded-xl px-2 text-xs font-bold transition-all border ${
                  isActive ? 'ring-2 ring-red-600 ring-offset-1 z-10' : ''
                } ${
                  isFlagged
                    ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-2xs'
                    : isAnswered
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-700 font-bold'
                      : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                <span>{q.id}</span>
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Row 2: Main Bottom Action Bar with 3 Passage Switcher Pills ── */}
      <div className="relative flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
        {/* Left: Collapse Toggle + Passage Count Info */}
        <div className="flex flex-1 items-center justify-start gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setShowQuestionPills(!showQuestionPills)}
            title={showQuestionPills ? 'Thu gọn hàng câu hỏi' : 'Hiện hàng câu hỏi'}
            className="btn-interactive flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showQuestionPills ? '' : 'rotate-180'
              }`}
            />
          </button>

          <div className="hidden sm:flex flex-col shrink-0">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              Passage {activePassageId}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Đã làm {answeredInCurrent} / {endQ - startQ + 1}
            </span>
          </div>
        </div>

        {/* Center: 3 Passage Switcher Pills (Pass 1, Pass 2, Pass 3) ───── */}
        <div className="flex items-center justify-center min-w-0 px-1 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2">
          {/* Mobile (< md): Single Active Passage with Half-Inset Circular Chevrons (50% in, 50% out) */}
          <div className="relative flex md:hidden items-center select-none mx-3.5">
            <button
              type="button"
              onClick={() => handlePassageSwitch((activePassageId - 1) as 1 | 2 | 3)}
              disabled={activePassageId <= 1}
              aria-label="Passage trước"
              title={
                activePassageId > 1
                  ? `Chuyển về Passage ${activePassageId - 1}`
                  : 'Đã ở Passage đầu tiên'
              }
              className="btn-interactive absolute -left-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/10 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center gap-1.5 rounded-full bg-slate-900 pl-6 pr-6 py-1 text-xs font-bold text-white shadow-xs border border-slate-800">
              <BookOpen className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>Passage {activePassageId}</span>
              <span className="rounded-full px-1.5 py-0.2 text-[10px] bg-white/20 text-white shrink-0">
                {answeredInCurrent}/{endQ - startQ + 1}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {activePassageId}/{manifest.passages.length}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handlePassageSwitch((activePassageId + 1) as 1 | 2 | 3)}
              disabled={activePassageId >= manifest.passages.length}
              aria-label="Passage sau"
              title={
                activePassageId < manifest.passages.length
                  ? `Chuyển sang Passage ${activePassageId + 1}`
                  : 'Đã ở Passage cuối cùng'
              }
              className="btn-interactive absolute -right-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/10 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Desktop (>= md): Full 3 Passages Horizontal Tabs */}
          <div className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-2xs overflow-x-auto custom-scrollbar">
            {manifest.passages.map((p) => {
              const isActive = activePassageId === p.id
              const [pStart, pEnd] = p.questionRange
              let count = 0
              for (let i = pStart; i <= pEnd; i++) {
                if (typeof answers[i] === 'string' && answers[i].trim() !== '') {
                  count++
                }
              }
              const total = pEnd - pStart + 1

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePassageSwitch(p.id)}
                  className={`btn-interactive flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Passage {p.id}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {count}/{total}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Question Prev/Next & Dynamic Next Passage Button ────────────── */}
        <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={activeQuestionId <= 1}
            className="btn-interactive flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Trước</span>
          </button>

          {isLastQuestionOfPassage ? (
            activePassageId < 3 ? (
              <button
                type="button"
                onClick={handleNextPassage}
                className="btn-interactive flex h-9 items-center gap-1.5 rounded-xl bg-red-600 px-3.5 sm:px-4 text-xs font-bold text-white hover:bg-red-700 shadow-xs active:scale-95 transition-all"
              >
                <span>Passage {activePassageId + 1}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  submitExam()
                  submitFullExam()
                }}
                disabled={isSubmitted}
                className="btn-interactive flex h-9 items-center gap-1.5 rounded-xl bg-red-600 px-4 sm:px-5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50 shadow-xs active:scale-95 transition-all"
              >
                <span>Nộp bài</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={activeQuestionId >= manifest.totalQuestions}
              className="btn-interactive flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <span className="hidden sm:inline">Sau</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </footer>
  )
}
