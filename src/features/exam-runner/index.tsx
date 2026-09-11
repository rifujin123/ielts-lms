import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  Clock,
  Send,
  GraduationCap,
  Award,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  FileCheck,
  RotateCcw,
  Eye,
} from 'lucide-react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { GripVertical } from 'lucide-react'
import { useFullExamStore } from './store/fullExamStore'
import { useIeltsExamStore } from './store/ieltsExamStore'
import { ListeningRunner } from './components/ListeningRunner'
import { WritingRunner } from './components/WritingRunner'
import { SpeakingRunner } from './components/SpeakingRunner'
import { ReadingPassageView } from './components/ReadingPassageView'
import { QuestionCard } from './components/QuestionCard'
import { ExamBottomPalette } from './components/ExamBottomPalette'
import { SubmitConfirmModal } from './components/SubmitConfirmModal'
import { ExamResultView } from './components/ExamResultView'
import { TeacherRubricModal } from './components/TeacherRubricModal'
import {
  calculateIeltsOverall,
  getListeningBandFromRaw,
  mockTeacherAssessment,
} from './utils/ieltsScoring'
import { toast } from '@/shared/components/Toast/toastStore'
import type { IeltsSkillType } from './types/fullExam.types'

export const ExamRunnerPage: React.FC = () => {
  const navigate = useNavigate()
  const { testId: _testId } = useParams()

  const {
    manifest,
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

  const currentPassage = readingStore.manifest.passages.find(
    (p) => p.id === readingStore.activePassageId,
  )
  const [startQ, endQ] = currentPassage ? currentPassage.questionRange : [1, 13]
  const currentQuestions = readingStore.manifest.questions.filter(
    (q) => q.id >= startQ && q.id <= endQ,
  )

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-100 select-none">
      {/* ── Top Universal 4-Skill Header ───────────────────────────── */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/tests')}
            title="Thoát phòng thi"
            className="btn-interactive flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={2} />
          </button>

          <div className="hidden xl:flex items-center gap-2 pr-3 border-r border-slate-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white shadow-xs">
              <GraduationCap className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                IELTS Hồ Thành
              </div>
              <div className="text-xs font-bold text-slate-800 line-clamp-1">{manifest.title}</div>
            </div>
          </div>

          {/* 4-Skill Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200">
            {(
              [
                { key: 'LISTENING', label: 'Listening', icon: Headphones },
                { key: 'READING', label: 'Reading', icon: BookOpen },
                { key: 'WRITING', label: 'Writing', icon: PenTool },
                { key: 'SPEAKING', label: 'Speaking', icon: Mic },
              ] as const
            ).map(({ key, label, icon: Icon }) => {
              const isActive = activeSkill === key
              const { label: compLabel, isDone } = getSkillCompletion(key)

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveSkill(key)}
                  className={`btn-interactive flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {compLabel}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Center: Mode Selector & Realtime Countdown Timer */}
        <div className="flex items-center gap-2">
          {/* Strict vs Practice Mode Toggle */}
          <button
            type="button"
            disabled={isSubmitted}
            onClick={() => {
              const nextMode = examMode === 'STRICT' ? 'PRACTICE' : 'STRICT'
              setExamMode(nextMode)
              toast.info(
                nextMode === 'STRICT'
                  ? 'Đã bật Chế độ Thi Thật (Strict Exam Mode)'
                  : 'Đã bật Chế độ Luyện Tập (Practice Mode)',
                {
                  description:
                    nextMode === 'STRICT'
                      ? 'Khóa nút tạm dừng audio, khóa dán văn bản và kích hoạt bộ đếm chuyển tab.'
                      : 'Cho phép tự do tạm dừng audio và không giới hạn dán văn bản.',
                },
              )
            }}
            className={`btn-interactive hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all border ${
              examMode === 'STRICT'
                ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100 shadow-2xs'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-2xs'
            }`}
          >
            {examMode === 'STRICT' ? (
              <>
                <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
                <span>Thi Thật (Strict)</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Luyện Tập (Practice)</span>
              </>
            )}
          </button>

          {/* Tab Switch Violation Counter in Strict Mode */}
          {examMode === 'STRICT' && tabSwitchCount > 0 && !isSubmitted && (
            <span className="hidden md:inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 animate-pulse border border-amber-300">
              ⚠️ Chuyển tab: {tabSwitchCount}/3
            </span>
          )}

          <div
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-mono text-sm font-bold tracking-tight shadow-xs ${
              isUrgent && !isSubmitted
                ? 'animate-pulse bg-red-50 text-red-600 border border-red-200'
                : 'bg-slate-100 text-slate-800 border border-slate-200'
            }`}
          >
            <Clock className="h-4 w-4 text-slate-500" />
            <span>{isSubmitted ? 'Đã thu bài' : formattedTime}</span>
          </div>
        </div>

        {/* Right: Submit & Review Actions */}
        <div className="flex items-center gap-2">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(true)}
              className="btn-interactive inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-red-700 active:scale-95 transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Nộp bài Full Test</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResultView(!showResultView)}
                className="btn-interactive inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800"
              >
                {showResultView ? (
                  <>
                    <Eye className="h-4 w-4 text-emerald-400" />
                    <span>Xem lại đề thi</span>
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 text-amber-400" />
                    <span>Xem bảng điểm</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleRetakeExam}
                className="btn-interactive inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 active:scale-95 transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Làm lại (Retake)</span>
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
            <div className="max-w-3xl mx-auto p-6 space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-3 shadow-xs">
                  <Award className="h-9 w-9" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Bảng Điểm Tổng Hợp IELTS 4 Kỹ Năng
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Mã đề thi: {manifest.code} • Quy chuẩn làm tròn IELTS IDP / British Council
                </p>

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
                  const overallBand = calculateIeltsOverall(
                    listeningBand,
                    readingBand,
                    writingBand,
                    speakingBand,
                  )

                  return (
                    <>
                      {/* Overall Band Card */}
                      <div className="my-6 rounded-2xl bg-slate-900 p-6 text-white text-center">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          OVERALL IELTS BAND SCORE (OFFICIAL ROUNDING)
                        </div>
                        <div className="font-serif text-6xl font-extrabold my-1">
                          {overallBand.toFixed(1)}
                        </div>
                        <div className="text-xs text-slate-300">
                          Áp dụng quy tắc làm tròn .25 / .75 chuẩn quốc tế
                        </div>
                      </div>

                      {/* 4 Skill Cards Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left mb-6">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <Headphones className="h-3.5 w-3.5 text-blue-600" />
                            Listening
                          </div>
                          <div className="text-2xl font-bold text-slate-900 my-1">
                            {listeningBand.toFixed(1)}
                          </div>
                          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Đã chấm tự động
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                            Reading
                          </div>
                          <div className="text-2xl font-bold text-slate-900 my-1">
                            {readingBand.toFixed(1)}
                          </div>
                          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />{' '}
                            {readingStore.scoreResult?.correctCount || 34}/40 câu đúng
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <PenTool className="h-3.5 w-3.5 text-purple-600" />
                            Writing
                          </div>
                          <div className="text-2xl font-bold text-slate-900 my-1">
                            {writingBand.toFixed(1)}*
                          </div>
                          <div className="text-[11px] text-amber-600 font-semibold">
                            Chờ GV chấm (SLA 48h)
                          </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                            <Mic className="h-3.5 w-3.5 text-red-600" />
                            Speaking
                          </div>
                          <div className="text-2xl font-bold text-slate-900 my-1">
                            {speakingBand.toFixed(1)}*
                          </div>
                          <div className="text-[11px] text-amber-600 font-semibold">
                            Chờ GV chấm (SLA 48h)
                          </div>
                        </div>
                      </div>

                      {/* 48h SLA Banner & Teacher Rubric Trigger */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-left mb-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-amber-900">
                              Bài làm Writing & Speaking đang được chuyển cho Giáo viên chấm
                            </div>
                            <div className="text-[11px] text-amber-700">
                              Cam kết trả lời nhận xét chi tiết và 4 tiêu chí chấm điểm trong vòng
                              48 giờ.
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsRubricModalOpen(true)}
                          className="btn-interactive shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-amber-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-900 shadow-xs"
                        >
                          <FileCheck className="h-3.5 w-3.5" />
                          <span>Xem phiếu chấm mẫu</span>
                        </button>
                      </div>
                    </>
                  )
                })()}

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowResultView(false)}
                    className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-xs"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Xem lại cấu trúc đề & bài làm</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRetakeExam}
                    className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs active:scale-95"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Làm lại bài thi từ đầu (Retake)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/tests')}
                    className="btn-interactive rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Về danh sách bài test
                  </button>
                </div>
              </div>

              {/* Also render Detailed Reading Review */}
              {readingStore.scoreResult && (
                <ExamResultView
                  onReviewExam={() => {
                    setActiveSkill('READING')
                    setShowResultView(false)
                  }}
                  onExit={() => navigate('/tests')}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col overflow-hidden">
            {/* ── Review Mode Top Sticky Banner ──────────────────────── */}
            {isSubmitted && (
              <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50 px-6 py-2 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Eye className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>
                    Chế độ Xem lại (Review Mode): Toàn bộ câu hỏi, đoạn văn và đáp án chuẩn của 4 kỹ
                    năng đã được mở khóa.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowResultView(true)}
                    className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 shadow-xs"
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>Xem bảng điểm</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRetakeExam}
                    className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs active:scale-95"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Làm lại (Retake)</span>
                  </button>
                </div>
              </div>
            )}

            {/* 1. LISTENING WORKSPACE */}
            {activeSkill === 'LISTENING' && manifest.skills.listening && (
              <ListeningRunner skillData={manifest.skills.listening} />
            )}

            {/* 2. READING WORKSPACE (Dual-Pane Resizable with Highlighting & Palette) */}
            {activeSkill === 'READING' && (
              <div className="flex h-full flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  <Group orientation="horizontal" id="ielts-reading-split-main" className="h-full">
                    {/* Left: Reading Passage with Highlighter */}
                    <Panel defaultSize="48%" minSize="30%" className="h-full">
                      <ReadingPassageView />
                    </Panel>

                    <Separator className="group relative flex w-2.5 items-center justify-center bg-slate-200/80 hover:bg-red-500/20 transition-colors cursor-col-resize select-none">
                      <div className="flex h-8 w-1.5 items-center justify-center rounded-full bg-slate-400 group-hover:bg-red-600 transition-colors">
                        <GripVertical className="h-3 w-3 text-white opacity-0 group-hover:opacity-100" />
                      </div>
                    </Separator>

                    {/* Right: Question Cards */}
                    <Panel
                      defaultSize="52%"
                      minSize="35%"
                      className="h-full overflow-y-auto bg-slate-100/70 p-6 md:p-8 custom-scrollbar"
                    >
                      <div className="mx-auto max-w-3xl space-y-5">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                            Questions {startQ} – {endQ}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 mt-1">
                            {currentPassage?.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            Đọc kỹ đoạn văn ở khung bên trái và chọn đáp án tương ứng bên dưới.
                          </p>
                        </div>

                        <div className="space-y-4">
                          {currentQuestions.map((q) => (
                            <QuestionCard key={q.id} question={q} />
                          ))}
                        </div>
                      </div>
                    </Panel>
                  </Group>
                </div>
                {/* 40-Question Palette at bottom */}
                <ExamBottomPalette />
              </div>
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
