import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { Award, GripVertical } from 'lucide-react'
import { useIeltsExamStore } from './store/ieltsExamStore'
import { ExamHeader } from './components/ExamHeader'
import { ExamBottomPalette } from './components/ExamBottomPalette'
import { ReadingPassageView } from './components/ReadingPassageView'
import { QuestionCard } from './components/QuestionCard'
import { SubmitConfirmModal } from './components/SubmitConfirmModal'
import { ExamResultView } from './components/ExamResultView'

export const ExamRunnerPage: React.FC = () => {
  const navigate = useNavigate()
  const { manifest, activePassageId, isSubmitted, submitExam, scoreResult } = useIeltsExamStore()

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)
  const [showResultSummary, setShowResultSummary] = useState(isSubmitted)

  const currentPassage = manifest.passages.find((p) => p.id === activePassageId)
  const [startQ, endQ] = currentPassage ? currentPassage.questionRange : [1, 13]
  const currentQuestions = manifest.questions.filter((q) => q.id >= startQ && q.id <= endQ)

  const handleConfirmSubmit = () => {
    submitExam()
    setShowResultSummary(true)
  }

  const handleExit = () => {
    navigate('/tests')
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 select-none">
      {/* ── Fixed Top Exam Header ──────────────────────────────────── */}
      <ExamHeader onOpenSubmitModal={() => setIsSubmitModalOpen(true)} onExitExam={handleExit} />

      {/* ── Main View (Score Summary vs Live Split Pane) ───────────── */}
      {isSubmitted && showResultSummary ? (
        <div className="flex-1 overflow-y-auto">
          <ExamResultView onReviewExam={() => setShowResultSummary(false)} onExit={handleExit} />
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Subtle Banner when in Review Mode */}
          {isSubmitted && (
            <div className="flex items-center justify-between border-b border-emerald-200 bg-emerald-50 px-6 py-2 text-xs font-semibold text-emerald-800">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600" />
                <span>
                  Chế độ xem lại bài thi: IELTS Band {scoreResult?.bandScore.toFixed(1)} (
                  {scoreResult?.correctCount}/{scoreResult?.totalQuestions} câu đúng)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowResultSummary(true)}
                className="btn-interactive rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Xem bảng điểm tổng thể
              </button>
            </div>
          )}

          {/* Dual-Pane Resizable Layout */}
          <div className="flex-1 overflow-hidden">
            <Group orientation="horizontal" id="ielts-reading-cbt-split" className="h-full">
              {/* Left Pane: Reading Passage */}
              <Panel defaultSize="48%" minSize="30%" className="h-full">
                <ReadingPassageView />
              </Panel>

              {/* Draggable Resize Handle with zero layout shift */}
              <Separator className="group relative flex w-2.5 items-center justify-center bg-slate-200/80 hover:bg-red-500/20 transition-colors cursor-col-resize select-none">
                <div className="flex h-8 w-1.5 items-center justify-center rounded-full bg-slate-400 group-hover:bg-red-600 transition-colors">
                  <GripVertical className="h-3 w-3 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </Separator>

              {/* Right Pane: Questions corresponding to current passage */}
              <Panel
                defaultSize="52%"
                minSize="35%"
                className="h-full overflow-y-auto bg-slate-100/70 p-6 md:p-8 custom-scrollbar"
              >
                <div className="mx-auto max-w-3xl space-y-5">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                      Questions {startQ} – {endQ}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {currentPassage?.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Đọc kỹ đoạn văn ở khung bên trái và hoàn thành các câu hỏi tương ứng bên dưới.
                    </p>
                  </div>

                  {/* Question Cards List */}
                  <div className="space-y-4">
                    {currentQuestions.map((q) => (
                      <QuestionCard key={q.id} question={q} />
                    ))}
                  </div>
                </div>
              </Panel>
            </Group>
          </div>
        </div>
      )}

      {/* ── Fixed Bottom Palette (Matrix Navigation) ───────────────── */}
      {!showResultSummary && <ExamBottomPalette />}

      {/* ── Submit Confirmation Dialog ─────────────────────────────── */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
      />
    </div>
  )
}

export default ExamRunnerPage
