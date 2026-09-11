import React from 'react'
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react'
import { useIeltsExamStore } from '../store/ieltsExamStore'

export const ExamBottomPalette: React.FC = () => {
  const {
    manifest,
    activePassageId,
    setActivePassage,
    activeQuestionId,
    setActiveQuestion,
    answers,
    flaggedQuestions,
    toggleFlag,
  } = useIeltsExamStore()

  const isCurrentFlagged = !!flaggedQuestions[activeQuestionId]

  // Count answered questions
  const answeredCount = Object.values(answers).filter(
    (val) => typeof val === 'string' && val.trim() !== '',
  ).length

  // Navigate to previous/next question
  const handlePrev = () => {
    if (activeQuestionId > 1) {
      const nextId = activeQuestionId - 1
      setActiveQuestion(nextId)
      scrollToQuestion(nextId)
    }
  }

  const handleNext = () => {
    if (activeQuestionId < manifest.totalQuestions) {
      const nextId = activeQuestionId + 1
      setActiveQuestion(nextId)
      scrollToQuestion(nextId)
    }
  }

  const scrollToQuestion = (id: number) => {
    const el = document.getElementById(`question-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleSelectQuestion = (id: number, passageId: 1 | 2 | 3) => {
    if (passageId !== activePassageId) {
      setActivePassage(passageId)
    }
    setActiveQuestion(id)
    setTimeout(() => scrollToQuestion(id), 50)
  }

  return (
    <footer className="sticky bottom-0 z-30 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-2.5 shadow-lg">
      {/* ── Left Status & Review Checkbox ─────────────────────────── */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => toggleFlag(activeQuestionId)}
          className={`btn-interactive flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            isCurrentFlagged
              ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300'
              : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flag
            className={`h-3.5 w-3.5 ${isCurrentFlagged ? 'fill-amber-500 text-amber-600' : ''}`}
            strokeWidth={2}
          />
          <span>Đánh dấu xem lại câu {activeQuestionId}</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Tiến độ:</span>
          <span className="font-bold text-slate-900">
            {answeredCount} / {manifest.totalQuestions}
          </span>
          <span className="text-slate-300">•</span>
          <span>Đang làm:</span>
          <span className="font-bold text-red-600">Câu {activeQuestionId}</span>
        </div>
      </div>

      {/* ── Center: Question Matrix (1 to 40) ──────────────────────── */}
      <div className="flex flex-1 max-w-2xl items-center justify-center gap-1.5 overflow-x-auto py-1 custom-scrollbar">
        {manifest.passages.map((p) => {
          const [start, end] = p.questionRange
          const questionsInPassage = manifest.questions.filter((q) => q.id >= start && q.id <= end)

          return (
            <div
              key={p.id}
              className={`flex items-center gap-1 px-1.5 py-1 rounded-lg ${
                activePassageId === p.id ? 'bg-slate-100/80 ring-1 ring-slate-200' : ''
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 mr-1 hidden xl:inline">
                P{p.id}:
              </span>
              {questionsInPassage.map((q) => {
                const isAnswered = typeof answers[q.id] === 'string' && answers[q.id].trim() !== ''
                const isFlagged = !!flaggedQuestions[q.id]
                const isActive = activeQuestionId === q.id

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleSelectQuestion(q.id, p.id)}
                    title={`Câu ${q.id} - ${isAnswered ? 'Đã làm' : 'Chưa làm'}${isFlagged ? ' (Có gắn cờ)' : ''}`}
                    className={`btn-interactive relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold transition-all ${
                      isActive ? 'border-2 border-red-600 ring-2 ring-red-600/20' : 'border'
                    } ${
                      isAnswered
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span>{q.id}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500 ring-1 ring-white" />
                    )}
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ── Right: Previous & Next Buttons ────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeQuestionId <= 1}
          className="btn-interactive flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Câu trước</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={activeQuestionId >= manifest.totalQuestions}
          className="btn-interactive flex h-9 items-center gap-1 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
        >
          <span className="hidden sm:inline">Câu sau</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </footer>
  )
}
