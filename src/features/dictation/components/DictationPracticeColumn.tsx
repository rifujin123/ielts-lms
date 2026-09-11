import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  X as XIcon,
  Volume2,
  Lightbulb,
  ArrowRight,
  Eye,
} from 'lucide-react'
import type { DictationSentence, DictationMode, TokenizedWord } from '../types'
import { STOP_WORDS } from '../constants/dictionaryData'

interface DictationPracticeColumnProps {
  sentence: DictationSentence
  mode: DictationMode
  onChangeMode: (mode: DictationMode) => void
  isMediaHidden: boolean
  isPlaying: boolean
  onTogglePlay: () => void
  onReplay: () => void
  activeSentenceIndex: number
  totalSentences: number
  isAnswered: boolean
  isCorrect: boolean | null
  onCheckAnswer: (isCorrect: boolean) => void
  onNextSentence: () => void
  onWordClick: (word: string) => void
}

export const DictationPracticeColumn: React.FC<DictationPracticeColumnProps> = ({
  sentence,
  mode,
  onChangeMode,
  isMediaHidden,
  isPlaying,
  onTogglePlay,
  onReplay,
  activeSentenceIndex,
  totalSentences,
  isAnswered,
  isCorrect,
  onCheckAnswer,
  onNextSentence,
  onWordClick,
}) => {
  const [hardInput, setHardInput] = useState<string>('')
  const [blankValues, setBlankValues] = useState<Record<number, string>>({})
  const [revealedBlanks, setRevealedBlanks] = useState<Record<number, boolean>>({})
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  const isCompleted = Boolean(isAnswered && isCorrect)

  // Global Enter shortcut: if sentence is completed, pressing Enter jumps to next sentence
  useEffect(() => {
    const handleGlobalEnter = (e: KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        isCompleted &&
        !e.shiftKey &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault()
        onNextSentence()
      }
    }
    window.addEventListener('keydown', handleGlobalEnter)
    return () => window.removeEventListener('keydown', handleGlobalEnter)
  }, [isCompleted, onNextSentence])

  // Tokenize the current sentence into words
  const tokens = useMemo<TokenizedWord[]>(() => {
    const words = sentence.text.split(/\s+/)
    return words.map((raw, idx) => {
      const clean = raw.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'!]/g, '')
      const punctuation = raw.slice(clean.length)
      const lower = clean.toLowerCase()

      let isHidden: boolean
      if (mode === 'easy') {
        isHidden = clean.length > 2 && !STOP_WORDS.has(lower)
      } else if (mode === 'normal') {
        isHidden = idx % 2 === 0 || clean.length > 3
      } else {
        isHidden = true
      }

      return {
        raw,
        clean,
        lower,
        punctuation,
        isHidden,
        index: idx,
      }
    })
  }, [sentence.text, mode])

  // Reset local state when sentence or mode changes
  useEffect(() => {
    setBlankValues({})
    setRevealedBlanks({})
    setHardInput('')

    // Auto-focus first blank
    setTimeout(() => {
      const firstInput = Object.values(inputRefs.current)[0]
      if (firstInput) firstInput.focus()
    }, 150)
  }, [sentence.id, mode])

  // Focus next blank automatically when a word is answered correctly
  const focusNextBlank = (currentIndex: number) => {
    const hiddenIndices = tokens.filter((t) => t.isHidden).map((t) => t.index)
    const nextIdx = hiddenIndices.find((idx) => idx > currentIndex)
    if (nextIdx !== undefined && inputRefs.current[nextIdx]) {
      inputRefs.current[nextIdx]?.focus()
    }
  }

  // Focus previous blank on backspace
  const focusPrevBlank = (currentIndex: number) => {
    const hiddenIndices = tokens.filter((t) => t.isHidden).map((t) => t.index)
    const prevIndices = hiddenIndices.filter((idx) => idx < currentIndex)
    if (prevIndices.length > 0) {
      const prevIdx = prevIndices[prevIndices.length - 1]
      inputRefs.current[prevIdx]?.focus()
    }
  }

  // Handle word input change
  const handleBlankChange = (index: number, val: string, expectedLower: string) => {
    setBlankValues((prev) => ({ ...prev, [index]: val }))
    if (val.trim().toLowerCase() === expectedLower) {
      focusNextBlank(index)
    }
  }

  // Handle single word hint
  const handleHintWord = () => {
    const unrevealed = tokens.find(
      (t) =>
        t.isHidden && !revealedBlanks[t.index] && blankValues[t.index]?.toLowerCase() !== t.lower,
    )
    if (unrevealed) {
      setBlankValues((prev) => ({ ...prev, [unrevealed.index]: unrevealed.clean }))
      setRevealedBlanks((prev) => ({ ...prev, [unrevealed.index]: true }))
      focusNextBlank(unrevealed.index)
    }
  }

  // Reveal all words
  const handleRevealAll = () => {
    const newValues: Record<number, string> = {}
    const newRevealed: Record<number, boolean> = {}
    tokens.forEach((t) => {
      if (t.isHidden) {
        newValues[t.index] = t.clean
        newRevealed[t.index] = true
      }
    })
    setBlankValues(newValues)
    setRevealedBlanks(newRevealed)
    if (mode === 'hard') {
      setHardInput(sentence.text)
    }
  }

  // Submit and check answers
  const handleGrade = () => {
    if (mode === 'hard') {
      const cleanUser = hardInput
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'!]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      const cleanTarget = sentence.text
        .toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'!]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      onCheckAnswer(cleanUser === cleanTarget)
    } else {
      let allCorrect = true
      tokens.forEach((t) => {
        if (t.isHidden) {
          const userVal = (blankValues[t.index] || '').trim().toLowerCase()
          if (userVal !== t.lower && !revealedBlanks[t.index]) {
            allCorrect = false
          }
        }
      })
      onCheckAnswer(allCorrect)
    }
  }

  // Play audio TTS for the whole sentence
  const speakSentence = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(sentence.text)
      utter.lang = 'en-US'
      utter.rate = 0.9
      window.speechSynthesis.speak(utter)
    }
  }

  return (
    <main className="flex flex-1 flex-col rounded-2xl border border-outline-variant/80 bg-surface-container-lowest p-4 sm:p-5 shadow-xs">
      {/* ── Top Bar: Sentence info & Difficulty Pill Segmented Control ── */}
      <div className="flex flex-col gap-3.5 border-b border-outline-variant/70 pb-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Playback (if media hidden) & Sentence Counter Pill */}
          <div className="flex items-center gap-2">
            {isMediaHidden && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={onTogglePlay}
                  className="btn-interactive flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary shadow-xs hover:bg-primary-hover"
                  title="Play segment (Tab)"
                >
                  {isPlaying ? (
                    <Pause className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <Play className="h-3.5 w-3.5 ml-0.5" strokeWidth={2.5} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onReplay}
                  className="btn-interactive flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant/80 bg-surface-container-low text-secondary hover:text-on-surface"
                  title="Replay (R)"
                >
                  <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            )}
            <span className="rounded-full bg-surface-container-low border border-outline-variant/60 px-3 py-1 font-mono text-xs font-bold text-on-surface">
              Sentence {activeSentenceIndex + 1} of {totalSentences}
            </span>
          </div>

          {/* Center: Difficulty Segmented Control Pill */}
          <div className="inline-flex items-center rounded-full bg-surface-container-low p-1 border border-outline-variant/60">
            <button
              type="button"
              onClick={() => onChangeMode('easy')}
              className={`btn-interactive rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                mode === 'easy'
                  ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs border border-outline-variant/80'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Easy
            </button>
            <button
              type="button"
              onClick={() => onChangeMode('normal')}
              className={`btn-interactive rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                mode === 'normal'
                  ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs border border-outline-variant/80'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Normal
            </button>
            <button
              type="button"
              onClick={() => onChangeMode('hard')}
              className={`btn-interactive rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                mode === 'hard'
                  ? 'bg-surface-container-lowest text-on-surface font-bold shadow-xs border border-outline-variant/80'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Hard
            </button>
          </div>

          {/* Right: Hint & Reveal actions */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleHintWord}
              className="btn-interactive inline-flex items-center gap-1 rounded-full border border-outline-variant/80 bg-surface-container-low px-2.5 py-1 font-medium text-secondary hover:text-primary hover:border-primary/40 transition-colors"
              title="Hint the next missing word"
            >
              <Lightbulb className="h-3.5 w-3.5 text-primary" strokeWidth={2} />
              <span>Hint</span>
            </button>
            <button
              type="button"
              onClick={handleRevealAll}
              className="btn-interactive inline-flex items-center gap-1 rounded-full border border-outline-variant/80 bg-surface-container-low px-2.5 py-1 font-medium text-secondary hover:text-on-surface transition-colors"
              title="Reveal full sentence"
            >
              <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>Reveal</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Interactive Dictation Canvas ── */}
      <div className="mt-4 min-h-[160px] rounded-xl border border-outline-variant/80 bg-surface-container-low/30 p-4 sm:p-5 transition-all focus-within:border-primary/50 focus-within:bg-surface-container-lowest focus-within:shadow-xs flex flex-col justify-center">
        {mode === 'hard' ? (
          /* Hard Mode: Freeform Textarea */
          <div className="flex flex-col gap-2">
            <textarea
              rows={3}
              value={hardInput}
              onChange={(e) => setHardInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleGrade()
                }
              }}
              placeholder="Type the English sentence you hear here..."
              className="w-full bg-transparent border-0 text-body-lg font-medium text-on-surface resize-none focus:outline-none placeholder:text-secondary/40"
            />
            <div className="flex justify-end border-t border-outline-variant/60 pt-2 text-xs text-secondary/70">
              <span className="font-mono">{hardInput.length} characters</span>
            </div>

            {/* In Hard Mode, when revealed or answered, display the sentence words as clean clickable text */}
            {(Object.keys(revealedBlanks).length > 0 || isAnswered) && (
              <div className="mt-3 pt-3 border-t border-outline-variant/60 flex flex-col gap-1.5 animate-fade-in-up">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-primary" />
                  <span>Sentence Words (Click to look up & save to notebook):</span>
                </span>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  {tokens.map((token) => (
                    <span
                      key={token.index}
                      onClick={() => onWordClick(token.clean)}
                      className="cursor-pointer text-body-lg font-extrabold text-tertiary hover:text-tertiary/80 hover:underline underline-offset-4 transition-colors select-none"
                      title="Click to look up dictionary & save to notebook"
                    >
                      {token.raw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Easy & Normal Mode: Tokenized Fill-in-the-blanks */
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3 leading-relaxed">
            {tokens.map((token) => {
              if (!token.clean) return null

              const isCompleted = isAnswered && isCorrect
              const isRevealed = Boolean(revealedBlanks[token.index])
              const userVal = blankValues[token.index] || ''
              const isTypedCorrect = userVal.trim().toLowerCase() === token.lower
              const isBlankCorrect = isTypedCorrect || isRevealed

              // A word renders as clean clickable text if:
              // 1. It was never hidden (!token.isHidden)
              // 2. The whole sentence was completed (isCompleted)
              // 3. It was revealed via Hint or Reveal All (isRevealed)
              // 4. It was answered and verified as correct (isAnswered && isBlankCorrect)
              const showAsClickable =
                !token.isHidden || isCompleted || isRevealed || (isAnswered && isBlankCorrect)

              return (
                <div key={token.index} className="inline-flex items-center">
                  {showAsClickable ? (
                    // Clickable word without pill wrapping - green for revealed/hidden words, normal for default words
                    <span
                      onClick={() => onWordClick(token.clean)}
                      className={`cursor-pointer text-body-lg transition-colors select-none hover:underline underline-offset-4 ${
                        token.isHidden
                          ? 'font-extrabold text-tertiary hover:text-tertiary/80'
                          : 'font-bold text-on-surface hover:text-primary'
                      }`}
                      title="Click to look up dictionary & save to notebook"
                    >
                      {token.clean}
                    </span>
                  ) : (
                    // Blank Input Field
                    <input
                      ref={(el) => {
                        inputRefs.current[token.index] = el
                      }}
                      type="text"
                      value={userVal}
                      placeholder={Array.from({ length: Math.min(token.clean.length, 5) })
                        .map(() => '·')
                        .join('')}
                      style={{ width: `${Math.max(3.5, token.clean.length + 1)}ch` }}
                      onChange={(e) => handleBlankChange(token.index, e.target.value, token.lower)}
                      onDoubleClick={() => onWordClick(token.clean)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && userVal === '') {
                          focusPrevBlank(token.index)
                        } else if (e.key === 'Enter') {
                          handleGrade()
                        }
                      }}
                      title="Type the missing word (double-click to look up dictionary)"
                      className={`blank-input bg-transparent text-center text-body-lg font-bold border-b-2 py-0.5 px-1 focus:outline-none transition-all placeholder:text-secondary/30 ${
                        isBlankCorrect
                          ? 'border-tertiary text-tertiary font-extrabold'
                          : isAnswered && !isCorrect
                            ? 'border-error text-error animate-shake'
                            : 'border-outline text-on-surface focus:border-primary'
                      }`}
                    />
                  )}

                  {/* Punctuation */}
                  {token.punctuation && (
                    <span className="font-bold text-secondary text-body-lg ml-0.5">
                      {token.punctuation}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Feedback Alert ── */}
      {isAnswered && (
        <div
          className={`animate-pop-in mt-3.5 flex items-center justify-between rounded-xl border p-3.5 transition-all ${
            isCorrect
              ? 'border-tertiary/30 bg-tertiary-container/30 text-on-tertiary-container'
              : 'border-error/30 bg-error-container/30 text-on-error-container animate-shake'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-white shrink-0 ${
                isCorrect ? 'bg-tertiary' : 'bg-error'
              }`}
            >
              {isCorrect ? (
                <Check className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <XIcon className="h-4 w-4" strokeWidth={2.5} />
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider">
                {isCorrect ? 'Correct' : 'Incorrect'}
              </h3>
              <p className="text-body-sm opacity-90">
                {isCorrect
                  ? 'Great job! You have accurately transcribed this segment.'
                  : 'Listen closely and try filling in the missing words again.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={speakSentence}
            className="btn-interactive flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest text-on-surface shadow-xs transition-colors shrink-0"
            title="Listen to pronunciation"
          >
            <Volume2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      )}

      {/* ── Bilingual Translation Card ── */}
      {isAnswered && isCorrect && sentence.vi && (
        <div className="animate-fade-in-up mt-3 rounded-xl border border-outline-variant/80 bg-surface-container-low/50 p-3.5 space-y-1">
          <span className="text-[11px] font-semibold text-secondary">Translation</span>
          <p className="text-body-sm font-medium text-on-surface italic">
            &ldquo;{sentence.vi}&rdquo;
          </p>
        </div>
      )}

      <div className="flex-1" />

      {/* ── Bottom Action Buttons: Dynamic Contextual Flow ── */}
      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 border-t border-outline-variant/70 pt-3.5">
        {!isCompleted ? (
          <>
            {/* Check Answer Button (Primary Action during practice) */}
            <button
              type="button"
              onClick={handleGrade}
              className="btn-interactive flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 px-5 text-xs font-bold shadow-xs transition-all active:scale-[0.99]"
            >
              <Check className="h-4 w-4" strokeWidth={2.5} />
              <span>Check Answer</span>
              <kbd className="inline-flex items-center rounded-md bg-white/20 dark:bg-slate-900/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-white dark:text-slate-900">
                ↵ Enter
              </kbd>
            </button>

            {/* Skip / Next Sentence Button (Subtle Secondary Action) */}
            <button
              type="button"
              onClick={onNextSentence}
              className="btn-interactive h-11 flex items-center justify-center gap-1.5 rounded-xl border border-outline-variant/80 bg-surface-container-low/60 hover:bg-surface-container-low text-secondary hover:text-on-surface px-4 text-xs font-semibold shadow-2xs transition-all"
            >
              <span>Skip</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </>
        ) : (
          <>
            {/* Completed Badge (Replaces Check Answer with an elegant status) */}
            <div className="h-11 flex items-center justify-center gap-2 rounded-xl border border-tertiary/30 bg-tertiary-container/30 text-on-tertiary-container px-4 text-xs font-bold select-none">
              <Check className="h-4 w-4 text-tertiary" strokeWidth={2.5} />
              <span>Completed</span>
            </div>

            {/* Next Sentence Button (Primary CTA Glowing with Enter) */}
            <button
              type="button"
              onClick={onNextSentence}
              className="btn-interactive flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-on-primary px-5 text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.99] animate-pop-in"
            >
              <span>Next Sentence</span>
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              <kbd className="inline-flex items-center rounded-md bg-white/25 px-2 py-0.5 font-mono text-[10px] font-semibold text-white">
                ↵ Enter
              </kbd>
            </button>
          </>
        )}
      </div>
    </main>
  )
}
