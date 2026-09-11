import React from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Repeat,
  Volume2,
  Volume1,
  VolumeX,
  Clock,
} from 'lucide-react'

interface VideoPlayerColumnProps {
  activeSentenceIndex: number
  totalSentences: number
  isPlaying: boolean
  playedSec: number
  durationSec: number
  playbackSpeed: number
  autoLoop: boolean
  isLoading: boolean
  volume: number
  isMuted: boolean
  onTogglePlay: () => void
  onReplay: () => void
  onPrevSentence: () => void
  onNextSentence: () => void
  onChangeSpeed: (speed: number) => void
  onToggleAutoLoop: (loop: boolean) => void
  onChangeVolume: (volume: number) => void
  onToggleMute: () => void
}

const SPEED_OPTIONS = [0.5, 0.75, 0.85, 1.0, 1.25]

const formatTime = (seconds: number): string => {
  const mins = Math.floor(Math.max(0, seconds) / 60)
  const secs = Math.floor(Math.max(0, seconds) % 60)
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export const VideoPlayerColumn: React.FC<VideoPlayerColumnProps> = ({
  activeSentenceIndex,
  totalSentences,
  isPlaying,
  playedSec,
  durationSec,
  playbackSpeed,
  autoLoop,
  isLoading,
  volume,
  isMuted,
  onTogglePlay,
  onReplay,
  onPrevSentence,
  onNextSentence,
  onChangeSpeed,
  onToggleAutoLoop,
  onChangeVolume,
  onToggleMute,
}) => {
  return (
    <section className="flex flex-col gap-3">
      {/* ── Video Player Shell ── */}
      <div className="overflow-hidden rounded-2xl border border-outline-variant/80 bg-surface-container-lowest shadow-xs">
        {/* Top Header: Segment Time Pill */}
        <div className="flex items-center justify-between border-b border-outline-variant/70 bg-surface-container-low px-4 py-2 text-xs">
          <span className="text-secondary font-medium">Video Segment</span>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/60 bg-surface-container-lowest px-2.5 py-0.5 font-mono text-[11px] font-semibold text-secondary">
            <Clock className="h-3 w-3" />
            <span>
              {formatTime(playedSec)} / {formatTime(durationSec)}
            </span>
          </div>
        </div>

        {/* 16:9 Aspect Video Container */}
        <div className="relative aspect-video w-full bg-slate-950">
          <div id="youtubePlayer" className="h-full w-full" />

          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-black/80 text-white">
              <div className="h-7 w-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <span className="text-xs font-medium text-slate-300">Loading video...</span>
            </div>
          )}
        </div>

        {/* Dual Primary Action Buttons */}
        <div className="flex gap-2 border-t border-outline-variant/70 bg-surface-container-low p-3">
          {/* Main Play / Pause */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="btn-interactive flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-bold text-on-primary shadow-xs hover:bg-primary-hover transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" strokeWidth={2.5} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 ml-0.5" strokeWidth={2.5} />
                <span>Play Segment</span>
              </>
            )}
            <kbd className="rounded-full bg-black/20 px-2 py-0.5 font-mono text-[10px] text-white">
              Tab
            </kbd>
          </button>

          {/* Replay Segment */}
          <button
            type="button"
            onClick={onReplay}
            className="btn-interactive flex-1 flex items-center justify-center gap-2 rounded-xl border border-outline-variant/80 bg-surface-container-lowest px-3.5 py-2.5 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors shadow-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 text-secondary" strokeWidth={2} />
            <span>Replay</span>
            <kbd className="rounded-full bg-surface-container-high px-2 py-0.5 font-mono text-[10px] text-secondary">
              R
            </kbd>
          </button>
        </div>
      </div>

      {/* ── Segment Navigation, Volume & Speed Controls ── */}
      <div className="flex flex-col gap-3.5 rounded-2xl border border-outline-variant/80 bg-surface-container-lowest p-4 shadow-xs">
        {/* Sentence Jumper & Auto Loop */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPrevSentence}
              disabled={activeSentenceIndex === 0}
              aria-label="Previous sentence"
              className="btn-interactive flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/80 bg-surface-container-low text-secondary hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <span className="rounded-full bg-surface-container-low border border-outline-variant/60 px-3 py-1 font-mono text-xs font-bold text-on-surface">
              Sentence {activeSentenceIndex + 1} of {totalSentences}
            </span>
            <button
              type="button"
              onClick={onNextSentence}
              disabled={activeSentenceIndex === totalSentences - 1}
              aria-label="Next sentence"
              className="btn-interactive flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/80 bg-surface-container-low text-secondary hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          {/* Auto Loop Toggle Pill */}
          <button
            type="button"
            onClick={() => onToggleAutoLoop(!autoLoop)}
            className={`btn-interactive inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${
              autoLoop
                ? 'border-primary/40 bg-primary/10 text-primary font-semibold'
                : 'border-outline-variant/70 bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            <Repeat className="h-3 w-3" strokeWidth={2} />
            <span>Loop</span>
          </button>
        </div>

        {/* Volume Controller Slider */}
        <div className="flex items-center justify-between gap-3 border-t border-outline-variant/70 pt-3 text-xs text-secondary">
          <button
            type="button"
            onClick={onToggleMute}
            className="btn-interactive flex items-center gap-1.5 text-secondary hover:text-on-surface font-medium"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-error" strokeWidth={2} />
            ) : volume < 50 ? (
              <Volume1 className="h-4 w-4 text-secondary" strokeWidth={2} />
            ) : (
              <Volume2 className="h-4 w-4 text-secondary" strokeWidth={2} />
            )}
            <span>Volume</span>
          </button>

          <div className="flex flex-1 items-center gap-2 max-w-[170px]">
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => onChangeVolume(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-container-high accent-primary"
            />
            <span className="w-8 text-right font-mono text-[11px] text-secondary">
              {isMuted ? '0%' : `${volume}%`}
            </span>
          </div>
        </div>

        {/* Speed Selector Pill Segmented Bar */}
        <div className="border-t border-outline-variant/70 pt-3">
          <div className="mb-2 flex items-center justify-between text-xs text-secondary font-medium">
            <span>Playback Speed:</span>
            <span className="font-mono text-primary font-bold">{playbackSpeed}x</span>
          </div>
          <div className="flex items-center rounded-full bg-surface-container-low p-1 border border-outline-variant/60">
            {SPEED_OPTIONS.map((spd) => {
              const isActive = playbackSpeed === spd
              return (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onChangeSpeed(spd)}
                  className={`btn-interactive flex-1 rounded-full py-1 font-mono text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs border border-outline-variant/80'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {spd}x
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
