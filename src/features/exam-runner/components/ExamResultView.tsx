import React from 'react'
import { Award, CheckCircle2, RotateCcw, BookOpen, ArrowRight, Target } from 'lucide-react'
import { useIeltsExamStore } from '../store/ieltsExamStore'

interface ExamResultViewProps {
  onReviewExam: () => void
  onExit: () => void
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({ onReviewExam, onExit }) => {
  const { scoreResult, manifest, resetExam } = useIeltsExamStore()

  if (!scoreResult) return null

  const { correctCount, totalQuestions, bandScore, passageScores } = scoreResult
  const percentage = Math.round((correctCount / totalQuestions) * 100)

  // Quality feedback string based on band score
  const getBandFeedback = (band: number) => {
    if (band >= 8.5) return 'Xuất sắc! Trình độ chuyên gia ngôn ngữ (Expert User)'
    if (band >= 7.5) return 'Rất tốt! Khả năng nắm bắt ý và phân tích dẫn chứng vượt trội'
    if (band >= 6.5) return 'Tốt! Đạt tiêu chuẩn xét tuyển đại học quốc tế & định cư'
    if (band >= 5.5) return 'Khá! Cần củng cố thêm từ vựng học thuật và kỹ năng paraphrase'
    return 'Cần rèn luyện thêm phương pháp đọc hiểu Linearthinking'
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl">
        {/* ── Top Badge & Title ────────────────────────────────────── */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/50 mb-3 shadow-xs">
            <Award className="h-9 w-9" strokeWidth={2} />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
            <Target className="h-3.5 w-3.5 text-red-600" />
            Kết Quả Bài Thi IELTS Academic Reading
          </span>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{manifest.title}</h2>
          <p className="mt-1 text-xs text-slate-500">
            Mã đề thi: {manifest.code} • Chuẩn khảo thí Cambridge
          </p>
        </div>

        {/* ── Big Band Score Display ───────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white text-center shadow-lg mb-6">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
              IELTS READING BAND SCORE
            </span>
            <div className="my-1 font-serif text-6xl font-extrabold tracking-tight text-white">
              {bandScore.toFixed(1)}
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-300 mt-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Đúng:{' '}
                <strong className="text-white">
                  {correctCount} / {totalQuestions} câu
                </strong>
              </span>
              <span>•</span>
              <span>
                Tỷ lệ chính xác: <strong className="text-white">{percentage}%</strong>
              </span>
            </div>
            <div className="mt-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-slate-200">
              {getBandFeedback(bandScore)}
            </div>
          </div>
        </div>

        {/* ── Breakdown per Passage ─────────────────────────────────── */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Chi tiết từng bài đọc (Passage Breakdown)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {passageScores.map((ps) => {
              const pRatio = Math.round((ps.correct / ps.total) * 100)
              return (
                <div
                  key={ps.passageId}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-center"
                >
                  <div className="text-xs font-bold text-slate-800">Passage {ps.passageId}</div>
                  <div className="my-1 text-xl font-extrabold text-slate-900">
                    {ps.correct}{' '}
                    <span className="text-xs font-normal text-slate-400">/ {ps.total}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    Chính xác {pRatio}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Action Buttons ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onReviewExam}
            className="btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
          >
            <BookOpen className="h-4 w-4" />
            <span>Xem lại bài làm & Dẫn chứng chi tiết</span>
          </button>

          <div className="flex w-full sm:w-auto items-center gap-2">
            <button
              type="button"
              onClick={resetExam}
              className="btn-interactive flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Làm lại</span>
            </button>

            <button
              type="button"
              onClick={onExit}
              className="btn-interactive flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-3 text-xs font-bold text-white hover:bg-red-700 shadow-xs"
            >
              <span>Về danh sách bài test</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
