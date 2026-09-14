import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  BookOpen,
  Headphones,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Trash2,
  RotateCcw,
  Eye,
  Flame,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Layers,
  X,
} from 'lucide-react'
import {
  useMistakeLogStore,
  TRAP_TYPE_MAP,
  type TrapType,
  type LoggedMistake,
} from '@/store/mistakeLogStore'
import { toast } from '@/shared/components/Toast/toastStore'
import { EmptyState } from '@/shared/components'

/**
 * Pedagogical advice per trap type
 */
const TRAP_ADVICE: Record<TrapType, string> = {
  TRAP_NOT_GIVEN:
    'Bạn thường nhầm lẫn giữa thông tin mâu thuẫn (FALSE) và thông tin không được đề cập (NOT GIVEN). Hãy chú ý chỉ chọn FALSE khi có dữ liệu phủ định trực tiếp trong văn bản.',
  VOCAB_UNKNOWN:
    'Phần lớn lỗi do không nhận diện được cách paraphrase từ vựng học thuật. Hãy bôi đen các từ vựng này để lưu vào Sổ từ vựng ôn tập hàng ngày.',
  TIME_PRESSURE:
    'Lỗi do đọc lướt quá nhanh ở những phút cuối bài thi. Hãy phân bổ thời gian tối đa 20 phút cho mỗi Passage và kiểm soát nhịp làm bài.',
  AUDIO_DISTRACTION:
    'Bạn thường bị bẫy bởi thông tin mồi (distractor) trước khi đáp án thật xuất hiện. Hãy chú ý lắng nghe các liên từ chuyển hướng: however, but, actually.',
  SPELLING_ERROR:
    'Mất điểm đáng tiếc do lỗi chính tả. Hãy đặc biệt lưu ý các phụ âm nhân đôi (như accommodation, environment, unnecessary).',
}

export const MistakeLogPage: React.FC = () => {
  const navigate = useNavigate()
  const { mistakes, removeMistake, resetToDefault, clearMistakes } = useMistakeLogStore()

  const [filterSkill, setFilterSkill] = useState<'ALL' | 'READING' | 'LISTENING'>('ALL')
  const [filterTrap, setFilterTrap] = useState<TrapType | 'ALL'>('ALL')
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [reviewIndex, setReviewIndex] = useState(0)
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false)

  // ── Trap Distribution Analytics ──────────────────────────────────────────
  const distribution = useMemo(() => {
    const total = mistakes.length
    const counts: Record<TrapType, number> = {
      TRAP_NOT_GIVEN: 0,
      VOCAB_UNKNOWN: 0,
      TIME_PRESSURE: 0,
      AUDIO_DISTRACTION: 0,
      SPELLING_ERROR: 0,
    }

    mistakes.forEach((err) => {
      if (counts[err.trapType] !== undefined) {
        counts[err.trapType] += 1
      }
    })

    const trapTypes = Object.keys(TRAP_TYPE_MAP) as TrapType[]
    const items = trapTypes.map((key) => {
      const count = counts[key]
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0
      return {
        ...TRAP_TYPE_MAP[key],
        count,
        percentage,
      }
    })

    const sorted = [...items].sort((a, b) => b.count - a.count)
    const topTrap = sorted[0]?.count > 0 ? sorted[0] : null

    return { total, items, topTrap }
  }, [mistakes])

  // Filtered mistakes list
  const filteredMistakes = useMemo(() => {
    return mistakes.filter((err) => {
      if (filterSkill !== 'ALL' && err.skill.toLowerCase() !== filterSkill.toLowerCase())
        return false
      if (filterTrap !== 'ALL' && err.trapType !== filterTrap) return false
      return true
    })
  }, [mistakes, filterSkill, filterTrap])

  // Handlers
  const handleRemoveMistake = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    removeMistake(id)
    toast.success('Đã đánh dấu nắm vững câu này!', {
      description: 'Câu hỏi đã được loại khỏi danh sách cần khắc phục.',
      duration: 2500,
    })
  }

  const handleStartReview = (startIndex = 0) => {
    if (filteredMistakes.length === 0) {
      toast.info('Không có câu hỏi nào để ôn tập trong danh mục này.')
      return
    }
    setReviewIndex(startIndex)
    setIsAnswerRevealed(false)
    setIsReviewOpen(true)
  }

  const currentReviewItem: LoggedMistake | undefined = filteredMistakes[reviewIndex]

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* ── Page Header with Back Navigation ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/overview')}
            title="Quay lại Tổng quan khóa học"
            className="btn-interactive flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container shadow-xs transition-colors"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
                Sổ tay lỗi sai &amp; Bẫy đề thi (Mistake Log)
              </h1>
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                {mistakes.length} câu cần khắc phục
              </span>
            </div>
            <p className="text-body-sm text-secondary mt-0.5">
              Chẩn đoán chi tiết các dạng bẫy Cambridge thường gặp và kế hoạch khắc phục điểm yếu cá
              nhân
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 shrink-0">
          {mistakes.length > 0 && (
            <button
              type="button"
              onClick={() => handleStartReview(0)}
              className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-label-md font-bold text-on-primary shadow-xs hover:bg-primary/90 transition-all"
            >
              <Flame className="h-4 w-4 fill-amber-300 text-amber-300" />
              <span>Bắt đầu ôn tập ({filteredMistakes.length})</span>
            </button>
          )}

          {mistakes.length === 0 ? (
            <button
              type="button"
              onClick={() => {
                resetToDefault()
                toast.success('Đã khôi phục dữ liệu bài thi mẫu!')
              }}
              className="btn-interactive inline-flex items-center gap-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-xs font-bold text-on-surface hover:bg-surface-container shadow-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              Nạp mẫu câu sai
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ sổ tay lỗi sai?')) {
                  clearMistakes()
                  toast.info('Đã dọn sạch sổ tay lỗi sai.')
                }
              }}
              title="Xóa toàn bộ câu sai"
              className="btn-interactive flex h-10 w-10 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest text-secondary hover:text-rose-600 hover:border-rose-200 shadow-xs"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

      {mistakes.length > 0 && (
        <>
          {/* ── Diagnostic Analysis Banner & Distribution ───────────────────── */}
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-xs space-y-5">
            {/* Top diagnostic callout */}
            {distribution.topTrap && (
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                    <AlertTriangle className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                        Bẫy hay mắc phải nhất:
                      </span>
                      <span className="rounded-md bg-rose-200/80 px-2 py-0.5 text-xs font-bold text-rose-900">
                        {distribution.topTrap.label} ({distribution.topTrap.percentage}%)
                      </span>
                    </div>
                    <p className="text-body-sm text-rose-900/90 leading-relaxed font-normal">
                      {TRAP_ADVICE[distribution.topTrap.key] || distribution.topTrap.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Distribution Bar */}
            <div>
              <div className="flex items-center justify-between text-label-sm font-semibold text-secondary mb-2">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4" /> Phân bổ các nhóm bẫy đề thi
                </span>
                <span>{distribution.total} lỗi đã ghi nhận</span>
              </div>

              {/* Progress bar segments */}
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100 gap-0.5">
                {distribution.items
                  .filter((item) => item.count > 0)
                  .map((item) => {
                    const colorClasses: Record<TrapType, string> = {
                      TRAP_NOT_GIVEN: 'bg-rose-500',
                      VOCAB_UNKNOWN: 'bg-amber-500',
                      TIME_PRESSURE: 'bg-purple-500',
                      AUDIO_DISTRACTION: 'bg-sky-500',
                      SPELLING_ERROR: 'bg-emerald-500',
                    }
                    return (
                      <div
                        key={item.key}
                        style={{ width: `${item.percentage}%` }}
                        title={`${item.label}: ${item.count} câu (${item.percentage}%)`}
                        className={`${colorClasses[item.key]} transition-all duration-300 hover:opacity-90`}
                      />
                    )
                  })}
              </div>

              {/* Legend Badges */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {distribution.items
                  .filter((item) => item.count > 0)
                  .map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setFilterTrap(filterTrap === item.key ? 'ALL' : item.key)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium border transition-all ${
                        filterTrap === item.key
                          ? 'border-primary bg-primary text-on-primary shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      <span>{item.label}</span>
                      <span className="font-bold">({item.count})</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* ── Filters Bar (Skill Tabs & Trap Filter) ──────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant pb-3">
            {/* Skill Selector */}
            <div className="inline-flex rounded-xl bg-surface-container-low p-1 border border-outline-variant">
              {(
                [
                  { key: 'ALL', label: 'Tất cả kỹ năng' },
                  { key: 'READING', label: 'Reading' },
                  { key: 'LISTENING', label: 'Listening' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterSkill(tab.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    filterSkill === tab.key
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Clear Filter if active */}
            {(filterSkill !== 'ALL' || filterTrap !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setFilterSkill('ALL')
                  setFilterTrap('ALL')
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Xóa bộ lọc (Hiện tất cả {mistakes.length} câu)
              </button>
            )}
          </div>

          {/* ── Questions List ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            {filteredMistakes.length === 0 ? (
              <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-body-sm font-semibold text-on-surface">
                  Không có câu sai nào trong danh mục đã lọc!
                </p>
                <p className="text-xs text-secondary mt-1">
                  Chọn tab khác hoặc nhấn &quot;Hiện tất cả&quot; để xem các câu hỏi còn lại.
                </p>
              </div>
            ) : (
              filteredMistakes.map((err, index) => {
                const trapMeta = TRAP_TYPE_MAP[err.trapType]
                return (
                  <div
                    key={err.id}
                    className="card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-xs space-y-4 transition-all"
                  >
                    {/* Top Row: Meta info */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant pb-3">
                      <div className="flex items-center gap-2">
                        {err.skill.toLowerCase() === 'reading' ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                            <BookOpen className="h-4 w-4" strokeWidth={2} />
                          </div>
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                            <Headphones className="h-4 w-4" strokeWidth={2} />
                          </div>
                        )}
                        <span className="text-xs font-bold text-slate-800">
                          Câu {err.questionId}
                        </span>
                        <span className="text-xs text-secondary">• {err.testTitle}</span>
                      </div>

                      {/* Trap badge */}
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                        <AlertTriangle className="h-3 w-3" />
                        {trapMeta.label}
                      </span>
                    </div>

                    {/* Question Prompt */}
                    <div className="text-body-sm font-semibold text-slate-800 leading-relaxed">
                      {err.questionPrompt}
                    </div>

                    {/* Answers Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3 flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-rose-900 block">Bạn đã chọn:</span>
                          <span className="font-mono text-rose-800 text-sm font-semibold">
                            {err.studentAnswer || '(Bỏ trống)'}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-emerald-900 block">Đáp án đúng:</span>
                          <span className="font-mono text-emerald-800 text-sm font-semibold">
                            {err.correctAnswer}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Explanation & Reflection Notes */}
                    {err.notes && (
                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-600 flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block">
                            Chẩn đoán lý do sai:
                          </span>
                          <p className="leading-relaxed">{err.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-outline-variant">
                      <button
                        type="button"
                        onClick={() => handleStartReview(index)}
                        className="btn-interactive inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <Flame className="h-3.5 w-3.5 fill-current" />
                        Luyện tập lại câu này
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleRemoveMistake(err.id, e)}
                        className="btn-interactive inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-2.5 py-1 text-xs font-semibold text-secondary hover:text-emerald-700 hover:border-emerald-200 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Đã hiểu (Xóa khỏi sổ)
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </>
      )}

      {/* ── Empty State when zero mistakes ─────────────────────────────────── */}
      {mistakes.length === 0 && (
        <div className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-12 text-center shadow-xs">
          <EmptyState
            icon={CheckCircle2}
            title="Tuyệt vời! Sổ tay lỗi sai hiện đang trống"
            description="Bạn chưa có câu hỏi nào cần khắc phục hoặc đã làm chủ toàn bộ các bẫy đề thi vừa qua. Hãy tiếp tục làm thêm các bài Mock Test để phát hiện thêm điểm cần cải thiện."
            action={{
              label: 'Nạp dữ liệu mẫu để trải nghiệm',
              onClick: () => {
                resetToDefault()
                toast.success('Đã nạp 6 câu hỏi bẫy thi mẫu!')
              },
            }}
          />
        </div>
      )}

      {/* ── Interactive Self-Testing Review Modal ──────────────────────────── */}
      {isReviewOpen && currentReviewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fade-in-up"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 font-bold text-xs">
                  {reviewIndex + 1}
                </span>
                <span className="text-xs font-bold text-slate-800">
                  Câu hỏi {reviewIndex + 1} / {filteredMistakes.length}
                </span>
                <span className="text-xs text-slate-400">• {currentReviewItem.testTitle}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                aria-label="Đóng bài luyện tập"
                className="btn-interactive flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {/* Question Prompt */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                  Nội dung câu hỏi:
                </div>
                <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {currentReviewItem.questionPrompt}
                </div>
              </div>

              {/* Reveal Answer Section */}
              {!isAnswerRevealed ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center space-y-3">
                  <p className="text-xs text-slate-500">
                    Hãy suy nghĩ câu trả lời trong đầu trước khi xem lại đáp án và phân tích.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAnswerRevealed(true)}
                    className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-on-primary shadow-xs hover:bg-primary-hover"
                  >
                    <Eye className="h-4 w-4" />
                    Hiện đáp án &amp; Lời giải
                  </button>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in-up">
                  {/* Answers compare */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-3">
                      <span className="font-bold text-rose-900 block mb-1">
                        Đáp án cũ bạn từng chọn:
                      </span>
                      <span className="font-mono text-rose-800 text-sm font-bold">
                        {currentReviewItem.studentAnswer || '(Bỏ trống)'}
                      </span>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
                      <span className="font-bold text-emerald-900 block mb-1">
                        Đáp án chính xác:
                      </span>
                      <span className="font-mono text-emerald-800 text-sm font-bold">
                        {currentReviewItem.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {/* Notes / Explanation */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4 text-amber-600" />
                      Phân tích bẫy đề:
                    </div>
                    <p className="leading-relaxed">{currentReviewItem.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Next / Prev / Master) */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-6 py-3.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={reviewIndex === 0}
                  onClick={() => {
                    setReviewIndex((prev) => prev - 1)
                    setIsAnswerRevealed(false)
                  }}
                  className="btn-interactive flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={reviewIndex === filteredMistakes.length - 1}
                  onClick={() => {
                    setReviewIndex((prev) => prev + 1)
                    setIsAnswerRevealed(false)
                  }}
                  className="btn-interactive flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveMistake(currentReviewItem.id)
                    if (reviewIndex >= filteredMistakes.length - 1) {
                      if (filteredMistakes.length <= 1) {
                        setIsReviewOpen(false)
                      } else {
                        setReviewIndex(0)
                        setIsAnswerRevealed(false)
                      }
                    } else {
                      setIsAnswerRevealed(false)
                    }
                  }}
                  className="btn-interactive inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                >
                  <Check className="h-4 w-4" />
                  Đã làm chủ câu này
                </button>

                {reviewIndex < filteredMistakes.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setReviewIndex((prev) => prev + 1)
                      setIsAnswerRevealed(false)
                    }}
                    className="btn-interactive inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-on-primary hover:bg-primary-hover shadow-xs"
                  >
                    <span>Câu tiếp theo</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsReviewOpen(false)}
                    className="btn-interactive rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-on-primary hover:bg-primary-hover shadow-xs"
                  >
                    Hoàn tất ôn tập
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MistakeLogPage
