import { useEffect, useRef, useCallback } from 'react'

export interface HotkeyItem {
  key: string
  label: string
  description: string
}

export const DICTATION_SHORTCUTS: HotkeyItem[] = [
  {
    key: 'Tab / Esc',
    label: 'Play / Pause',
    description: 'Toggle audio playback without losing cursor focus',
  },
  { key: 'Ctrl + ← / Shift + Tab', label: '-3s Rewind', description: 'Seek backward 3 seconds' },
  { key: 'Ctrl + →', label: '+3s Forward', description: 'Seek forward 3 seconds' },
  { key: 'Alt + 1/2/3', label: '0.75x / 1.0x / 1.25x', description: 'Switch playback speed' },
  { key: 'Enter', label: 'Check Answer', description: 'Verify student transcript against target' },
]

export interface UseDictationHotkeysOptions {
  onTogglePlay?: () => void
  onSeekBackward?: (seconds?: number) => void
  onSeekForward?: (seconds?: number) => void
  onSetSpeed?: (speed: number) => void
  onCheckAnswer?: () => void
  onReplay?: () => void
  onTypingCadence?: (isTypingFast: boolean) => void
  disabled?: boolean
  inputRef?: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
}

/**
 * useDictationHotkeys — Ergonomic keyboard-centric dictation hotkeys.
 *
 * Implements:
 * - Tab or Escape: Toggle Play/Pause without losing focus in textarea/input.
 * - Ctrl + ArrowLeft or Shift + Tab: Seek backward 3 seconds.
 * - Ctrl + ArrowRight: Seek forward 3 seconds.
 * - Alt + 1: Speed 0.75x
 * - Alt + 2: Speed 1.0x
 * - Alt + 3: Speed 1.25x
 * - Enter: Submit / Check answer (when not holding Shift)
 * - Typing cadence tracking (auto-ducking indicator when CPM > 120)
 */
export function useDictationHotkeys({
  onTogglePlay,
  onSeekBackward,
  onSeekForward,
  onSetSpeed,
  onCheckAnswer,
  onReplay,
  onTypingCadence,
  disabled = false,
  inputRef,
}: UseDictationHotkeysOptions) {
  // Store latest callbacks in refs to avoid recreating the keydown listener on every render
  const callbacksRef = useRef({
    onTogglePlay,
    onSeekBackward,
    onSeekForward,
    onSetSpeed,
    onCheckAnswer,
    onReplay,
    onTypingCadence,
    disabled,
  })

  useEffect(() => {
    callbacksRef.current = {
      onTogglePlay,
      onSeekBackward,
      onSeekForward,
      onSetSpeed,
      onCheckAnswer,
      onReplay,
      onTypingCadence,
      disabled,
    }
  })

  // Typing cadence tracker (characters per minute)
  const keyTimestampsRef = useRef<number[]>([])
  const cadenceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const {
        disabled: isDisabled,
        onTogglePlay: togglePlay,
        onSeekBackward: seekBackward,
        onSeekForward: seekForward,
        onSetSpeed: setSpeed,
        onCheckAnswer: checkAnswer,
        onTypingCadence: notifyCadence,
      } = callbacksRef.current

      if (isDisabled) return

      const activeEl = document.activeElement
      const isInputFocused = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA'

      // Typing Cadence Tracker: record alphanumeric typing rate
      if (isInputFocused && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        const now = Date.now()
        keyTimestampsRef.current.push(now)
        // Keep timestamps from the last 3 seconds
        keyTimestampsRef.current = keyTimestampsRef.current.filter((t) => now - t <= 3000)

        if (keyTimestampsRef.current.length >= 6) {
          // 6 keystrokes in <= 3s is approx >= 120 CPM
          notifyCadence?.(true)
          if (cadenceTimeoutRef.current) clearTimeout(cadenceTimeoutRef.current)
          cadenceTimeoutRef.current = setTimeout(() => {
            notifyCadence?.(false)
          }, 1500)
        }
      }

      // ── 1. Shift + Tab: Seek backward 3 seconds ─────────────────────────
      if (e.shiftKey && e.key === 'Tab') {
        e.preventDefault()
        seekBackward?.(3)
        if (inputRef?.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus()
        }
        return
      }

      // ── 2. Tab or Escape: Toggle Play/Pause without losing focus ────────
      if (!e.shiftKey && (e.key === 'Tab' || e.key === 'Escape')) {
        e.preventDefault()
        togglePlay?.()
        if (inputRef?.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus()
        }
        return
      }

      // ── 3. Ctrl + ArrowLeft: Seek backward 3 seconds ───────────────────
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowLeft') {
        e.preventDefault()
        seekBackward?.(3)
        return
      }

      // ── 4. Ctrl + ArrowRight: Seek forward 3 seconds ────────────────────
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowRight') {
        e.preventDefault()
        seekForward?.(3)
        return
      }

      // ── 5. Alt + 1: Speed 0.75x ─────────────────────────────────────────
      if (e.altKey && (e.key === '1' || e.code === 'Digit1')) {
        e.preventDefault()
        setSpeed?.(0.75)
        return
      }

      // ── 6. Alt + 2: Speed 1.0x ──────────────────────────────────────────
      if (e.altKey && (e.key === '2' || e.code === 'Digit2')) {
        e.preventDefault()
        setSpeed?.(1.0)
        return
      }

      // ── 7. Alt + 3: Speed 1.25x ─────────────────────────────────────────
      if (e.altKey && (e.key === '3' || e.code === 'Digit3')) {
        e.preventDefault()
        setSpeed?.(1.25)
        return
      }

      // ── 8. Enter: Check answer (when not Shift+Enter in textarea) ────────
      if (e.key === 'Enter' && !e.shiftKey && isInputFocused) {
        e.preventDefault()
        checkAnswer?.()
      }
    },
    [inputRef],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (cadenceTimeoutRef.current) clearTimeout(cadenceTimeoutRef.current)
    }
  }, [handleKeyDown])

  return {
    shortcuts: DICTATION_SHORTCUTS,
  }
}
