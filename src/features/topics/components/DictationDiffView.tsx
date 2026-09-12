import React, { useMemo } from 'react'
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { computeWordDiff } from './diffUtils'

export interface DictationDiffViewProps {
  userInput: string
  targetTranscript: string
  ipa?: string
  translation?: string
  showStats?: boolean
  onRetry?: () => void
  onNext?: () => void
  className?: string
}

/**
 * DictationDiffView — Visual comparison of student dictation input vs. target.
 *
 * Renders:
 * - Green for correct words (text-emerald-700 bg-emerald-50)
 * - Red strikethrough for wrong words (text-rose-700 bg-rose-50 line-through)
 * - Wavy grey for omitted words (text-slate-400 underline decoration-wavy)
 */
export const DictationDiffView: React.FC<DictationDiffViewProps> = ({
  userInput,
  targetTranscript,
  ipa,
  translation,
  showStats = true,
  onRetry,
  onNext,
  className = '',
}) => {
  const diffTokens = useMemo(
    () => computeWordDiff(userInput, targetTranscript),
    [userInput, targetTranscript],
  )

  const targetWordsCount = useMemo(
    () => targetTranscript.trim().split(/\s+/).filter(Boolean).length,
    [targetTranscript],
  )

  const stats = useMemo(() => {
    let correctCount = 0
    let wrongCount = 0
    let omittedCount = 0

    diffTokens.forEach((token) => {
      if (token.type === 'correct') correctCount++
      else if (token.type === 'wrong') wrongCount++
      else if (token.type === 'omitted') omittedCount++
    })

    const accuracy =
      targetWordsCount > 0 ? Math.max(0, Math.round((correctCount / targetWordsCount) * 100)) : 0

    return {
      correctCount,
      wrongCount,
      omittedCount,
      accuracy,
      isPerfect: accuracy === 100 && wrongCount === 0 && omittedCount === 0,
    }
  }, [diffTokens, targetWordsCount])

  return (
    <div
      className={`rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs transition-all duration-200 ${className}`}
    >
      {/* ── Header: Result Summary & Accuracy ── */}
      {showStats && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2">
            {stats.isPerfect ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Sparkles className="h-4 w-4" strokeWidth={2.2} />
              </div>
            ) : stats.accuracy >= 70 ? (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-primary">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertCircle className="h-4 w-4" strokeWidth={2.2} />
              </div>
            )}
            <div>
              <h4 className="text-label-md font-bold text-on-surface">
                {stats.isPerfect
                  ? 'Perfect Accuracy! 🎉'
                  : stats.accuracy >= 70
                    ? 'Good Progress! 👏'
                    : 'Needs Practice'}
              </h4>
              <p className="text-[11px] text-secondary">
                Accuracy score based on word-level LCS comparison
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-bold font-mono ${
                stats.accuracy >= 80
                  ? 'bg-emerald-100 text-emerald-800'
                  : stats.accuracy >= 50
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
              }`}
            >
              {stats.accuracy}% Match
            </span>
            <span className="text-secondary font-mono text-[11px]">
              {stats.correctCount}/{targetWordsCount} words
            </span>
          </div>
        </div>
      )}

      {/* ── Annotated Diff Sentence ── */}
      <div className="mb-4">
        <div className="text-[11px] font-semibold text-secondary uppercase tracking-wider mb-2">
          Your Transcript Analysis
        </div>
        <div className="flex flex-wrap items-baseline gap-1.5 rounded-xl border border-outline-variant bg-surface p-4 text-body-md leading-loose">
          {diffTokens.length === 0 ? (
            <span className="text-secondary italic">No input provided</span>
          ) : (
            diffTokens.map((token, idx) => {
              if (token.type === 'correct') {
                return (
                  <span
                    key={`diff-${idx}-${token.word}`}
                    className="inline-flex items-center rounded px-1.5 py-0.5 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium border border-emerald-200/70"
                    title="Correct word"
                  >
                    {token.word}
                  </span>
                )
              }
              if (token.type === 'wrong') {
                return (
                  <span
                    key={`diff-${idx}-${token.word}`}
                    className="inline-flex items-center rounded px-1.5 py-0.5 text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 line-through border border-rose-200/70 font-medium"
                    title="Incorrect / Misspelled word"
                  >
                    {token.word}
                  </span>
                )
              }
              // Omitted
              return (
                <span
                  key={`diff-${idx}-${token.word}`}
                  className="inline-flex items-center px-1 py-0.5 text-slate-400 dark:text-slate-500 underline decoration-wavy decoration-slate-400 font-normal"
                  title="Omitted word from target"
                >
                  {token.word}
                </span>
              )
            })
          )}
        </div>
      </div>

      {/* ── Target Reference Sentence & IPA / Vietnamese Translation ── */}
      <div className="space-y-2 rounded-xl border border-outline-variant bg-surface-container-low p-3.5 text-xs">
        <div className="flex items-start gap-2">
          <HelpCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" strokeWidth={1.75} />
          <div className="space-y-1 flex-1">
            <div className="font-semibold text-on-surface">
              Target: <span className="font-normal text-on-surface">{targetTranscript}</span>
            </div>
            {ipa && (
              <div className="font-mono text-secondary text-[11px]">
                IPA: <span className="text-primary">{ipa}</span>
              </div>
            )}
            {translation && <div className="text-secondary italic">Meaning: {translation}</div>}
          </div>
        </div>
      </div>

      {/* ── Diff Legend ── */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-secondary border-t border-outline-variant pt-3">
        <span className="font-semibold text-on-surface">Legend:</span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span>Correct word</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          <span>Misspelled (strikethrough)</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span>Omitted (wavy underline)</span>
        </span>
      </div>

      {/* ── Action Buttons ── */}
      {(onRetry || onNext) && (
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-outline-variant pt-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="btn-interactive inline-flex items-center gap-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-label-sm font-semibold text-secondary hover:bg-surface-container-low hover:text-on-surface transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>Try Again</span>
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="btn-interactive inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-label-sm font-bold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
            >
              <span>Next Sentence</span>
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default DictationDiffView
