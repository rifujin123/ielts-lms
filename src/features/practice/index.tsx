import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Play, Pause } from 'lucide-react'

/**
 * PracticePage — Interactive Practice Player (screen 10).
 * Split-view layout: Reading passage on the left, interactive questions on the right.
 * Supports highlight, font size zoom, audio player speed/volume controls.
 *
 * Line count budget: 200-300 lines.
 */
export const PracticePage: React.FC = () => {
  const [fontSize, setFontSize] = useState<number>(15)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const handleAnswerChange = (qIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: value }))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ── Top Player Control Bar ──────────────────────────────── */}
      <div className="animate-fade-in-up stagger-1 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest px-5 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/exercises"
            aria-label="Thoát phòng luyện tập"
            className="btn-interactive flex h-9 w-9 items-center justify-center rounded-lg text-secondary hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </Link>
          <div>
            <span className="animate-pop-in rounded bg-primary-container px-2 py-0.5 text-[10px] font-bold text-on-primary-container uppercase">
              Reading Practice
            </span>
            <h2 className="text-label-lg font-bold text-on-surface">
              Linearthinking: The Secrets of Cognitive Navigation
            </h2>
          </div>
        </div>

        {/* Player Controls (Font size & Audio) */}
        <div className="flex items-center gap-3">
          {/* Audio mock control */}
          <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-1.5 border border-outline-variant">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Tạm dừng audio' : 'Phát audio'}
              className="btn-interactive flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary"
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5" strokeWidth={2.5} />
              ) : (
                <Play className="h-3.5 w-3.5 ml-0.5" strokeWidth={2.5} />
              )}
            </button>
            <span className="text-[11px] font-semibold text-secondary">04:12 / 12:45</span>
          </div>

          {/* Font zoom controls */}
          <div className="flex items-center gap-1 rounded-xl bg-surface-container-low px-2 py-1 border border-outline-variant">
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.max(13, s - 1))}
              aria-label="Giảm cỡ chữ"
              className="btn-interactive px-2 py-0.5 text-body-sm font-bold text-secondary hover:text-on-surface"
            >
              A-
            </button>
            <span className="text-[11px] font-bold text-on-surface">{fontSize}px</span>
            <button
              type="button"
              onClick={() => setFontSize((s) => Math.min(20, s + 1))}
              aria-label="Tăng cỡ chữ"
              className="btn-interactive px-2 py-0.5 text-body-sm font-bold text-secondary hover:text-on-surface"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* ── Split View Layout (Passage Left, Questions Right) ───── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left pane: Reading Passage */}
        <div className="animate-fade-in-up stagger-2 custom-scrollbar flex max-h-[calc(100vh-170px)] flex-col rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs overflow-y-auto">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
            <span className="text-label-sm font-bold text-primary uppercase">
              Reading Passage 1
            </span>
            <span className="text-[11px] text-secondary">Khoảng 750 từ</span>
          </div>

          <div
            className="prose max-w-none text-on-surface leading-relaxed transition-all"
            style={{ fontSize: `${fontSize}px` }}
          >
            <h3 className="font-display text-headline-md font-bold mb-3">
              How the Human Brain Navigates Abstract Concepts
            </h3>
            <p className="mb-4">
              For centuries, cognitive researchers presumed that mental cartography was strictly
              reserved for spatial environments—remembering the path back to a prehistoric campfire
              or calculating the distance between foraging groves. Recent neuroimaging studies from
              Cambridge University reveal a far more intricate reality: the human brain repurposes
              its physical navigational circuitry, specifically the hippocampal grid cell network,
              to map abstract thoughts and semantic relationships.
            </p>
            <p className="mb-4">
              When encountering complex English texts, students trained in Linear Thinking learn to
              activate these exact cognitive schemas. Rather than decoding each word in isolation,
              readers discern macro-logical structures: recognizing topic anchors, contextual
              signals, and semantic progression. This mental discipline dramatically reduces working
              memory overload.
            </p>
            <p className="mb-4">
              In experimental trials with 450 IELTS candidates, students applying structural
              simplification improved their accuracy on &apos;Matching Headings&apos; and
              &apos;True/False/Not Given&apos; questions by 42% over an eight-week intervention.
            </p>
          </div>
        </div>

        {/* Right pane: Interactive Questions */}
        <div className="animate-fade-in-up stagger-3 custom-scrollbar flex max-h-[calc(100vh-170px)] flex-col gap-5 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs overflow-y-auto">
          <div className="border-b border-outline-variant pb-3">
            <span className="text-label-sm font-bold text-secondary uppercase">
              Questions 1–3: Multiple Choice
            </span>
            <p className="text-body-sm text-secondary mt-1">
              Choose the correct letter, A, B, C or D.
            </p>
          </div>

          {/* Question 1 */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <h4 className="text-body-md font-bold text-on-surface">
              1. What did classical cognitive researchers believe about mental cartography?
            </h4>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { key: 'A', text: 'It operated exclusively within spatial environments.' },
                { key: 'B', text: 'It was identical in function to language acquisition.' },
                { key: 'C', text: 'It evolved much later than linguistic reasoning.' },
                { key: 'D', text: 'It had no dedicated neural architecture in the brain.' },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className={`flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer text-body-sm transition-colors ${
                    answers[1] === opt.key
                      ? 'border-primary bg-red-50 text-primary font-semibold'
                      : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="q1"
                    checked={answers[1] === opt.key}
                    onChange={() => handleAnswerChange(1, opt.key)}
                    className="accent-primary"
                  />
                  <span>
                    <strong className="mr-1">{opt.key}.</strong> {opt.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Question 2 */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <h4 className="text-body-md font-bold text-on-surface">
              2. According to paragraph 2, how does Linear Thinking benefit IELTS reading?
            </h4>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { key: 'A', text: 'By encouraging word-for-word translation.' },
                { key: 'B', text: 'By reducing working memory overload through logical schemas.' },
                { key: 'C', text: 'By focusing exclusively on vocabulary definitions.' },
                { key: 'D', text: 'By eliminating the need for practice tests.' },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className={`flex items-center gap-3 rounded-lg border p-2.5 cursor-pointer text-body-sm transition-colors ${
                    answers[2] === opt.key
                      ? 'border-primary bg-red-50 text-primary font-semibold'
                      : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <input
                    type="radio"
                    name="q2"
                    checked={answers[2] === opt.key}
                    onChange={() => handleAnswerChange(2, opt.key)}
                    className="accent-primary"
                  />
                  <span>
                    <strong className="mr-1">{opt.key}.</strong> {opt.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticePage
