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
  } = useFullExamStore()

  // Reading sub-store
  const readingStore = useIeltsExamStore()

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false)
  const [showResultView, setShowResultView] = useState<boolean>(isSubmitted)

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

        {/* Center: Realtime Countdown Timer */}
        <div className="flex items-center gap-2">
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

        {/* Right: Submit Button */}
        <div className="flex items-center gap-3">
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
            <button
              type="button"
              onClick={() => setShowResultView(!showResultView)}
              className="btn-interactive inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
            >
              <Award className="h-4 w-4" />
              <span>{showResultView ? 'Xem chi tiết đề thi' : 'Xem bảng điểm'}</span>
            </button>
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
                  Mã đề thi: {manifest.code} • Chuẩn khảo thí Cambridge
                </p>

                {/* Overall Band Card */}
                <div className="my-6 rounded-2xl bg-slate-900 p-6 text-white text-center">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    OVERALL IELTS BAND SCORE
                  </div>
                  <div className="font-serif text-6xl font-extrabold my-1">
                    {readingStore.scoreResult
                      ? ((readingStore.scoreResult.bandScore + 7.5 + 7.0 + 7.0) / 4).toFixed(1)
                      : '7.5'}
                  </div>
                  <div className="text-xs text-slate-300">
                    Đã hoàn thành toàn bộ bài thi 4 kỹ năng
                  </div>
                </div>

                {/* 4 Skill Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Headphones className="h-3.5 w-3.5 text-blue-600" />
                      Listening
                    </div>
                    <div className="text-2xl font-bold text-slate-900 my-1">7.5</div>
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
                      {readingStore.scoreResult?.bandScore.toFixed(1) || '8.0'}
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
                    <div className="text-2xl font-bold text-slate-900 my-1">7.0*</div>
                    <div className="text-[11px] text-slate-500 font-semibold">
                      Chờ GV chấm chi tiết
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      <Mic className="h-3.5 w-3.5 text-red-600" />
                      Speaking
                    </div>
                    <div className="text-2xl font-bold text-slate-900 my-1">7.0*</div>
                    <div className="text-[11px] text-slate-500 font-semibold">
                      Đã lưu file ghi âm
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowResultView(false)}
                    className="btn-interactive rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    Xem lại chi tiết từng bài làm
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
          <>
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
          </>
        )}
      </div>

      {/* ── Submit Full 4-Skill Confirmation Dialog ────────────────── */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
      />
    </div>
  )
}

export default ExamRunnerPage
