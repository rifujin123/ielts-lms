import React, { useState, useEffect } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import {
  FileText,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  GripVertical,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import type { WritingExamSkill } from '../types/fullExam.types'
import { useFullExamStore } from '../store/fullExamStore'
import { toast } from '@/shared/components/Toast/toastStore'

interface WritingRunnerProps {
  skillData: WritingExamSkill
}

export const WritingRunner: React.FC<WritingRunnerProps> = ({ skillData }) => {
  const [activeTaskIndex, setActiveTaskIndex] = useState<0 | 1>(0)
  const { writingSubmissions, setWritingTaskAnswer, isSubmitted, examMode } = useFullExamStore()

  // Mobile adaptive states
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })
  const [isPromptExpanded, setIsPromptExpanded] = useState<boolean>(false)
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false)
  const [keyboardOffset, setKeyboardOffset] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Listen to visualViewport on mobile to avoid keyboard occlusion of word counter
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    const vv = window.visualViewport

    const handleViewportChange = () => {
      if (!vv) return
      const offset = window.innerHeight - (vv.offsetTop + vv.height)
      setKeyboardOffset(Math.max(0, offset))
    }

    vv.addEventListener('resize', handleViewportChange)
    vv.addEventListener('scroll', handleViewportChange)
    return () => {
      vv.removeEventListener('resize', handleViewportChange)
      vv.removeEventListener('scroll', handleViewportChange)
    }
  }, [])

  const currentTask = skillData.tasks[activeTaskIndex] || skillData.tasks[0]
  const currentKey = activeTaskIndex === 0 ? 'task1' : 'task2'
  const currentText = writingSubmissions[currentKey] || ''

  // Resilient draft auto-save to localStorage every 3 seconds
  useEffect(() => {
    if (!currentText || isSubmitted) return
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(`ielts_writing_draft_${currentKey}`, currentText)
      } catch {
        // silent catch for localStorage quota limits
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [currentText, currentKey, isSubmitted])

  // Compute live word count
  const words = currentText.trim().split(/\s+/).filter(Boolean)
  const wordCount = currentText.trim() === '' ? 0 : words.length
  const isWordCountSufficient = wordCount >= currentTask.minWords

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {/* ── Main Writing Workspace ──────────────────────────────────── */}
      {isMobile ? (
        /* Mobile Ergonomic Layout: Accordion Prompt + Fullscreen Textarea */
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Mobile Top Controls Bar */}
          <div className="shrink-0 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-lg bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                Task {currentTask.taskNumber}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentTask.recommendedMinutes} phút
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Focus Mode Toggle */}
              <button
                type="button"
                onClick={() => setIsFocusMode(!isFocusMode)}
                title={isFocusMode ? 'Thoát chế độ tập trung' : 'Toàn màn hình tập trung viết'}
                className={`btn-interactive flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all border ${
                  isFocusMode
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isFocusMode ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>Thu gọn</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Tập trung</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Accordion Prompt & Visual Chart Drawer (Collapsed by default in Focus Mode) */}
          {!isFocusMode && (
            <div className="shrink-0 border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                className="btn-interactive flex w-full items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  <BarChart3 className="h-4 w-4 text-red-600 shrink-0" />
                  <span className="truncate">
                    {isPromptExpanded
                      ? 'Thu gọn đề bài & biểu đồ'
                      : 'Xem đề bài & biểu đồ minh họa'}
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                    isPromptExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Expandable Content Box */}
              {isPromptExpanded && (
                <div className="max-h-60 overflow-y-auto px-4 pb-4 space-y-4 border-t border-slate-200/60 custom-scrollbar">
                  <div className="pt-3 text-xs font-medium text-slate-700 whitespace-pre-line leading-relaxed">
                    {currentTask.prompt}
                  </div>

                  {/* Visual Chart for Task 1 */}
                  {currentTask.visualType === 'BAR_CHART' && currentTask.chartDataPoints && (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                      <span className="text-[11px] font-bold text-slate-800">
                        Renewable Electricity Production (%):
                      </span>
                      <div className="space-y-2 text-xs">
                        {currentTask.chartDataPoints.map((item) => (
                          <div key={item.category} className="space-y-1">
                            <div className="flex justify-between font-medium text-slate-600 text-[11px]">
                              <span>{item.category}</span>
                              <span>
                                {item.startYearValue}% → {item.endYearValue}%
                              </span>
                            </div>
                            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                style={{ width: `${item.endYearValue ?? 0}%` }}
                                className={`${item.colorClass || 'bg-red-600'} rounded-full`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Text Editor Area */}
          <div className="flex-1 flex flex-col p-4 bg-white relative">
            <textarea
              disabled={isSubmitted}
              value={currentText}
              onChange={(e) => setWritingTaskAnswer(currentKey, e.target.value)}
              onPaste={(e) => {
                if (examMode === 'STRICT') {
                  e.preventDefault()
                  toast.warning('Chế độ Thi Thật: Tính năng dán văn bản bị khóa', {
                    description:
                      'Vui lòng tự gõ bài viết để đảm bảo tính trung thực theo quy chế thi của trung tâm.',
                  })
                }
              }}
              placeholder="Bắt đầu viết bài luận của bạn tại đây..."
              className="flex-1 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 font-sans text-sm sm:text-base text-slate-900 leading-relaxed placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-50 custom-scrollbar transition-all pb-14"
            />

            {/* Pinned Visual Viewport Word Counter Badge (Floats right above keyboard) */}
            <div
              style={{ bottom: `${keyboardOffset + 20}px` }}
              className="absolute right-6 z-30 flex items-center gap-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-lg pointer-events-none transition-[bottom] duration-150"
            >
              <span className={isWordCountSufficient ? 'text-emerald-400' : 'text-amber-400'}>
                {wordCount} / {currentTask.minWords} từ
              </span>
              {isWordCountSufficient ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Dual-Pane Writing Workspace (>= 768px) */
        <div className="flex-1 overflow-hidden">
          <Group orientation="horizontal" id="ielts-writing-split" className="h-full">
            {/* Left Pane: Prompt & Visual Graphic */}
            <Panel
              defaultSize="45%"
              minSize="30%"
              className="h-full overflow-y-auto bg-slate-50 p-6 md:p-10 custom-scrollbar border-r border-slate-200"
            >
              <div className="max-w-xl mx-auto space-y-8">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 uppercase tracking-wider">
                    WRITING TASK {currentTask.taskNumber}
                  </span>
                  <h2 className="mt-3 text-2xl font-bold text-slate-900">{currentTask.title}</h2>
                  <div className="mt-4 rounded-xl bg-white p-5 border border-slate-200 text-sm font-medium text-slate-700 whitespace-pre-line leading-relaxed shadow-sm">
                    {currentTask.prompt}
                  </div>
                </div>

                {/* Visual Asset (For Task 1: SVG Bar Chart) */}
                {currentTask.visualType === 'BAR_CHART' && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <BarChart3 className="h-4 w-4 text-red-600" />
                        <span>Renewable Electricity Production (% of Total)</span>
                      </div>
                      <span className="text-xs text-slate-400">2010 vs 2020</span>
                    </div>

                    {/* Dynamic Bar Chart Visualization driven 100% by manifest */}
                    {currentTask.chartDataPoints && currentTask.chartDataPoints.length > 0 && (
                      <div className="space-y-4 text-sm font-sans">
                        {currentTask.chartDataPoints.map((item) => (
                          <div key={item.category} className="space-y-1.5">
                            <div className="flex justify-between font-bold text-slate-700">
                              <span>{item.category}</span>
                              <span className="text-slate-500">
                                {item.startYearValue ?? 0}% → {item.endYearValue ?? 0}%
                              </span>
                            </div>
                            <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                style={{ width: `${item.endYearValue ?? 0}%` }}
                                className={`${item.colorClass || 'bg-red-600'} rounded-full transition-all duration-500`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                        Năm 2010
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                        Năm 2020 (Tăng trưởng)
                      </span>
                    </div>
                  </div>
                )}

                {/* Sample Model Answer (Visible if submitted) */}
                {isSubmitted && currentTask.sampleModelAnswer && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-800 mb-3">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                      <span>Bài viết mẫu tham khảo (Band 8.5+ Model Answer)</span>
                    </div>
                    <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                      {currentTask.sampleModelAnswer}
                    </div>
                  </div>
                )}
              </div>
            </Panel>

            {/* Draggable Divider */}
            <Separator className="group relative flex w-2 items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors cursor-col-resize select-none">
              <div className="flex h-10 w-1 items-center justify-center rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors">
                <GripVertical className="h-3.5 w-3.5 text-white opacity-0 group-hover:opacity-100" />
              </div>
            </Separator>

            {/* Right Pane: Essay Text Editor */}
            <Panel defaultSize="55%" minSize="35%" className="h-full flex flex-col bg-white p-8">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <span className="text-sm font-bold text-slate-800">
                  Khung soạn thảo bài viết — IELTS Writing Task {currentTask.taskNumber}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Tự động lưu bản nháp theo thời gian thực
                </span>
              </div>

              <textarea
                disabled={isSubmitted}
                value={currentText}
                onChange={(e) => setWritingTaskAnswer(currentKey, e.target.value)}
                onPaste={(e) => {
                  if (examMode === 'STRICT') {
                    e.preventDefault()
                    toast.warning('Chế độ Thi Thật: Tính năng dán văn bản bị khóa', {
                      description:
                        'Vui lòng tự gõ bài viết để đảm bảo tính trung thực theo quy chế thi của trung tâm.',
                    })
                  }
                }}
                placeholder="Bắt đầu viết bài luận của bạn tại đây..."
                className="flex-1 w-full resize-none rounded-xl border border-slate-200 bg-white p-6 font-sans text-base text-slate-900 leading-relaxed placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-50 custom-scrollbar transition-all"
              />
            </Panel>
          </Group>
        </div>
      )}

      {/* ── Signature DOL Bottom Navigation Bar (Matches Listening & Reading Pattern) ── */}
      <footer className="sticky bottom-0 z-30 shrink-0 border-t border-slate-200 bg-white shadow-lg select-none">
        <div className="relative flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
          {/* Left: Task Indicator & Live Word Count Status */}
          <div className="flex flex-1 items-center justify-start gap-3 min-w-0">
            <div className="hidden sm:flex flex-col shrink-0">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Writing Task {currentTask.taskNumber}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {currentTask.recommendedMinutes} phút đề xuất
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border transition-colors shrink-0 ${
                isWordCountSufficient
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {isWordCountSufficient ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600" />
              )}
              <span>
                {wordCount} từ (
                {isWordCountSufficient ? 'Đạt yêu cầu' : `Tối thiểu ${currentTask.minWords} từ`})
              </span>
            </div>
          </div>

          {/* Center: 2 Task Switcher Pills (Task 1, Task 2) ─────────── */}
          <div className="flex items-center justify-center min-w-0 px-1 md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2">
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-2xs overflow-x-auto custom-scrollbar">
              {skillData.tasks.map((task, idx) => {
                const isActive = activeTaskIndex === idx
                const taskKey = idx === 0 ? 'task1' : 'task2'
                const text = writingSubmissions[taskKey] || ''
                const count =
                  text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(Boolean).length
                const isDone = count >= task.minWords

                return (
                  <button
                    key={task.taskNumber}
                    type="button"
                    onClick={() => setActiveTaskIndex(idx as 0 | 1)}
                    className={`btn-interactive flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${
                      isActive
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Task {task.taskNumber}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}/{task.minWords} từ
                    </span>
                    {isDone && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Prev/Next Task Navigation Buttons ──────────────── */}
          <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setActiveTaskIndex(0)}
              disabled={activeTaskIndex === 0}
              className="btn-interactive flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Task 1</span>
            </button>

            {activeTaskIndex === 0 ? (
              <button
                type="button"
                onClick={() => setActiveTaskIndex(1)}
                className="btn-interactive flex h-9 items-center gap-1.5 rounded-xl bg-red-600 px-3.5 sm:px-4 text-xs font-bold text-white hover:bg-red-700 shadow-xs active:scale-95 transition-all"
              >
                <span>Task 2</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled
                className="btn-interactive flex h-9 items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 sm:px-3 text-xs font-bold text-slate-700 opacity-40 cursor-not-allowed shadow-2xs"
              >
                <span className="hidden sm:inline">Hết bài</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
