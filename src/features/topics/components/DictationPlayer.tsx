import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Keyboard,
  Sparkles,
} from 'lucide-react'
import type { DictationLesson } from '@/features/dictation/types'
import { useDictationHotkeys } from '../hooks/useDictationHotkeys'
import { DictationDiffView } from './DictationDiffView'
import { DictationHotkeyBar } from './DictationHotkeyBar'

export interface DictationPlayerProps {
  lesson: DictationLesson
  isOpen: boolean
  onClose: () => void
  initialSentenceIndex?: number
}

export const DictationPlayer: React.FC<DictationPlayerProps> = ({
  lesson,
  isOpen,
  onClose,
  initialSentenceIndex = 0,
}) => {
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(initialSentenceIndex)
  const [studentInput, setStudentInput] = useState<string>('')
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0)
  const [isTypingFast, setIsTypingFast] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(100)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const loopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sentences = lesson.sentences || []
  const currentSentence = sentences[activeSentenceIndex] || sentences[0]

  // Reset input and state when changing sentences or lessons
  useEffect(() => {
    setActiveSentenceIndex(initialSentenceIndex)
    setStudentInput('')
    setIsChecked(false)
    setIsPlaying(false)
  }, [lesson.id, initialSentenceIndex])

  // Focus textarea when modal opens or sentence changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 100)
    }
  }, [isOpen, activeSentenceIndex])

  // Clean up any speech synthesis when unmounting or changing sentence
  const stopAudio = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    if (loopTimerRef.current) {
      clearTimeout(loopTimerRef.current)
      loopTimerRef.current = null
    }
    setIsPlaying(false)
  }, [])

  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [stopAudio])

  // Audio Playback Handler: uses SpeechSynthesis with speed & ducking support as a universal reliable engine
  const playSentenceAudio = useCallback(
    (rate = playbackSpeed, duck = false) => {
      if (!currentSentence?.text || !('speechSynthesis' in window)) return

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(currentSentence.text)
      utterance.rate = rate
      utterance.lang = 'en-US'
      utterance.volume = isMuted ? 0 : duck ? (volume * 0.3) / 100 : volume / 100

      utterance.onend = () => {
        setIsPlaying(false)
      }
      utterance.onerror = () => {
        setIsPlaying(false)
      }

      synthUtteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)
    },
    [currentSentence?.text, playbackSpeed, isMuted, volume],
  )

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      stopAudio()
    } else {
      playSentenceAudio(playbackSpeed, isTypingFast)
    }
  }, [isPlaying, stopAudio, playSentenceAudio, playbackSpeed, isTypingFast])

  const handleSeekBackward = useCallback(
    (_seconds = 3) => {
      // Re-trigger audio playback from the start of the current sentence
      stopAudio()
      playSentenceAudio(playbackSpeed, isTypingFast)
    },
    [stopAudio, playSentenceAudio, playbackSpeed, isTypingFast],
  )

  const handleSeekForward = useCallback(
    (_seconds = 3) => {
      // For sentence drill, restarting or advancing plays audio
      stopAudio()
      playSentenceAudio(playbackSpeed, isTypingFast)
    },
    [stopAudio, playSentenceAudio, playbackSpeed, isTypingFast],
  )

  const handleSetSpeed = useCallback(
    (speed: number) => {
      setPlaybackSpeed(speed)
      if (isPlaying) {
        stopAudio()
        playSentenceAudio(speed, isTypingFast)
      }
    },
    [isPlaying, stopAudio, playSentenceAudio, isTypingFast],
  )

  const handleCheckAnswer = useCallback(() => {
    if (!studentInput.trim()) return
    setIsChecked(true)
    stopAudio()
  }, [studentInput, stopAudio])

  const handleNextSentence = useCallback(() => {
    if (activeSentenceIndex < sentences.length - 1) {
      stopAudio()
      setActiveSentenceIndex((prev) => prev + 1)
      setStudentInput('')
      setIsChecked(false)
    }
  }, [activeSentenceIndex, sentences.length, stopAudio])

  const handlePrevSentence = useCallback(() => {
    if (activeSentenceIndex > 0) {
      stopAudio()
      setActiveSentenceIndex((prev) => prev - 1)
      setStudentInput('')
      setIsChecked(false)
    }
  }, [activeSentenceIndex, stopAudio])

  const handleRetry = useCallback(() => {
    setIsChecked(false)
    setStudentInput('')
    setTimeout(() => {
      textareaRef.current?.focus()
      playSentenceAudio(playbackSpeed, false)
    }, 50)
  }, [playSentenceAudio, playbackSpeed])

  // Auto-ducking reaction: when student types continuously, adjust speech volume dynamically
  const handleTypingCadence = useCallback(
    (isFast: boolean) => {
      setIsTypingFast(isFast)
      if (isPlaying) {
        // Re-apply speech with ducked volume
        playSentenceAudio(playbackSpeed, isFast)
      }
    },
    [isPlaying, playSentenceAudio, playbackSpeed],
  )

  // Attach ergonomic hotkeys listener
  useDictationHotkeys({
    onTogglePlay: handleTogglePlay,
    onSeekBackward: handleSeekBackward,
    onSeekForward: handleSeekForward,
    onSetSpeed: handleSetSpeed,
    onCheckAnswer: isChecked ? handleNextSentence : handleCheckAnswer,
    onTypingCadence: handleTypingCadence,
    disabled: !isOpen,
    inputRef: textareaRef,
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-6 backdrop-blur-xs animate-fade-in-up">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-lowest shadow-2xl">
        {/* ── Modal Header ── */}
        <div className="flex items-center justify-between border-b border-outline-variant px-5 py-4 bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-on-primary shadow-xs">
              <Keyboard className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-label-lg font-extrabold text-on-surface line-clamp-1">
                  {lesson.title}
                </h3>
                <span className="rounded-md bg-primary-container px-2 py-0.5 text-[10px] font-bold text-on-primary-container uppercase">
                  Keyboard Engine
                </span>
              </div>
              <p className="text-body-xs text-secondary">
                Sentence {activeSentenceIndex + 1} of {sentences.length} • Flow-State Dictation
                Drill
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopAudio()
              onClose()
            }}
            className="btn-interactive rounded-full p-1.5 text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
            title="Close (Esc)"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* ── Modal Body (Scrollable) ── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* Sentence Progress Bar */}
          <div className="flex items-center justify-between gap-3 text-xs text-secondary">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevSentence}
                disabled={activeSentenceIndex === 0}
                className="btn-interactive flex h-7 w-7 items-center justify-center rounded-lg border border-outline-variant disabled:opacity-30 hover:bg-surface-container transition-all"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
              </button>
              <span className="font-mono font-semibold text-on-surface">
                {activeSentenceIndex + 1} / {sentences.length}
              </span>
              <button
                type="button"
                onClick={handleNextSentence}
                disabled={activeSentenceIndex === sentences.length - 1}
                className="btn-interactive flex h-7 w-7 items-center justify-center rounded-lg border border-outline-variant disabled:opacity-30 hover:bg-surface-container transition-all"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>

            {/* Speed Pills */}
            <div className="flex items-center gap-1">
              {[0.75, 1.0, 1.25].map((s) => {
                const isActive = playbackSpeed === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSetSpeed(s)}
                    className={`btn-interactive rounded-md px-2 py-1 font-mono text-[11px] font-bold transition-all ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-2xs'
                        : 'border border-outline-variant bg-surface-container-lowest text-secondary hover:bg-surface-container-low'
                    }`}
                  >
                    {s}x
                  </button>
                )
              })}
            </div>
          </div>

          {/* Audio Playback Controller Card */}
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="btn-interactive flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm hover:bg-primary-hover transition-transform active:scale-95"
                  title="Play / Pause (Tab)"
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" strokeWidth={2.2} />
                  ) : (
                    <Play className="h-6 w-6 ml-0.5" strokeWidth={2.2} />
                  )}
                </button>

                <div>
                  <div className="text-label-sm font-bold text-on-surface flex items-center gap-1.5">
                    <span>{isPlaying ? 'Playing audio segment...' : 'Ready to listen'}</span>
                    {isTypingFast && isPlaying && (
                      <span className="text-[10px] text-amber-600 font-semibold animate-pulse">
                        (Ducked)
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-secondary">
                    Timestamp: {currentSentence.start?.toFixed(1)}s -{' '}
                    {currentSentence.end?.toFixed(1)}s
                  </div>
                </div>
              </div>

              {/* Volume & Repeat Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="btn-interactive rounded-lg p-2 text-secondary hover:bg-surface-container-high transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-rose-500" strokeWidth={1.75} />
                  ) : (
                    <Volume2 className="h-4 w-4" strokeWidth={1.75} />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value))
                    if (isMuted) setIsMuted(false)
                  }}
                  className="h-1.5 w-16 accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* ── Student Input Area ── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="dictation-input"
                className="text-label-sm font-bold text-on-surface flex items-center gap-1.5"
              >
                <span>Type what you hear</span>
                <span className="text-secondary font-normal text-xs">
                  (Press Tab to pause/play)
                </span>
              </label>
              <span className="text-xs text-secondary font-mono">
                {studentInput.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <textarea
              id="dictation-input"
              ref={textareaRef}
              rows={3}
              value={studentInput}
              onChange={(e) => {
                setStudentInput(e.target.value)
                if (isChecked) setIsChecked(false)
              }}
              placeholder="Listen to the audio segment and type every word you hear here..."
              className="w-full rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 text-body-md text-on-surface placeholder:text-secondary/50 focus:border-primary focus:outline-none transition-colors duration-200 resize-none shadow-xs"
            />

            {/* Visual Hotkey Cheatsheet Bar */}
            <DictationHotkeyBar
              isPlaying={isPlaying}
              currentSpeed={playbackSpeed}
              isTypingFast={isTypingFast}
            />
          </div>

          {/* ── Check Answer or Next Action ── */}
          {!isChecked ? (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleSeekBackward(3)}
                className="btn-interactive inline-flex items-center gap-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-label-sm font-semibold text-secondary hover:bg-surface-container-low transition-colors"
              >
                <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                <span>Replay Segment</span>
              </button>

              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={!studentInput.trim()}
                className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-label-sm font-bold text-on-primary shadow-xs hover:bg-primary-hover disabled:opacity-40 transition-colors"
              >
                <Check className="h-4 w-4" strokeWidth={2.2} />
                <span>Check Answer [Enter]</span>
              </button>
            </div>
          ) : (
            /* ── Instant Diff Checking View ── */
            <div className="animate-fade-in-up">
              <DictationDiffView
                userInput={studentInput}
                targetTranscript={currentSentence.text}
                ipa={currentSentence.ipa}
                translation={currentSentence.vi}
                onRetry={handleRetry}
                onNext={activeSentenceIndex < sentences.length - 1 ? handleNextSentence : undefined}
              />
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div className="flex items-center justify-between border-t border-outline-variant px-5 py-3 bg-surface-container-low text-xs text-secondary">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" strokeWidth={1.75} />
            <span>Ergonomic Keyboard Engine • 100% mouse-free flow state</span>
          </div>
          <button
            type="button"
            onClick={() => {
              stopAudio()
              onClose()
            }}
            className="text-label-xs font-semibold text-secondary hover:text-on-surface transition-colors"
          >
            Done Practicing
          </button>
        </div>
      </div>
    </div>
  )
}

export default DictationPlayer
