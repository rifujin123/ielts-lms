import React from 'react'
import { Play, Pause, RotateCcw, VolumeX, FastForward, Check } from 'lucide-react'

export interface DictationHotkeyBarProps {
  isPlaying?: boolean
  currentSpeed?: number
  isTypingFast?: boolean
  className?: string
}

/**
 * DictationHotkeyBar — Visual cheatsheet bar displayed directly below the dictation input.
 *
 * Displays:
 * [Tab] Play/Pause • [Ctrl+← / Shift+Tab] -3s • [Ctrl+→] +3s • [Alt+1/2/3] Speed • [Enter] Check
 */
export const DictationHotkeyBar: React.FC<DictationHotkeyBarProps> = ({
  isPlaying = false,
  currentSpeed = 1.0,
  isTypingFast = false,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2 rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2 text-[11px] text-secondary transition-all duration-200 ${className}`}
    >
      {/* ── Left: Main Hotkey Badges ── */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Play/Pause */}
        <div className="inline-flex items-center gap-1.5">
          <kbd className="inline-flex items-center rounded-md border border-outline bg-surface-container-lowest px-1.5 py-0.5 font-mono text-[10px] font-bold text-on-surface shadow-2xs">
            Tab
          </kbd>
          <span className="flex items-center gap-1 text-on-surface font-medium">
            {isPlaying ? (
              <>
                <Pause className="h-3 w-3 text-primary" strokeWidth={2.2} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-secondary" strokeWidth={1.75} />
                <span>Play</span>
              </>
            )}
          </span>
        </div>

        <span className="text-outline select-none">•</span>

        {/* Rewind 3s */}
        <div className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center gap-0.5">
            <kbd className="inline-flex items-center rounded-md border border-outline bg-surface-container-lowest px-1.5 py-0.5 font-mono text-[10px] font-bold text-on-surface shadow-2xs">
              Ctrl+←
            </kbd>
          </span>
          <span className="flex items-center gap-0.5 text-on-surface font-medium">
            <RotateCcw className="h-3 w-3 text-secondary" strokeWidth={1.75} />
            <span>-3s</span>
          </span>
        </div>

        <span className="text-outline select-none">•</span>

        {/* Forward 3s */}
        <div className="inline-flex items-center gap-1.5">
          <kbd className="inline-flex items-center rounded-md border border-outline bg-surface-container-lowest px-1.5 py-0.5 font-mono text-[10px] font-bold text-on-surface shadow-2xs">
            Ctrl+→
          </kbd>
          <span className="flex items-center gap-0.5 text-on-surface font-medium">
            <FastForward className="h-3 w-3 text-secondary" strokeWidth={1.75} />
            <span>+3s</span>
          </span>
        </div>

        <span className="text-outline select-none">•</span>

        {/* Speed */}
        <div className="inline-flex items-center gap-1.5">
          <kbd className="inline-flex items-center rounded-md border border-outline bg-surface-container-lowest px-1.5 py-0.5 font-mono text-[10px] font-bold text-on-surface shadow-2xs">
            Alt+1/2/3
          </kbd>
          <span className="text-on-surface font-medium">
            Speed:{' '}
            <span className="font-mono text-primary font-bold">
              {currentSpeed.toFixed(2).replace(/\.00$/, '')}x
            </span>
          </span>
        </div>

        <span className="text-outline select-none">•</span>

        {/* Check Answer */}
        <div className="inline-flex items-center gap-1.5">
          <kbd className="inline-flex items-center rounded-md border border-outline bg-surface-container-lowest px-1.5 py-0.5 font-mono text-[10px] font-bold text-on-surface shadow-2xs">
            Enter
          </kbd>
          <span className="flex items-center gap-0.5 text-on-surface font-medium">
            <Check className="h-3 w-3 text-emerald-600" strokeWidth={2.2} />
            <span>Check</span>
          </span>
        </div>
      </div>

      {/* ── Right: Ducking indicator when student is typing actively ── */}
      {isTypingFast && (
        <div className="animate-pulse inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 border border-amber-200">
          <VolumeX className="h-3 w-3 text-amber-600" strokeWidth={2.2} />
          <span>Auto-ducking: volume dampened</span>
        </div>
      )}
    </div>
  )
}

export default DictationHotkeyBar
