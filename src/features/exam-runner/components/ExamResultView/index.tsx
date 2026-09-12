import React, { useState } from 'react'
import {
  BookOpen,
  Headphones,
  RotateCcw,
  Target,
  ArrowRight,
  PenTool,
  Mic,
  MessageSquare,
} from 'lucide-react'
import { useIeltsExamStore } from '../../store/ieltsExamStore'
import { AnnotatedEssayReview } from './AnnotatedEssayReview'
import { ModelAnswerTab } from './ModelAnswerTab'
import { SpeakingFeedbackReview } from './SpeakingFeedbackReview'

export type ExamResultTab = 'OVERVIEW' | 'WRITING_ESSAY' | 'MODEL_ANSWER' | 'SPEAKING'

export interface ExamResultViewProps {
  onReviewExam: () => void
  onExit: () => void
  initialTab?: ExamResultTab
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  onReviewExam,
  onExit,
  initialTab = 'OVERVIEW',
}) => {
  const [activeTab, setActiveTab] = useState<ExamResultTab>(initialTab)
  const { scoreResult, manifest, resetExam } = useIeltsExamStore()

  // Quality feedback string based on band score
  const getBandFeedback = (band: number) => {
    if (band >= 8.5) return 'Xuất sắc! Trình độ chuyên gia ngôn ngữ (Expert User)'
    if (band >= 7.5) return 'Rất tốt! Khả năng nắm bắt ý và phân tích dẫn chứng vượt trội'
    if (band >= 6.5) return 'Tốt! Đạt tiêu chuẩn xét tuyển đại học quốc tế & định cư'
    if (band >= 5.5) return 'Khá! Cần củng cố thêm từ vựng học thuật và kỹ năng paraphrase'
    return 'Cần rèn luyện thêm phương pháp đọc hiểu Linearthinking'
  }

  const bandScore = scoreResult?.bandScore ?? 7.5
  const correctCount = scoreResult?.correctCount ?? 32
  const totalQuestions = scoreResult?.totalQuestions ?? 40
  const percentage = Math.round((correctCount / totalQuestions) * 100)
  const passageScores = scoreResult?.passageScores ?? [
    { passageId: 1, correct: 12, total: 13 },
    { passageId: 2, correct: 11, total: 13 },
    { passageId: 3, correct: 9, total: 14 },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* ── Top Navigation Tabs (Zero Pixel Shift) ──────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-1">
          <button
            type="button"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`btn-interactive flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-150 border ${
              activeTab === 'OVERVIEW'
                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Target className="h-4 w-4" strokeWidth={activeTab === 'OVERVIEW' ? 2.2 : 1.75} />
            <span>Tổng quan kết quả</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                activeTab === 'OVERVIEW' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Band {bandScore.toFixed(1)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('WRITING_ESSAY')}
            className={`btn-interactive flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-150 border ${
              activeTab === 'WRITING_ESSAY'
                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <PenTool
              className="h-4 w-4 text-slate-500"
              strokeWidth={activeTab === 'WRITING_ESSAY' ? 2.2 : 1.75}
            />
            <span>Sửa bài Writing (4 màu)</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                activeTab === 'WRITING_ESSAY'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              5 nhận xét
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('MODEL_ANSWER')}
            className={`btn-interactive flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-150 border ${
              activeTab === 'MODEL_ANSWER'
                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen
              className="h-4 w-4 text-slate-500"
              strokeWidth={activeTab === 'MODEL_ANSWER' ? 2.2 : 1.75}
            />
            <span>Bài mẫu Band 8.5+</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                activeTab === 'MODEL_ANSWER'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              Cambridge
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SPEAKING')}
            className={`btn-interactive flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all duration-150 border ${
              activeTab === 'SPEAKING'
                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Mic
              className="h-4 w-4 text-slate-500"
              strokeWidth={activeTab === 'SPEAKING' ? 2.2 : 1.75}
            />
            <span>Nhận xét Speaking</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                activeTab === 'SPEAKING' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Audio Part 1-3
            </span>
          </button>
        </div>

        {/* Global Exit button */}
        <button
          type="button"
          onClick={onExit}
          className="btn-interactive inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
        >
          <span>Về danh sách bài test</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Tab Content ────────────────────────────────────────────── */}
      {activeTab === 'OVERVIEW' && (
        <div className="max-w-md mx-auto py-6 px-3 sm:px-0 space-y-5">
          {/* Header Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Your full score and explanation
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mã đề thi: {manifest.code} • Chuẩn làm tròn IELTS IDP & British Council
            </p>
          </div>

          {/* Vertical Score Card List (Matching User Reference) */}
          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5">
                <Headphones className="h-5 w-5 text-rose-600 shrink-0" strokeWidth={1.75} />
                <span className="text-base font-medium text-slate-800">Listening</span>
              </div>
              <span className="text-base sm:text-lg font-medium text-slate-800 tabular-nums">
                7.5
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5">
                <BookOpen className="h-5 w-5 text-rose-600 shrink-0" strokeWidth={1.75} />
                <span className="text-base font-medium text-slate-800">Reading</span>
              </div>
              <span className="text-base sm:text-lg font-medium text-slate-800 tabular-nums">
                {bandScore.toFixed(1)}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5">
                <PenTool className="h-5 w-5 text-rose-600 shrink-0" strokeWidth={1.75} />
                <span className="text-base font-medium text-slate-800">Writing</span>
              </div>
              <span className="text-base sm:text-lg font-medium text-slate-800 tabular-nums">
                6.5
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-3.5">
                <MessageSquare className="h-5 w-5 text-rose-600 shrink-0" strokeWidth={1.75} />
                <span className="text-base font-medium text-slate-800">Speaking</span>
              </div>
              <span className="text-base sm:text-lg font-medium text-slate-800 tabular-nums">
                7.0
              </span>
            </div>

            {/* Overall Band Score Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white px-5 py-4.5 flex items-center justify-between shadow-xs mt-2">
              <div>
                <span className="text-base sm:text-lg font-bold text-slate-800">
                  Your overall band score
                </span>
                <div className="text-xs text-slate-500 mt-0.5">
                  Đúng {correctCount}/{totalQuestions} câu ({percentage}%) •{' '}
                  {getBandFeedback(bandScore)}
                </div>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                {bandScore.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Breakdown per Passage */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Chi tiết từng phần làm bài (Passage Breakdown)
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

          {/* Action Buttons */}
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
                className="btn-interactive flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <span>Về danh sách bài test</span>
                <ArrowRight className="h-4 w-4 text-slate-500" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'WRITING_ESSAY' && <AnnotatedEssayReview />}

      {activeTab === 'MODEL_ANSWER' && <ModelAnswerTab />}

      {activeTab === 'SPEAKING' && <SpeakingFeedbackReview />}
    </div>
  )
}

export { AnnotatedEssayReview } from './AnnotatedEssayReview'
export { ModelAnswerTab } from './ModelAnswerTab'
export { SpeakingFeedbackReview } from './SpeakingFeedbackReview'
