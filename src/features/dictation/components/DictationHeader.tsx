import React from 'react'
import { ChevronLeft, Eye, EyeOff, BookMarked, CheckCircle2 } from 'lucide-react'

interface DictationHeaderProps {
  lessonTitle: string
  lessonCategory?: string
  isMediaHidden: boolean
  onToggleMedia: () => void
  isTranscriptHidden: boolean
  onToggleTranscript: () => void
  completedCount: number
  totalCount: number
  vocabCount: number
  onOpenNotebook: () => void
  onBackToTopics?: () => void
}

export const DictationHeader: React.FC<DictationHeaderProps> = ({
  lessonTitle,
  lessonCategory,
  isMediaHidden,
  onToggleMedia,
  isTranscriptHidden,
  onToggleTranscript,
  completedCount,
  totalCount,
  vocabCount,
  onOpenNotebook,
  onBackToTopics,
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <header className="rounded-2xl border border-outline-variant/80 bg-surface-container-lowest px-4 sm:px-5 py-3 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Back button, Category pill & Lesson Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          {onBackToTopics && (
            <button
              type="button"
              onClick={onBackToTopics}
              className="btn-interactive inline-flex items-center gap-1 rounded-full border border-outline-variant/80 bg-surface-container-low px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-surface-container hover:text-on-surface transition-colors shrink-0"
              title="Back to topics list"
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2} />
              <span>Topics</span>
            </button>
          )}

          {lessonCategory && (
            <span className="hidden sm:inline-flex items-center rounded-full bg-secondary-container px-2.5 py-0.5 text-[11px] font-semibold text-on-secondary-container shrink-0">
              {lessonCategory}
            </span>
          )}

          <h1 className="text-body-lg sm:text-headline-sm font-bold text-on-surface truncate">
            {lessonTitle}
          </h1>
        </div>

        {/* Right: View Toggles, Progress Pill & Vocab Notebook */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 self-end md:self-auto shrink-0">
          {/* Hide/Show Media Toggle Pill */}
          <button
            type="button"
            onClick={onToggleMedia}
            className={`btn-interactive inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              isMediaHidden
                ? 'border-primary/40 bg-primary/10 text-primary font-semibold'
                : 'border-outline-variant/80 bg-surface-container-low text-secondary hover:bg-surface-container hover:text-on-surface'
            }`}
            title={isMediaHidden ? 'Show video' : 'Hide video'}
          >
            {isMediaHidden ? (
              <>
                <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>Show media</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>Hide media</span>
              </>
            )}
          </button>

          {/* Hide/Show Transcript Toggle Pill */}
          <button
            type="button"
            onClick={onToggleTranscript}
            className={`btn-interactive inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
              isTranscriptHidden
                ? 'border-primary/40 bg-primary/10 text-primary font-semibold'
                : 'border-outline-variant/80 bg-surface-container-low text-secondary hover:bg-surface-container hover:text-on-surface'
            }`}
            title={isTranscriptHidden ? 'Show transcript' : 'Hide transcript'}
          >
            {isTranscriptHidden ? (
              <>
                <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>Show transcript</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>Hide transcript</span>
              </>
            )}
          </button>

          {/* Progress Pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-low px-3 py-1 text-xs font-semibold text-secondary">
            <CheckCircle2 className="h-3.5 w-3.5 text-tertiary" strokeWidth={2} />
            <span className="font-mono text-on-surface font-bold">
              {completedCount}/{totalCount}
            </span>
            <span className="text-secondary/70">({percentage}%)</span>
          </div>

          {/* Vocabulary Notebook Button */}
          <button
            type="button"
            onClick={onOpenNotebook}
            className="btn-interactive inline-flex items-center gap-2 rounded-full border border-outline-variant/80 bg-surface-container-lowest px-3.5 py-1.5 text-xs font-semibold text-on-surface hover:border-primary/40 hover:bg-surface-container transition-all shadow-xs"
          >
            <BookMarked className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
            <span>Notebook</span>
            {vocabCount > 0 && (
              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-1.5 py-0.2 font-mono text-[10px] font-bold text-primary">
                {vocabCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
