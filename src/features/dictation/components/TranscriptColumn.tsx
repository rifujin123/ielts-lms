import React, { useEffect, useRef } from 'react'
import { FileText, Check, Lock, RotateCcw } from 'lucide-react'
import type { DictationSentence, UserSentenceAttempt } from '../types'

interface TranscriptColumnProps {
  sentences: DictationSentence[]
  activeSentenceIndex: number
  userAttempts: Record<number, UserSentenceAttempt>
  onSelectSentence: (index: number) => void
  onWordClick: (word: string) => void
  onResetLesson: () => void
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(Math.max(0, seconds) / 60)
  const secs = Math.floor(Math.max(0, seconds) % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const TranscriptColumn: React.FC<TranscriptColumnProps> = ({
  sentences,
  activeSentenceIndex,
  userAttempts,
  onSelectSentence,
  onWordClick,
  onResetLesson,
}) => {
  const completedCount = Object.values(userAttempts).filter((a) => a.correct).length
  const totalCount = sentences.length
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const listContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll active sentence into view smoothly
  useEffect(() => {
    const activeEl = document.getElementById(`transcript-item-${activeSentenceIndex}`)
    if (activeEl && listContainerRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [activeSentenceIndex])

  return (
    <aside className="flex flex-col rounded-2xl border border-outline-variant/80 bg-surface-container-lowest p-4 shadow-xs overflow-hidden h-full max-h-[min(720px,calc(100vh-200px))]">
      {/* ── Header & Progress ── */}
      <div className="border-b border-outline-variant/70 pb-3 shrink-0">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-primary" strokeWidth={2} />
            <span>Transcript</span>
          </h2>
          <span className="rounded-full bg-tertiary-container px-2.5 py-0.5 font-mono text-xs font-bold text-on-tertiary-container">
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
          <div
            className="h-full bg-tertiary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-secondary">
          <span>
            {completedCount}/{totalCount} completed
          </span>
        </div>
      </div>

      {/* ── Scrollable Segment List with symmetric horizontal padding ── */}
      <div
        ref={listContainerRef}
        className="custom-scrollbar flex-1 min-h-0 space-y-2 overflow-y-auto px-2.5 py-2.5"
      >
        {sentences.map((sentence, idx) => {
          const isActive = idx === activeSentenceIndex
          const isDone = userAttempts[idx]?.correct

          return (
            <div
              key={sentence.id}
              id={`transcript-item-${idx}`}
              onClick={() => onSelectSentence(idx)}
              className={`cursor-pointer rounded-xl border border-l-4 p-3 transition-all select-none ${
                isActive
                  ? 'border-outline-variant/80 border-l-primary bg-primary/[0.04] shadow-xs'
                  : isDone
                    ? 'border-outline-variant/70 border-l-tertiary/80 bg-tertiary/[0.03] hover:bg-tertiary/[0.06]'
                    : 'border-outline-variant/60 border-l-transparent bg-surface-container-low/50 hover:bg-surface-container-low hover:border-outline-variant'
              }`}
            >
              {/* Row Header: Number badge, Timestamp & Status */}
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                      isActive
                        ? 'bg-primary text-on-primary'
                        : isDone
                          ? 'bg-tertiary text-on-tertiary'
                          : 'bg-surface-container-highest text-secondary'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="font-mono text-[11px] text-secondary">
                    {formatTime(sentence.start)}
                  </span>
                </div>

                {isDone ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-tertiary-container/60 px-2 py-0.5 text-[10px] font-bold text-on-tertiary-container">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                    <span>Done</span>
                  </span>
                ) : isActive ? (
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    Listening
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] text-secondary/50">
                    <Lock className="h-3 w-3" />
                  </span>
                )}
              </div>

              {/* Row Body: Masked representation or real text with dictionary clicks */}
              {isDone || isActive ? (
                <div className="overflow-hidden">
                  <p className="text-body-sm font-medium leading-relaxed text-on-surface break-words whitespace-normal">
                    {sentence.text.split(' ').map((word, wIdx) => {
                      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'!]/g, '')
                      return (
                        <span
                          key={wIdx}
                          onClick={(e) => {
                            e.stopPropagation()
                            onWordClick(cleanWord)
                          }}
                          className="hover:text-primary hover:underline underline-offset-2 decoration-dotted decoration-outline cursor-pointer mr-1 inline-block"
                          title="Click to look up word"
                        >
                          {word}
                        </span>
                      )
                    })}
                  </p>
                  {isDone && sentence.vi && (
                    <p className="mt-1 text-[11px] italic text-secondary break-words whitespace-normal">
                      {sentence.vi}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 py-1 text-secondary/40 select-none">
                  <div className="h-1.5 w-16 rounded-full bg-surface-container-highest/60" />
                  <div className="h-1.5 w-24 rounded-full bg-surface-container-highest/60" />
                  <div className="h-1.5 w-12 rounded-full bg-surface-container-highest/60" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Bottom Reset Action ── */}
      <div className="mt-3 flex items-center justify-between border-t border-outline-variant/70 pt-3 text-xs text-secondary shrink-0">
        <span className="text-[11px] text-secondary/70">Click segment to jump</span>
        <button
          type="button"
          onClick={onResetLesson}
          className="btn-interactive inline-flex items-center gap-1.5 rounded-full border border-outline-variant/80 bg-surface-container-low px-3 py-1 text-xs font-semibold text-secondary hover:bg-error/10 hover:border-error/30 hover:text-error transition-colors"
        >
          <RotateCcw className="h-3 w-3" strokeWidth={2} />
          <span>Restart</span>
        </button>
      </div>
    </aside>
  )
}
