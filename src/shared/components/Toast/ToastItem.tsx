import React, { useEffect, useState, useRef, useCallback } from 'react'
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import type { ToastItem as ToastItemType } from './toastStore'

interface ToastItemProps {
  item: ToastItemType
  onDismiss: (id: string) => void
}

export const ToastItem: React.FC<ToastItemProps> = ({ item, onDismiss }) => {
  const [isLeaving, setIsLeaving] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const remainingTimeRef = useRef<number>(item.duration ?? 4500)
  const startTimeRef = useRef<number>(Date.now())

  const triggerDismiss = useCallback(() => {
    setIsLeaving(true)
    // Wait for exit animation (180ms) before removing from store
    setTimeout(() => {
      onDismiss(item.id)
    }, 180)
  }, [item.id, onDismiss])

  // Timer handling with hover pause capability
  useEffect(() => {
    if (!item.duration || item.duration <= 0) return

    if (!isPaused) {
      startTimeRef.current = Date.now()
      timerRef.current = setTimeout(() => {
        triggerDismiss()
      }, remainingTimeRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isPaused, item.duration, triggerDismiss])

  const handleMouseEnter = () => {
    if (!item.duration || item.duration <= 0) return
    setIsPaused(true)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    const elapsed = Date.now() - startTimeRef.current
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed)
  }

  const handleMouseLeave = () => {
    if (!item.duration || item.duration <= 0) return
    setIsPaused(false)
  }

  // Type configuration
  const typeConfig = {
    error: {
      icon: AlertOctagon,
      containerClasses:
        'border-rose-200/90 bg-white/95 text-slate-900 shadow-lg shadow-rose-950/5 ring-1 ring-rose-500/15',
      iconBoxClasses: 'bg-rose-50 border-rose-100 text-rose-600',
      progressBarClasses: 'bg-rose-500',
    },
    warning: {
      icon: AlertTriangle,
      containerClasses:
        'border-amber-200/90 bg-white/95 text-slate-900 shadow-lg shadow-amber-950/5 ring-1 ring-amber-500/15',
      iconBoxClasses: 'bg-amber-50 border-amber-100 text-amber-600',
      progressBarClasses: 'bg-amber-500',
    },
    success: {
      icon: CheckCircle2,
      containerClasses:
        'border-emerald-200/90 bg-white/95 text-slate-900 shadow-lg shadow-emerald-950/5 ring-1 ring-emerald-500/15',
      iconBoxClasses: 'bg-emerald-50 border-emerald-100 text-emerald-600',
      progressBarClasses: 'bg-emerald-500',
    },
    info: {
      icon: Info,
      containerClasses:
        'border-slate-200/90 bg-white/95 text-slate-900 shadow-lg shadow-slate-950/5 ring-1 ring-slate-900/10',
      iconBoxClasses: 'bg-slate-100 border-slate-200 text-slate-700',
      progressBarClasses: 'bg-slate-700',
    },
  }[item.type]

  const Icon = typeConfig.icon

  return (
    <div
      role="alert"
      aria-live={item.type === 'error' ? 'assertive' : 'polite'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto relative overflow-hidden rounded-xl border p-4 backdrop-blur-md transition-all ${
        typeConfig.containerClasses
      } ${isLeaving ? 'animate-toast-out' : 'animate-toast-in'}`}
    >
      <div className="flex items-start gap-3">
        {/* Semantic Icon Box */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${typeConfig.iconBoxClasses}`}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>

        {/* Content */}
        <div className="flex-1 pr-2 pt-0.5">
          <div className="text-body-sm font-semibold text-slate-900 leading-snug">{item.title}</div>
          {item.description && (
            <p className="mt-1 text-label-sm text-slate-600 leading-relaxed break-words">
              {item.description}
            </p>
          )}

          {/* Action Button if provided (e.g., Thử lại) */}
          {item.action && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => {
                  item.action?.onClick()
                  triggerDismiss()
                }}
                className="btn-interactive inline-flex items-center rounded-lg bg-slate-900 px-3 py-1 text-label-sm font-semibold text-white hover:bg-slate-800 shadow-xs"
              >
                {item.action.label}
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={triggerDismiss}
          aria-label="Đóng thông báo"
          className="btn-interactive -mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      {/* Subtle Progress Bar */}
      {item.duration && item.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100/60 overflow-hidden">
          <div
            className={`h-full ${typeConfig.progressBarClasses}`}
            style={{
              animation: `toastProgress ${item.duration}ms linear forwards`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        </div>
      )}
    </div>
  )
}
