import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Award,
  CheckCircle2,
  Headphones,
  Mic,
  MessageSquare,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { mockSpeakingFeedbacks, type SpeakingPartFeedback } from '../../data/mockTeacherRubric'

export interface SpeakingFeedbackReviewProps {
  initialPart?: 1 | 2 | 3
  feedbackList?: SpeakingPartFeedback[]
  recordedAudioUrls?: Record<number, string>
}

export const SpeakingFeedbackReview: React.FC<SpeakingFeedbackReviewProps> = ({
  initialPart = 1,
  feedbackList = mockSpeakingFeedbacks,
  recordedAudioUrls = {},
}) => {
  const [activePart, setActivePart] = useState<1 | 2 | 3>(initialPart)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  const currentFeedback = useMemo(() => {
    return feedbackList.find((f) => f.partNumber === activePart) || feedbackList[0]
  }, [feedbackList, activePart])

  const duration = currentFeedback.durationSeconds || 180

  // Simulated audio playback timer if real audio is not available
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    // Reset playback when switching part
    setIsPlaying(false)
    setCurrentTime(0)
  }, [activePart])

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 250
      timerRef.current = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + (intervalMs / 1000) * playbackSpeed
          if (next >= duration) {
            setIsPlaying(false)
            return duration
          }
          return next
        })
      }, intervalMs)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, playbackSpeed, duration])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleTogglePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0)
    }
    setIsPlaying((prev) => !prev)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekValue = parseFloat(e.target.value)
    setCurrentTime(seekValue)
  }

  const handleSkip = (seconds: number) => {
    setCurrentTime((prev) => Math.max(0, Math.min(duration, prev + seconds)))
  }

  // Calculate overall speaking band for this part
  const partOverallBand = useMemo(() => {
    const { fluencyCoherence, lexicalResource, grammaticalRangeAccuracy, pronunciation } =
      currentFeedback.criteriaScores
    return (fluencyCoherence + lexicalResource + grammaticalRangeAccuracy + pronunciation) / 4
  }, [currentFeedback])

  return (
    <div className="w-full space-y-6">
      {/* ── Top Header & Part Switcher ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-2xs">
            <Mic className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-800">
                Đánh giá bài thi Nói 3 Phần (Parts 1 - 3)
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Band Điểm Phần Này: <strong>{partOverallBand.toFixed(1)}</strong>
              </span>
            </div>
            <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
              Phát Lại Ghi Âm & Nhận Xét Giám Khảo (Speaking Audio & Feedback)
            </h2>
          </div>
        </div>

        {/* Part 1, Part 2, Part 3 Pill Switchers (0px Shift) */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 self-start sm:self-auto">
          {feedbackList.map((f) => {
            const isActive = activePart === f.partNumber
            return (
              <button
                key={f.partNumber}
                type="button"
                onClick={() => setActivePart(f.partNumber)}
                className={`btn-interactive flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 border ${
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                <Headphones className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>Part {f.partNumber}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {formatTime(f.durationSeconds)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Audio Player Component ─────────────────────────────────── */}
      <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-300 mb-1">
              <Headphones className="h-3 w-3 text-red-400" />
              File Ghi Âm Bài Thi Của Thí Sinh • Part {currentFeedback.partNumber}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {currentFeedback.partTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Chủ đề: {currentFeedback.topic}</p>
          </div>

          {/* Actual Audio element if local recorded URL is passed */}
          {recordedAudioUrls[currentFeedback.partNumber] && (
            <audio
              src={recordedAudioUrls[currentFeedback.partNumber]}
              controls
              className="h-9 w-full md:w-64"
            />
          )}
        </div>

        {/* Audio Visualizer Waves Simulation */}
        <div className="my-5 flex items-end justify-center gap-1 h-12 px-4 overflow-hidden">
          {Array.from({ length: 48 }).map((_, i) => {
            // Pseudo waveform height
            const baseH = 20 + ((i * 17) % 65)
            const activeH = isPlaying ? Math.min(100, baseH + ((i * 23) % 40)) : baseH * 0.4
            const isPassed = i / 48 <= currentTime / duration

            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPassed ? 'bg-red-500 shadow-xs' : isPlaying ? 'bg-slate-700' : 'bg-slate-800'
                }`}
                style={{ height: `${activeH}%` }}
              />
            )
          })}
        </div>

        {/* Timeline Slider */}
        <div className="space-y-1.5">
          <input
            type="range"
            min={0}
            max={duration}
            step={0.5}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            aria-label="Thanh trượt thời gian audio"
          />
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls Bar */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSkip(-5)}
              title="Lùi 5 giây"
              className="btn-interactive flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleTogglePlay}
              className="btn-interactive flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md hover:bg-red-500 active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSkip(5)}
              title="Tới 5 giây"
              className="btn-interactive flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <RotateCcw className="h-4 w-4 rotate-180" />
            </button>
          </div>

          {/* Speed & Volume Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-slate-800 p-1">
              {[0.75, 1.0, 1.25].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`btn-interactive rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                    playbackSpeed === speed
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsMuted((prev) => !prev)}
              className="btn-interactive flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 Cambridge Criteria Scorecard ───────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Fluency & Coherence
            </span>
            <Award className="h-4 w-4 text-red-600" strokeWidth={1.75} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentFeedback.criteriaScores.fluencyCoherence.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 9.0</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-600 transition-all duration-500"
              style={{
                width: `${(currentFeedback.criteriaScores.fluencyCoherence / 9) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Lexical Resource
            </span>
            <Sparkles className="h-4 w-4 text-amber-600" strokeWidth={1.75} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentFeedback.criteriaScores.lexicalResource.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 9.0</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amber-600 transition-all duration-500"
              style={{
                width: `${(currentFeedback.criteriaScores.lexicalResource / 9) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Grammar & Accuracy
            </span>
            <Award className="h-4 w-4 text-purple-600" strokeWidth={1.75} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentFeedback.criteriaScores.grammaticalRangeAccuracy.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 9.0</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-purple-600 transition-all duration-500"
              style={{
                width: `${(currentFeedback.criteriaScores.grammaticalRangeAccuracy / 9) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Pronunciation
            </span>
            <Headphones className="h-4 w-4 text-emerald-600" strokeWidth={1.75} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentFeedback.criteriaScores.pronunciation.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 9.0</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-500"
              style={{
                width: `${(currentFeedback.criteriaScores.pronunciation / 9) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Examiner In-Depth Comments & Cue Questions ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Examiner Detailed Feedback, Strengths & Areas for Improvement */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Examiner Note */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <MessageSquare className="h-5 w-5 text-red-600" strokeWidth={1.75} />
              <h3 className="text-sm font-bold text-slate-900">
                Lời phê chi tiết của Giám khảo (Examiner Notes)
              </h3>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
              {currentFeedback.examinerNotes}
            </p>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Strengths Card */}
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Điểm sáng nổi bật (Key Strengths):
              </h4>
              <ul className="space-y-2">
                {currentFeedback.strengths.map((str, i) => (
                  <li key={i} className="text-xs text-emerald-950 flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-3">
                <Sparkles className="h-4 w-4 text-amber-600" />
                Cần khắc phục để lên Band 8.0+:
              </h4>
              <ul className="space-y-2">
                {currentFeedback.improvements.map((imp, i) => (
                  <li key={i} className="text-xs text-amber-950 flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Prompt Questions & Sample Transcript */}
        <div className="lg:col-span-5 space-y-5">
          {/* Questions asked in this Part */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Câu hỏi trong lượt thi (Examiner Prompts)
            </h3>
            <div className="space-y-2.5">
              {currentFeedback.questions.map((q, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-800 font-medium"
                >
                  <span className="font-bold text-red-600 mr-1.5">Q{idx + 1}:</span>
                  {q}
                </div>
              ))}
            </div>
          </div>

          {/* Transcript Snippet */}
          {currentFeedback.transcriptSnippet && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Trích dẫn bài nói thực tế (Transcript Snippet)
              </h3>
              <blockquote className="rounded-2xl border-l-4 border-l-red-500 bg-slate-50 p-4 text-xs font-serif italic leading-relaxed text-slate-800">
                {currentFeedback.transcriptSnippet}
              </blockquote>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
