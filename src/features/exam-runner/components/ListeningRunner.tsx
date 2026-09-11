import React, { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, ChevronDown, ArrowRight, CheckCircle2 } from 'lucide-react'
import type { ListeningExamSkill } from '../types/fullExam.types'
import { useFullExamStore } from '../store/fullExamStore'
import { ListeningSectionView } from './ListeningSectionView'

interface ListeningRunnerProps {
  skillData: ListeningExamSkill
  onSubmit?: () => void
}

export const ListeningRunner: React.FC<ListeningRunnerProps> = ({ skillData, onSubmit }) => {
  const {
    activeSectionIndex,
    setActiveSectionIndex,
    listeningAnswers,
    setListeningAnswer,
    flaggedQuestions,
    toggleFlag,
    isSubmitted,
    submitFullExam,
  } = useFullExamStore()

  // Audio state - Auto plays on access & section change (No manual start button)
  const [volume, setVolume] = useState<number>(80)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(330) // Default 5:30
  const [showQuestionPills, setShowQuestionPills] = useState<boolean>(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentSection = skillData.sections[activeSectionIndex] || skillData.sections[0]
  const [startQ, endQ] = currentSection.questionRange

  // Auto-play audio immediately upon access and section change
  useEffect(() => {
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Autoplay policy fallback (silent catch)
      })
    }
  }, [activeSectionIndex])

  // Simulated progress timer running continuously (auto-play simulation)
  useEffect(() => {
    if (isSubmitted) return
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= duration) return duration
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [duration, isSubmitted])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  // Count answered in current section
  let answeredInCurrent = 0
  for (let i = startQ; i <= endQ; i++) {
    if (listeningAnswers[i] && listeningAnswers[i].trim() !== '') {
      answeredInCurrent++
    }
  }

  const scrollToQuestion = (qId: number) => {
    const el = document.getElementById(`listening-question-${qId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleNextSection = () => {
    if (activeSectionIndex < skillData.sections.length - 1) {
      setActiveSectionIndex(activeSectionIndex + 1)
      const container = document.getElementById('listening-scroll-workspace')
      if (container) container.scrollTop = 0
    }
  }

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit()
    } else {
      submitFullExam()
    }
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-100">
      {/* ── Hidden HTML5 Audio Element for live stream support ──────── */}
      {currentSection.audioUrl && (
        <audio
          ref={audioRef}
          src={currentSection.audioUrl}
          autoPlay
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime)
              if (audioRef.current.duration) {
                setDuration(audioRef.current.duration)
              }
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current && audioRef.current.duration) {
              setDuration(audioRef.current.duration)
            }
          }}
        />
      )}

      {/* ── 1. SCROLLABLE QUESTIONS WORKSPACE (FULL HEIGHT) ─────────── */}
      <div
        id="listening-scroll-workspace"
        className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar"
      >
        <div className="mx-auto w-full max-w-5xl space-y-4">
          {/* Modular Section View (Supports Multiple Choice, Completion, Table Completion, etc.) */}
          <ListeningSectionView
            section={currentSection}
            answers={listeningAnswers}
            onAnswerChange={setListeningAnswer}
            flaggedQuestions={flaggedQuestions}
            onToggleFlag={(qId) => toggleFlag('LISTENING', qId)}
            isSubmitted={isSubmitted}
          />
        </div>
      </div>

      {/* ── 2. SIGNATURE DOL BOTTOM NAVIGATION BAR (MATCHES SCREENSHOT) ── */}
      <footer className="sticky bottom-0 z-30 shrink-0 border-t border-slate-200 bg-white shadow-lg">
        {/* Red Line Audio Progress Track with Sliding Timestamp Capsule Pill */}
        <div className="relative w-full h-[3px] bg-slate-200/90 overflow-visible">
          <div
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
          <div
            title="Thời gian phát audio"
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-mono font-bold text-white shadow-xs select-none pointer-events-none whitespace-nowrap z-10"
            style={{ left: `${Math.max(2, Math.min(98, progressPct))}%` }}
          >
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Row A: Centered Question Jump Pills (1, 2, 3... 10) */}
        {showQuestionPills && (
          <div className="flex items-center justify-center gap-1.5 border-b border-slate-100 py-2 px-4 overflow-x-auto custom-scrollbar">
            {currentSection.questions.map((q) => {
              const isAns = listeningAnswers[q.id] && listeningAnswers[q.id].trim() !== ''
              const isFlag = !!flaggedQuestions[`LISTENING_${q.id}`]

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => scrollToQuestion(q.id)}
                  title={`Câu ${q.id} - ${isAns ? 'Đã làm' : 'Chưa làm'}`}
                  className={`btn-interactive relative flex h-7 min-w-8 items-center justify-center rounded-xl px-2.5 text-xs font-bold transition-all border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 ${
                    isAns
                      ? 'text-slate-900 underline decoration-2 underline-offset-4 decoration-slate-900'
                      : 'text-slate-700'
                  }`}
                >
                  <span>{q.id}</span>
                  {isFlag && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-500 ring-1 ring-white" />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Row B: Main DOL Bottom Action Bar */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
          {/* Left: Collapse Icon + Section Count + Audio Volume */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowQuestionPills(!showQuestionPills)}
              title={showQuestionPills ? 'Thu gọn hàng câu hỏi' : 'Hiện hàng câu hỏi'}
              className="btn-interactive flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  showQuestionPills ? '' : 'rotate-180'
                }`}
              />
            </button>

            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Section {currentSection.sectionNumber}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Đã làm {answeredInCurrent} / {endQ - startQ + 1}
              </span>
            </div>

            {/* Audio Volume Control */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                className="text-slate-500 hover:text-slate-800 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-red-500" />
                ) : (
                  <Volume2 className="h-4 w-4 text-slate-700" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setVolume(val)
                  setIsMuted(val === 0)
                  if (audioRef.current) {
                    audioRef.current.volume = val / 100
                  }
                }}
                aria-label="Điều chỉnh âm lượng"
                className="h-1.5 w-14 sm:w-18 cursor-pointer accent-red-600"
              />
            </div>
          </div>

          {/* Center: 4 Section Pills with Mini Progress Bars */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
            {skillData.sections.map((sec, idx) => {
              const isActive = activeSectionIndex === idx
              const [s, e] = sec.questionRange
              let count = 0
              for (let i = s; i <= e; i++) {
                if (listeningAnswers[i] && listeningAnswers[i].trim() !== '') {
                  count++
                }
              }
              const total = e - s + 1
              const pct = total > 0 ? (count / total) * 100 : 0

              return (
                <button
                  key={sec.sectionNumber}
                  type="button"
                  onClick={() => setActiveSectionIndex(idx)}
                  className={`btn-interactive flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all border ${
                    isActive
                      ? 'border-red-200 bg-red-50/80 text-red-600 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>Section {sec.sectionNumber}</span>
                  <span
                    className={isActive ? 'text-red-300 font-normal' : 'text-slate-300 font-normal'}
                  >
                    |
                  </span>
                  <span
                    className={`text-[11px] font-mono ${
                      isActive ? 'text-red-600 font-bold' : 'text-slate-500 font-medium'
                    }`}
                  >
                    {count}/{total}
                  </span>
                  {/* Mini Progress Bar Line */}
                  <div
                    className={`h-1 w-8 rounded-full overflow-hidden ${
                      isActive ? 'bg-red-200' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`h-full transition-all duration-300 ${
                        isActive ? 'bg-red-600' : 'bg-slate-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right: Red Primary Next Button */}
          <div className="shrink-0">
            {activeSectionIndex < skillData.sections.length - 1 ? (
              <button
                type="button"
                onClick={handleNextSection}
                className="btn-interactive flex items-center gap-1.5 rounded-xl bg-red-600 px-4 sm:px-5 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-xs active:scale-95 transition-all"
              >
                <span>Section {skillData.sections[activeSectionIndex + 1].sectionNumber}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-interactive flex items-center gap-1.5 rounded-xl bg-red-600 px-5 sm:px-6 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-xs active:scale-95 transition-all"
              >
                <span>Nộp bài</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
