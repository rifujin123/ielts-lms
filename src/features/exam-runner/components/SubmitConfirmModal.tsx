import React from 'react'
import { AlertTriangle, CheckCircle2, Flag, X } from 'lucide-react'
import { useIeltsExamStore } from '../store/ieltsExamStore'

interface SubmitConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirmSubmit: () => void
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
}) => {
  const { manifest, answers, flaggedQuestions } = useIeltsExamStore()

  if (!isOpen) return null

  const answeredQuestionIds = Object.keys(answers)
    .map(Number)
    .filter((id) => (answers[id] || '').trim() !== '')

  const unansweredQuestions = manifest.questions
    .filter((q) => !answeredQuestionIds.includes(q.id))
    .map((q) => q.id)

  const flaggedQuestionIds = Object.keys(flaggedQuestions)
    .map(Number)
    .filter((id) => flaggedQuestions[id])

  const totalAnswered = answeredQuestionIds.length
  const totalQuestions = manifest.totalQuestions

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in-up">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="btn-interactive absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200">
            <AlertTriangle className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Xác nhận nộp bài</h3>
            <p className="text-xs text-slate-500">
              Kiểm tra kỹ lưỡng các câu trả lời trước khi thu bài
            </p>
          </div>
        </div>

        {/* ── Summary Stats ─────────────────────────────────────────── */}
        <div className="space-y-3 rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs mb-5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Số câu đã hoàn thành:
            </span>
            <span className="font-bold text-slate-900">
              {totalAnswered} / {totalQuestions} câu
            </span>
          </div>

          {unansweredQuestions.length > 0 && (
            <div className="flex flex-col gap-1 border-t border-slate-200/60 pt-2 text-red-600">
              <div className="flex items-center justify-between font-bold">
                <span>Số câu chưa trả lời:</span>
                <span>{unansweredQuestions.length} câu</span>
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2">
                Danh sách: {unansweredQuestions.map((q) => `Câu ${q}`).join(', ')}
              </div>
            </div>
          )}

          {flaggedQuestionIds.length > 0 && (
            <div className="flex flex-col gap-1 border-t border-slate-200/60 pt-2 text-slate-800">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <Flag className="h-3.5 w-3.5 fill-slate-900 text-slate-900" />
                  Đang gắn cờ xem lại:
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-800 font-bold border border-slate-200">
                  {flaggedQuestionIds.length} câu
                </span>
              </div>
              <div className="text-[11px] text-slate-500 line-clamp-2">
                Danh sách: {flaggedQuestionIds.map((q) => `Câu ${q}`).join(', ')}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          Sau khi nộp bài, hệ thống sẽ tự động chấm điểm và hiển thị kết quả Band Score kèm theo
          phân tích dẫn chứng chi tiết từng câu hỏi.
        </p>

        {/* ── Action Buttons ────────────────────────────────────────── */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-interactive rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
          >
            Tiếp tục làm bài
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmSubmit()
              onClose()
            }}
            className="btn-interactive rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs"
          >
            Đồng ý nộp bài
          </button>
        </div>
      </div>
    </div>
  )
}
