/**
 * Web Audio API Sound Synthesizer (0KB external assets).
 * Creates playful, high-fidelity micro-interaction sound effects directly
 * in the user's browser without requiring audio file downloads.
 */

class SoundSynthesizer {
  private audioCtx: AudioContext | null = null
  private isMuted: boolean = false

  private getContext(): AudioContext | null {
    if (this.isMuted) return null
    try {
      if (!this.audioCtx) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass()
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume()
      }
      return this.audioCtx
    } catch {
      return null
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted
  }

  public getMuted(): boolean {
    return this.isMuted
  }

  /**
   * Playful Ding Chime (Duolingo-style positive feedback)
   * Dual-tone chord: D5 (587.33 Hz) followed by A5 (880 Hz)
   */
  public playCorrect() {
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'sine'

      // First note
      osc1.frequency.setValueAtTime(587.33, now) // D5
      // Second note slightly delayed
      osc2.frequency.setValueAtTime(880.0, now + 0.08) // A5

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now + 0.08)
      osc1.stop(now + 0.4)
      osc2.stop(now + 0.4)
    } catch (e) {
      console.warn('Audio playCorrect error:', e)
    }
  }

  /**
   * Soft Buzz Tone (Duolingo-style gentle error notification)
   * Triangle wave falling from 220 Hz to 164.81 Hz
   */
  public playIncorrect() {
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(220, now) // A3
      osc.frequency.exponentialRampToValueAtTime(164.81, now + 0.3) // E3

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.35)
    } catch (e) {
      console.warn('Audio playIncorrect error:', e)
    }
  }

  /**
   * Tactile Click Sound (for button press / word placement)
   */
  public playTap() {
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.04)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.04)
    } catch {
      // Ignore tap errors
    }
  }

  /**
   * Lesson Complete Victory Fanfare
   */
  public playVictory() {
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      const now = ctx.currentTime

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + idx * 0.1)

        gain.gain.setValueAtTime(0.15, now + idx * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + idx * 0.1)
        osc.stop(now + idx * 0.1 + 0.35)
      })
    } catch (e) {
      console.warn('Audio playVictory error:', e)
    }
  }
}

export const soundEffects = new SoundSynthesizer()
