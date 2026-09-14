import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, RotateCcw, CheckCircle2, Flame, Layers } from 'lucide-react'
import { useMistakeLogStore, TRAP_TYPE_MAP, type TrapType } from '@/store/mistakeLogStore'
import { toast } from '@/shared/components/Toast/toastStore'

export const MistakeLogWidget: React.FC = () => {
  const navigate = useNavigate()
  const { mistakes, resetToDefault } = useMistakeLogStore()

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

  // Empty state if 0 mistakes
  if (mistakes.length === 0) {
    return (
      <div className="card-interactive flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-2xs">
            <CheckCircle2 className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-label-lg font-bold text-on-surface">
              Sổ tay phân tích lỗi sai: Đã làm chủ 100%
            </h3>
            <p className="text-body-sm text-secondary mt-0.5">
              Bạn chưa có câu hỏi nào cần khắc phục. Hãy tiếp tục làm thêm các bài Mock Test để phát
              hiện thêm điểm cần cải thiện.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              resetToDefault()
              toast.success('Đã nạp 6 câu hỏi bẫy thi mẫu!')
            }}
            className="btn-interactive inline-flex items-center gap-1.5 rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-xs font-bold text-on-surface hover:bg-surface-container shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
            Nạp mẫu lỗi
          </button>
          <button
            type="button"
            onClick={() => navigate('/mistake-log')}
            className="btn-interactive inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-on-primary shadow-xs hover:bg-primary/90"
          >
            <span>Mở sổ tay</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header with Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-2xs">
            <AlertTriangle className="h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-label-lg font-bold text-on-surface">
                Sổ tay phân tích bẫy đề &amp; Lỗi sai
              </h3>
              <span className="rounded-full bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 text-[11px] font-bold">
                {distribution.total} câu cần khắc phục
              </span>
            </div>
            <p className="text-body-sm text-secondary mt-0.5">
              Hệ thống tự động ghi nhận các dạng bẫy thí sinh hay mắc phải để tập trung ôn luyện
              trước kỳ thi thật.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/mistake-log')}
          className="btn-interactive self-start sm:self-auto inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-on-primary shadow-xs hover:bg-primary-hover"
        >
          <span>Ôn tập bẫy đề</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Trap Distribution Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Top Trap Insight */}
        {distribution.topTrap && (
          <div className="lg:col-span-4 rounded-xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
              <Flame className="h-4 w-4 text-amber-600" />
              <span>Bẫy gặp nhiều nhất ({distribution.topTrap.percentage}%)</span>
            </div>
            <div className="text-sm font-bold text-on-surface">{distribution.topTrap.label}</div>
            <p className="text-xs text-secondary leading-snug">
              {distribution.topTrap.description}
            </p>
          </div>
        )}

        {/* Stacked Percentage Bar + Badges */}
        <div
          className={
            distribution.topTrap ? 'lg:col-span-8 space-y-2.5' : 'lg:col-span-12 space-y-2.5'
          }
        >
          <div className="flex items-center justify-between text-xs font-medium text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-secondary" />
              Tỷ trọng phân bổ các bẫy đề thi
            </span>
            <span className="font-bold text-on-surface">{distribution.total} câu sai</span>
          </div>

          {/* Continuous Multi-Segment Bar */}
          <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container-high flex">
            {distribution.items
              .filter((item) => item.count > 0)
              .map((item) => (
                <div
                  key={item.key}
                  style={{ width: `${item.percentage}%` }}
                  title={`${item.label}: ${item.count} câu (${item.percentage}%)`}
                  className={`${item.barColor} transition-all duration-300 hover:opacity-80`}
                />
              ))}
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {distribution.items
              .filter((item) => item.count > 0)
              .map((item) => (
                <div
                  key={item.key}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-medium ${item.badgeClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${item.barColor}`} />
                  <span>{item.shortLabel}</span>
                  <span className="font-bold">({item.count})</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MistakeLogWidget
