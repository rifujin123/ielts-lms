import React, { useState, useRef, useEffect } from 'react'
import {
  Volume2,
  VolumeX,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from 'lucide-react'
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

  // Auto-scroll safe-zone: center focused input fields above virtual keyboard on mobile
  useEffect(() => {
    const workspace = document.getElementById('listening-scroll-workspace')
    if (!workspace) return

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        // Wait 150ms for mobile virtual keyboard animation to settle
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 150)
      }
    }

    workspace.addEventListener('focusin', handleFocusIn)
    return () => workspace.removeEventListener('focusin', handleFocusIn)
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
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

      {/* ── Mobile Sticky Top Audio Bar (< 768px: Stays visible above keyboard) ── */}
      <div className="sm:hidden sticky top-0 z-20 shrink-0 border-b border-slate-200 bg-white shadow-xs px-4 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">
              Section {currentSection.sectionNumber}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              className="text-slate-600 hover:text-slate-900"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-red-500" />
              ) : (
                <Volume2 className="h-4 w-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Mini Audio Progress Track */}
        <div className="relative w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-red-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── 1. SCROLLABLE QUESTIONS WORKSPACE (FULL HEIGHT) ─────────── */}
      <div
        id="listening-scroll-workspace"
        className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 sm:pt-10 pb-36 custom-scrollbar"
      >
        <div className="mx-auto w-full max-w-2xl space-y-6">
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
        {/* Red Line Audio Progress Track with Sliding Timestamp Capsule Pill (Desktop) */}
        <div className="hidden sm:block relative w-full h-1 bg-slate-100 overflow-visible">
          <div
            className="h-full bg-red-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
          <div
            title="Thời gian phát audio"
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-red-600 px-3 py-1 text-xs font-mono font-bold text-white shadow-sm select-none pointer-events-none whitespace-nowrap z-10"
            style={{ left: `${Math.max(2, Math.min(98, progressPct))}%` }}
          >
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Row A: Swipeable Question Jump Ribbon (1, 2, 3... 10) */}
        {showQuestionPills && (
          <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 border-b border-slate-100 py-2.5 sm:py-3 px-3 sm:px-4 overflow-x-auto custom-scrollbar scroll-smooth">
            {currentSection.questions.map((q) => {
              const isAns = listeningAnswers[q.id] && listeningAnswers[q.id].trim() !== ''
              const isFlag = !!flaggedQuestions[`LISTENING_${q.id}`]

              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => scrollToQuestion(q.id)}
                  title={`Câu ${q.id} - ${isAns ? 'Đã làm' : 'Chưa làm'}`}
                  className={`btn-interactive relative flex h-8 sm:h-9 min-w-8 sm:min-w-9 shrink-0 items-center justify-center rounded-lg px-2.5 sm:px-3 text-xs sm:text-sm font-bold transition-all border ${
                    isFlag
                      ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-2xs'
                      : isAns
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-700 font-bold'
                        : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{q.id}</span>
                  {isFlag && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white" />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Row B: Main DOL Bottom Action Bar */}
        <div className="relative flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
          {/* Left: Collapse Icon + Section Count + Audio Volume */}
          <div className="flex flex-1 items-center justify-start gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setShowQuestionPills(!showQuestionPills)}
              title={showQuestionPills ? 'Thu gọn hàng câu hỏi' : 'Hiện hàng câu hỏi'}
              className="btn-interactive flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  showQuestionPills ? '' : 'rotate-180'
                }`}
              />
            </button>

            <div className="hidden sm:flex flex-col shrink-0">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Section {currentSection.sectionNumber}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Đã làm {answeredInCurrent} / {endQ - startQ + 1}
              </span>
            </div>

            {/* Audio Volume Control (Desktop only, mobile relies on hardware buttons) */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200 shrink-0">
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
          <div className="flex items-center justify-center min-w-0 px-1 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2">
            {/* Mobile & Tablet (< lg): Single Active Section with Half-Inset Circular Chevrons (50% in, 50% out) */}
            <div className="relative flex lg:hidden items-center select-none mx-3.5">
              <button
                type="button"
                onClick={() => {
                  if (activeSectionIndex > 0) {
                    setActiveSectionIndex(activeSectionIndex - 1)
                  }
                }}
                disabled={activeSectionIndex <= 0}
                aria-label="Section trước"
                title={
                  activeSectionIndex > 0
                    ? `Chuyển về Section ${skillData.sections[activeSectionIndex - 1].sectionNumber}`
                    : 'Đã ở Section đầu tiên'
                }
                className="btn-interactive absolute -left-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>

              <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white pl-6 pr-6 py-1 text-xs font-semibold text-slate-800 shadow-2xs">
                <Headphones className="h-3.5 w-3.5 text-slate-600 shrink-0" strokeWidth={1.75} />
                <span>Section {currentSection.sectionNumber}</span>
                <span className="rounded-full px-1.5 py-0.2 text-[10px] bg-slate-100 text-slate-600 border border-slate-200/60 font-medium shrink-0">
                  {answeredInCurrent}/{endQ - startQ + 1}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeSectionIndex + 1}/{skillData.sections.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (activeSectionIndex < skillData.sections.length - 1) {
                    setActiveSectionIndex(activeSectionIndex + 1)
                  }
                }}
                disabled={activeSectionIndex >= skillData.sections.length - 1}
                aria-label="Section sau"
                title={
                  activeSectionIndex < skillData.sections.length - 1
                    ? `Chuyển sang Section ${skillData.sections[activeSectionIndex + 1].sectionNumber}`
                    : 'Đã ở Section cuối cùng'
                }
                className="btn-interactive absolute -right-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Desktop (>= lg): Full 4 Sections Horizontal Tabs */}
            <div className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-100/90 p-1 border border-slate-200/80 shadow-2xs overflow-x-auto custom-scrollbar">
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
                    className={`btn-interactive flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all border ${
                      isActive
                        ? 'border-slate-300/90 bg-white font-semibold text-slate-900 shadow-2xs'
                        : 'border-transparent font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span>Section {sec.sectionNumber}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-medium ${
                        isActive
                          ? 'bg-slate-100 text-slate-700 border border-slate-200/80'
                          : 'bg-slate-200/70 text-slate-600'
                      }`}
                    >
                      {count}/{total}
                    </span>
                    {/* Mini Progress Bar Line */}
                    <div className="h-1 w-7 rounded-full overflow-hidden bg-slate-200">
                      <div
                        className="h-full transition-all duration-300 bg-slate-600"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Red Primary Next Button */}
          <div className="flex flex-1 items-center justify-end min-w-0">
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
