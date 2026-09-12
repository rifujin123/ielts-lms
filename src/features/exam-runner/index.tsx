import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Clock,
  Award,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useFullExamStore } from './store/fullExamStore'
import { useIeltsExamStore } from './store/ieltsExamStore'
import { ListeningRunner } from './components/ListeningRunner'
import { ReadingRunner } from './components/ReadingRunner'
import { WritingRunner } from './components/WritingRunner'
import { SpeakingRunner } from './components/SpeakingRunner'
import { SubmitConfirmModal } from './components/SubmitConfirmModal'
import { TeacherRubricModal } from './components/TeacherRubricModal'
import { calculateIeltsOverall, getListeningBandFromRaw } from './utils/ieltsScoring'
import { mockTeacherAssessment } from './data'
import { ieltsExamService } from './services/ieltsExamService'
import { toast } from '@/shared/components/Toast/toastStore'
import type { IeltsSkillType } from './types/fullExam.types'

export const ExamRunnerPage: React.FC = () => {
  const navigate = useNavigate()
  const { testId } = useParams<{ testId: string }>()

  const {
    manifest,
    setManifest,
    activeSkill,
    setActiveSkill,
    timeRemaining,
    tickTimer,
    isTimerRunning,
    isSubmitted,
    submitFullExam,
    listeningAnswers,
    writingSubmissions,
    speakingRecordings,
    examMode,
    setExamMode,
    tabSwitchCount,
    incrementTabSwitchCount,
    isRubricModalOpen,
    setIsRubricModalOpen,
    resetExam,
  } = useFullExamStore()

  // Reading sub-store
  const readingStore = useIeltsExamStore()

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false)
  const [showResultView, setShowResultView] = useState<boolean>(isSubmitted)

  // Load manifest dynamically based on testId
  useEffect(() => {
    if (testId) {
      ieltsExamService.getExamManifest(testId).then((data) => {
        setManifest(data)
      })
    }
  }, [testId, setManifest])

  // Retake exam action — resets store, localStorage, and re-enters test runner
  const handleRetakeExam = () => {
    resetExam()
    readingStore.resetExam()
    setShowResultView(false)
    toast.success('Đã khởi tạo lại bài thi thành công!', {
      description: 'Toàn bộ câu trả lời, bản nháp và thời gian làm bài đã được đặt lại từ đầu.',
    })
  }

  // Tab switch listener in Strict Exam Mode
  useEffect(() => {
    if (isSubmitted || examMode !== 'STRICT') return

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        incrementTabSwitchCount()
        toast.warning('Cảnh báo chuyển tab màn hình thi!', {
          description:
            'Hệ thống khảo thí đã ghi nhận hành động rời khỏi bài làm. Vi phạm tối đa 3 lần theo quy chế.',
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isSubmitted, examMode, incrementTabSwitchCount])

  // 1-second countdown timer for the active skill
  useEffect(() => {
    if (!isTimerRunning || isSubmitted) return
    const interval = setInterval(() => {
      tickTimer()
    }, 1000)
    return () => clearInterval(interval)
  }, [isTimerRunning, isSubmitted, tickTimer])

  const remainingSeconds = timeRemaining[activeSkill] || 0
  const minutes = Math.floor(remainingSeconds / 60)
  const seconds = remainingSeconds % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isUrgent = remainingSeconds < 300

  const handleConfirmSubmit = () => {
    submitFullExam()
    readingStore.submitExam()
    setShowResultView(true)
    toast.success('Đã nộp bài thi thành công!')
  }

  // Calculate completion for each skill
  const getSkillCompletion = (skill: IeltsSkillType) => {
    if (skill === 'LISTENING') {
      const count = Object.values(listeningAnswers).filter((v) => v.trim() !== '').length
      return { label: `${count}/40`, isDone: count === 40 }
    }
    if (skill === 'READING') {
      const count = Object.values(readingStore.answers).filter((v) => v.trim() !== '').length
      return { label: `${count}/40`, isDone: count === 40 }
    }
    if (skill === 'WRITING') {
      const t1 = writingSubmissions.task1.trim() !== ''
      const t2 = writingSubmissions.task2.trim() !== ''
      const count = (t1 ? 1 : 0) + (t2 ? 1 : 0)
      return { label: `${count}/2`, isDone: count === 2 }
    }
    if (skill === 'SPEAKING') {
      const count = Object.keys(speakingRecordings).length
      return { label: `${count}/3`, isDone: count === 3 }
    }
    return { label: '0', isDone: false }
  }

  // Dynamically detect skills configured in this mock test manifest
  const availableSkills = (
    [
      {
        key: 'LISTENING' as const,
        label: 'Listening',
        icon: Headphones,
        isAvailable: !!manifest.skills.listening,
      },
      {
        key: 'READING' as const,
        label: 'Reading',
        icon: BookOpen,
        isAvailable: !!manifest.skills.reading,
      },
      {
        key: 'WRITING' as const,
        label: 'Writing',
        icon: PenTool,
        isAvailable: !!manifest.skills.writing,
      },
      {
        key: 'SPEAKING' as const,
        label: 'Speaking',
        icon: Mic,
        isAvailable: !!manifest.skills.speaking,
      },
    ] as const
  ).filter((s) => s.isAvailable)

  // Ensure activeSkill points to an available skill
  useEffect(() => {
    if (availableSkills.length > 0 && !availableSkills.some((s) => s.key === activeSkill)) {
      setActiveSkill(availableSkills[0].key)
    }
  }, [availableSkills, activeSkill, setActiveSkill])

  // Compute current skill index and pagination for mobile single-skill stepper
  const currentSkillIndex = availableSkills.findIndex((s) => s.key === activeSkill)
  const safeSkillIndex = currentSkillIndex >= 0 ? currentSkillIndex : 0
  const currentSkillObj = availableSkills[safeSkillIndex] || availableSkills[0]
  const hasPrevSkill = safeSkillIndex > 0
  const hasNextSkill = safeSkillIndex < availableSkills.length - 1

  const handlePrevSkill = () => {
    if (hasPrevSkill) {
      setActiveSkill(availableSkills[safeSkillIndex - 1].key)
    }
  }

  const handleNextSkill = () => {
    if (hasNextSkill) {
      setActiveSkill(availableSkills[safeSkillIndex + 1].key)
    }
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100">
      {/* ── Top Universal Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-4 shadow-xs relative select-none">
        {/* ── Left: Exit & Branding ─────────────────────────────────── */}
        {/* Left: Exit + Logo + Test Title */}
        <div className="flex items-center justify-start gap-2 sm:gap-3 min-w-0 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/tests')}
            title="Thoát phòng thi"
            className="btn-interactive flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <img
              src="/branding.png"
              alt="IELTS Hồ Thành"
              className="h-8 w-auto max-w-[80px] sm:max-w-[100px] object-contain"
            />
            <div className="hidden xl:block">
              <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                IELTS Hồ Thành
              </div>
              <div className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[150px] lg:max-w-[200px]">
                {manifest.title}
              </div>
            </div>
          </div>
        </div>

        {/* ── Center: Dynamic Skill Switcher (Absolute Dead-Center) ──── */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto z-20 max-w-[calc(100%-320px)] md:max-w-none">
          {availableSkills.length > 1 ? (
            <>
              {/* Mobile (< md): Minimal Carousel Pill with Chevrons */}
              <div className="relative flex md:hidden items-center select-none mx-3.5">
                {/* Left Half-Inset Circular Chevron */}
                <button
                  type="button"
                  onClick={handlePrevSkill}
                  disabled={!hasPrevSkill}
                  aria-label="Kỹ năng trước"
                  title={
                    hasPrevSkill
                      ? `Chuyển về ${availableSkills[safeSkillIndex - 1].label}`
                      : 'Đã ở kỹ năng đầu tiên'
                  }
                  className="btn-interactive absolute -left-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>

                {/* Active Skill Pill - Minimal Academic White */}
                <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white pl-6 pr-6 py-1 text-xs font-semibold text-slate-800 shadow-2xs">
                  {React.createElement(currentSkillObj.icon, {
                    className: 'h-3.5 w-3.5 text-slate-600 shrink-0',
                    strokeWidth: 1.75,
                  })}
                  <span>{currentSkillObj.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-medium shrink-0 ${
                      getSkillCompletion(currentSkillObj.key).isDone
                        ? 'bg-slate-100 text-slate-800 border border-slate-300'
                        : 'bg-slate-100 text-slate-500 border border-slate-200/60'
                    }`}
                  >
                    {getSkillCompletion(currentSkillObj.key).label}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {safeSkillIndex + 1}/{availableSkills.length}
                  </span>
                </div>

                {/* Right Half-Inset Circular Chevron */}
                <button
                  type="button"
                  onClick={handleNextSkill}
                  disabled={!hasNextSkill}
                  aria-label="Kỹ năng sau"
                  title={
                    hasNextSkill
                      ? `Chuyển sang ${availableSkills[safeSkillIndex + 1].label}`
                      : 'Đã ở kỹ năng cuối cùng'
                  }
                  className="btn-interactive absolute -right-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>

              {/* Tablet & Desktop (>= md): Full Skills Horizontal Tabs */}
              <div className="hidden md:flex items-center gap-1 rounded-xl bg-slate-100/90 p-1 border border-slate-200/80 shadow-2xs max-w-full overflow-x-auto">
                {availableSkills.map(({ key, label, icon: Icon }) => {
                  const isActive = activeSkill === key
                  const { label: compLabel, isDone } = getSkillCompletion(key)

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveSkill(key)}
                      className={`btn-interactive flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 text-xs transition-all border ${
                        isActive
                          ? 'border-slate-300/90 bg-white font-semibold text-slate-900 shadow-2xs'
                          : 'border-transparent font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60'
                      }`}
                    >
                      <Icon
                        className="h-3.5 w-3.5 text-slate-600"
                        strokeWidth={isActive ? 2 : 1.75}
                      />
                      <span>{label}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-medium ${
                          isDone
                            ? 'bg-slate-100 text-slate-800 border border-slate-300'
                            : isActive
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-slate-200/70 text-slate-600'
                        }`}
                      >
                        {compLabel}
                      </span>
                    </button>
                  )
                })}
              </div>
            </>
          ) : availableSkills.length === 1 ? (
            /* Single Skill Exam Badge */
            <div className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-100/90 px-3.5 py-1.5 border border-slate-200/80 text-xs font-semibold text-slate-800 shadow-2xs">
              {React.createElement(availableSkills[0].icon, {
                className: 'h-3.5 w-3.5 text-slate-600',
                strokeWidth: 1.75,
              })}
              <span>{availableSkills[0].label} Test</span>
              <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {getSkillCompletion(availableSkills[0].key).label}
              </span>
            </div>
          ) : null}
        </div>

        {/* ── Right: Mode Badge, Timer & Submit Actions ─────────────── */}
        <div className="flex items-center justify-end gap-2.5 shrink-0 min-w-0 ml-auto z-10">
          {/* Interactive Toggle Button: 'Strict' vs 'Practice' */}
          {!isSubmitted && (
            <button
              type="button"
              onClick={() => {
                const nextMode = examMode === 'STRICT' ? 'PRACTICE' : 'STRICT'
                setExamMode(nextMode)
                toast.info(
                  nextMode === 'PRACTICE'
                    ? 'Chế độ Luyện tập: Cho phép tra từ vựng trực tiếp trong bài đọc.'
                    : 'Chế độ Thi thật (Strict): Khóa tra từ để đảm bảo tính trung thực.',
                  { duration: 2500 },
                )
              }}
              title={
                examMode === 'STRICT'
                  ? 'Chế độ Strict (Thi thật). Nhấp để chuyển sang Luyện tập (Practice) để tra từ vựng.'
                  : 'Chế độ Practice (Luyện tập - cho phép tra từ). Nhấp để chuyển sang Thi thật (Strict).'
              }
              className={`btn-interactive hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition-all ${
                examMode === 'STRICT'
                  ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 shadow-2xs'
                  : 'border-slate-300 bg-white font-bold text-slate-900 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              {examMode === 'STRICT' ? (
                <>
                  <ShieldAlert className="h-3.5 w-3.5 text-slate-500 shrink-0" strokeWidth={1.75} />
                  <span>Strict</span>
                  {tabSwitchCount > 0 && (
                    <span
                      title={`Cảnh báo: Đã phát hiện ${tabSwitchCount}/3 lần chuyển tab`}
                      className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.2 text-[10px] font-bold bg-slate-200 text-slate-700"
                    >
                      <span>{tabSwitchCount}/3</span>
                    </span>
                  )}
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-700 shrink-0" strokeWidth={2} />
                  <span>Practice (Tra từ)</span>
                </>
              )}
            </button>
          )}

          {/* Countdown timer only when NOT submitted */}
          {!isSubmitted && (
            <div
              className={`flex items-center gap-1.5 font-mono text-sm font-bold tracking-tight px-1 ${
                isUrgent ? 'animate-pulse text-red-600' : 'text-slate-700'
              }`}
            >
              <Clock className="h-4 w-4 text-slate-500" />
              <span>{formattedTime}</span>
            </div>
          )}

          {/* Post-Submission Review Actions */}
          {isSubmitted && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResultView(!showResultView)}
                className="btn-interactive inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
              >
                {showResultView ? (
                  <>
                    <Eye className="h-4 w-4 text-slate-300" strokeWidth={1.75} />
                    <span>Xem lại đề thi</span>
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 text-slate-300" strokeWidth={1.75} />
                    <span>Xem bảng điểm</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRetakeExam}
                className="btn-interactive inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} />
                <span>Làm lại</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Active Skill Runner Workspace ──────────────────────────── */}
      <div className="flex-1 overflow-hidden">
        {isSubmitted && showResultView ? (
          <div className="h-full overflow-y-auto">
            {/* Full 4-Skill Consolidated Score Card */}
            {/* Minimalist Score View (Matching User Reference) */}
            <div className="max-w-md mx-auto py-8 px-4 sm:px-0 space-y-5">
              {/* Header Title */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Your full score and explanation
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Mã đề thi: {manifest.code} • Chuẩn làm tròn IELTS IDP & British Council
                </p>
              </div>

              {(() => {
                const listeningAnsweredCount = Object.values(listeningAnswers).filter(
                  (v) => v.trim() !== '',
                ).length
                const listeningRawScore =
                  listeningAnsweredCount > 0
                    ? Math.min(40, Math.max(15, listeningAnsweredCount))
                    : 34
                const listeningBand = getListeningBandFromRaw(listeningRawScore)
                const readingBand = readingStore.scoreResult?.bandScore ?? 8.0
                const writingBand = mockTeacherAssessment.writingTask2.overallTask2
                const speakingBand = mockTeacherAssessment.speaking.overallSpeaking

                // Dynamic Overall Band from configured skills
                const activeBands: number[] = []
                if (manifest.skills.listening) activeBands.push(listeningBand)
                if (manifest.skills.reading) activeBands.push(readingBand)
                if (manifest.skills.writing) activeBands.push(writingBand)
                if (manifest.skills.speaking) activeBands.push(speakingBand)

                let overallBand = 0
                if (activeBands.length === 4) {
                  overallBand = calculateIeltsOverall(
                    listeningBand,
                    readingBand,
                    writingBand,
                    speakingBand,
                  )
                } else if (activeBands.length > 0) {
                  const avg = activeBands.reduce((a, b) => a + b, 0) / activeBands.length
                  const dec = avg - Math.floor(avg)
                  overallBand = Math.floor(avg) + (dec >= 0.75 ? 1.0 : dec >= 0.25 ? 0.5 : 0)
                }

                return (
                  <>
                    {/* Vertical Score Card List */}
                    <div className="space-y-3">
                      {manifest.skills.listening && (
                        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-3.5">
                            <Headphones
                              className="h-5 w-5 text-rose-600 shrink-0"
                              strokeWidth={1.75}
                            />
                            <span className="text-base font-medium text-slate-800">Listening</span>
                          </div>
                          <span className="text-base sm:text-lg font-medium text-slate-800 tabular-nums">
                            {listeningBand.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {manifest.skills.reading && (
                        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-3.5">
                            <BookOpen
                              className="h-5 w-5 text-rose-600 shrink-0"
                              strokeWidth={1.75}
                            />
                            <span className="text-base font-medium text-slate-800">Reading</span>
                          </div>
                          <span className="text-base sm:text-lg font-medium text-slate-800 tabular-nums">
                            {readingBand.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {manifest.skills.writing && (
                        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-3.5">
                            <PenTool
                              className="h-5 w-5 text-rose-600 shrink-0"
                              strokeWidth={1.75}
                            />
                            <span className="text-base font-medium text-slate-800">Writing</span>
                          </div>
                          <span className="text-base sm:text-lg font-medium text-slate-800 tabular-nums">
                            {writingBand.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {manifest.skills.speaking && (
                        <div className="rounded-2xl border border-slate-200/80 bg-white px-5 py-4 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-3.5">
                            <MessageSquare
                              className="h-5 w-5 text-rose-600 shrink-0"
                              strokeWidth={1.75}
                            />
                            <span className="text-base font-medium text-slate-800">Speaking</span>
                          </div>
                          <span className="text-base sm:text-lg font-medium text-slate-800 tabular-nums">
                            {speakingBand.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {/* Overall Band Score Card */}
                      <div className="rounded-2xl border border-slate-200/90 bg-white px-5 py-4.5 flex items-center justify-between shadow-xs mt-2">
                        <span className="text-base sm:text-lg font-bold text-slate-800">
                          Your overall band score
                        </span>
                        <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                          {overallBand.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* 48h SLA Banner & Teacher Rubric Trigger */}
                    {(manifest.skills.writing || manifest.skills.speaking) && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-slate-500 shrink-0" strokeWidth={1.75} />
                          <div className="text-xs text-slate-600">
                            Writing & Speaking đang được GV chấm (SLA 48h).
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsRubricModalOpen(true)}
                          className="btn-interactive shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 shadow-2xs"
                        >
                          <FileCheck className="h-3.5 w-3.5 text-slate-600" strokeWidth={1.75} />
                          <span>Phiếu chấm mẫu</span>
                        </button>
                      </div>
                    )}
                  </>
                )
              })()}

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowResultView(false)}
                  className="btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-xs"
                >
                  <Eye className="h-4 w-4" strokeWidth={1.75} />
                  <span>Xem lại cấu trúc đề & bài làm</span>
                </button>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleRetakeExam}
                    className="btn-interactive flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs"
                  >
                    <RotateCcw className="h-4 w-4 text-slate-500" strokeWidth={1.75} />
                    <span>Làm lại</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/tests')}
                    className="btn-interactive flex-1 sm:flex-initial inline-flex items-center justify-center rounded-xl border border-transparent px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    Về bài test
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col overflow-hidden">
            {/* 1. LISTENING WORKSPACE */}
            {activeSkill === 'LISTENING' && manifest.skills.listening && (
              <ListeningRunner
                skillData={manifest.skills.listening}
                onSubmit={() => setIsSubmitModalOpen(true)}
              />
            )}

            {/* 2. READING WORKSPACE */}
            {activeSkill === 'READING' && manifest.skills.reading && (
              <ReadingRunner skillData={manifest.skills.reading} />
            )}

            {/* 3. WRITING WORKSPACE */}
            {activeSkill === 'WRITING' && manifest.skills.writing && (
              <WritingRunner skillData={manifest.skills.writing} />
            )}

            {/* 4. SPEAKING WORKSPACE */}
            {activeSkill === 'SPEAKING' && manifest.skills.speaking && (
              <SpeakingRunner skillData={manifest.skills.speaking} />
            )}
          </div>
        )}
      </div>

      {/* ── Submit Full 4-Skill Confirmation Dialog ────────────────── */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
      />

      {/* ── Teacher Evaluation Rubric Modal ────────────────────────── */}
      <TeacherRubricModal
        isOpen={isRubricModalOpen}
        onClose={() => setIsRubricModalOpen(false)}
        assessment={mockTeacherAssessment}
      />
    </div>
  )
}

export default ExamRunnerPage
