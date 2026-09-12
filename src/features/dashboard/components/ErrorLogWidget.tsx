import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, RotateCcw, CheckCircle2, Flame, Layers } from 'lucide-react'
import { useErrorLogStore, TRAP_TYPE_MAP, type TrapType } from '@/store/errorLogStore'
import { toast } from '@/shared/components/Toast/toastStore'

export const ErrorLogWidget: React.FC = () => {
  const navigate = useNavigate()
  const { errors, resetToDefault } = useErrorLogStore()

  // ── Trap Distribution Analytics ──────────────────────────────────────────
  const distribution = useMemo(() => {
    const total = errors.length
    const counts: Record<TrapType, number> = {
      TRAP_NOT_GIVEN: 0,
      VOCAB_UNKNOWN: 0,
      TIME_PRESSURE: 0,
      AUDIO_DISTRACTION: 0,
      SPELLING_ERROR: 0,
    }

    errors.forEach((err) => {
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
  }, [errors])

  // Empty state if 0 errors
  if (errors.length === 0) {
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
            onClick={() => navigate('/error-log')}
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
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                {errors.length} lỗi cần khắc phục
              </span>
            </div>
            <p className="text-body-sm text-secondary mt-0.5">
              Theo dõi và rèn luyện các dạng bẫy đề thi Cambridge để tăng điểm thực chiến
            </p>
          </div>
        </div>

        {/* Action Button to navigate directly to /error-log */}
        <button
          type="button"
          onClick={() => navigate('/error-log')}
          className="btn-interactive inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-label-md font-bold text-on-primary shadow-xs hover:bg-primary/90 transition-all shrink-0"
        >
          <Flame className="h-4 w-4 fill-amber-300 text-amber-300" />
          <span>Mở sổ tay &amp; Luyện tập ({errors.length})</span>
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {/* Top Trap Callout Banner */}
      {distribution.topTrap && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex h-2 w-2 rounded-full bg-rose-600 shrink-0" />
            <span className="text-xs text-rose-900 font-medium">
              Bẫy hay gặp nhất:{' '}
              <strong className="font-bold text-rose-950">
                {distribution.topTrap.label} ({distribution.topTrap.percentage}%)
              </strong>{' '}
              — {distribution.topTrap.description}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/error-log')}
            className="text-xs font-bold text-rose-700 hover:text-rose-900 hover:underline shrink-0 inline-flex items-center gap-1"
          >
            <span>Chi tiết bẫy</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Mini Multi-colored Distribution Bar & Legend Chips */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs text-secondary font-medium">
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-secondary" /> Phân bổ tỷ lệ bẫy đề
          </span>
          <span className="text-slate-500 font-semibold">{distribution.total} câu hỏi</span>
        </div>

        {/* Progress bar */}
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 gap-0.5">
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

        {/* Quick Legend Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {distribution.items
            .filter((item) => item.count > 0)
            .map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate('/error-log')}
                className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-slate-500 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
                <span className="font-bold text-slate-900">({item.count})</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ErrorLogWidget
