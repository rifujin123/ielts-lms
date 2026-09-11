import React, { useState } from 'react'
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

  const currentTask = skillData.tasks[activeTaskIndex] || skillData.tasks[0]
  const currentKey = activeTaskIndex === 0 ? 'task1' : 'task2'
  const currentText = writingSubmissions[currentKey] || ''

  // Compute live word count
  const words = currentText.trim().split(/\s+/).filter(Boolean)
  const wordCount = currentText.trim() === '' ? 0 : words.length
  const isWordCountSufficient = wordCount >= currentTask.minWords

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-100">
      {/* ── Main Dual-Pane Writing Workspace ──────────────────────── */}
      <div className="flex-1 overflow-hidden">
        <Group orientation="horizontal" id="ielts-writing-split" className="h-full">
          {/* Left Pane: Prompt & Visual Graphic */}
          <Panel
            defaultSize="45%"
            minSize="30%"
            className="h-full overflow-y-auto bg-slate-50/80 p-6 md:p-8 custom-scrollbar border-r border-slate-200"
          >
            <div className="max-w-xl mx-auto space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 uppercase tracking-wider">
                  WRITING TASK {currentTask.taskNumber}
                </span>
                <h2 className="mt-2 text-xl font-bold text-slate-900">{currentTask.title}</h2>
                <div className="mt-2 rounded-xl bg-white p-4 border border-slate-200 text-xs font-medium text-slate-700 whitespace-pre-line leading-relaxed shadow-xs">
                  {currentTask.prompt}
                </div>
              </div>

              {/* Visual Asset (For Task 1: SVG Bar Chart) */}
              {currentTask.visualType === 'BAR_CHART' && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <BarChart3 className="h-4 w-4 text-red-600" />
                      <span>Renewable Electricity Production (% of Total)</span>
                    </div>
                    <span className="text-[11px] text-slate-400">2010 vs 2020</span>
                  </div>

                  {/* Dynamic Bar Chart Visualization driven 100% by manifest */}
                  {currentTask.chartDataPoints && currentTask.chartDataPoints.length > 0 && (
                    <div className="space-y-4 text-xs font-sans">
                      {currentTask.chartDataPoints.map((item) => (
                        <div key={item.category} className="space-y-1">
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

                  <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-300" />
                      Năm 2010
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Năm 2020 (Tăng trưởng)
                    </span>
                  </div>
                </div>
              )}

              {/* Sample Model Answer (Visible if submitted) */}
              {isSubmitted && currentTask.sampleModelAnswer && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-2">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    <span>Bài viết mẫu tham khảo (Band 8.5+ Model Answer)</span>
                  </div>
                  <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                    {currentTask.sampleModelAnswer}
                  </div>
                </div>
              )}
            </div>
          </Panel>

          {/* Draggable Divider */}
          <Separator className="group relative flex w-2.5 items-center justify-center bg-slate-200/80 hover:bg-red-500/20 transition-colors cursor-col-resize select-none">
            <div className="flex h-8 w-1.5 items-center justify-center rounded-full bg-slate-400 group-hover:bg-red-600 transition-colors">
              <GripVertical className="h-3 w-3 text-white opacity-0 group-hover:opacity-100" />
            </div>
          </Separator>

          {/* Right Pane: Essay Text Editor */}
          <Panel defaultSize="55%" minSize="35%" className="h-full flex flex-col bg-white p-6">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800">
                Khung soạn thảo bài viết — IELTS Writing Task {currentTask.taskNumber}
              </span>
              <span className="text-[11px] font-medium text-slate-400">
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
              className="flex-1 w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 p-5 font-sans text-sm text-slate-900 leading-relaxed placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 custom-scrollbar transition-colors"
            />
          </Panel>
        </Group>
      </div>

      {/* ── Signature DOL Bottom Navigation Bar (Matches Listening & Reading Pattern) ── */}
      <footer className="sticky bottom-0 z-30 shrink-0 border-t border-slate-200 bg-white shadow-lg select-none">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5">
          {/* Left: Task Indicator & Live Word Count Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                Writing Task {currentTask.taskNumber}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {currentTask.recommendedMinutes} phút đề xuất
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold border transition-colors ${
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
          <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
            {skillData.tasks.map((task, idx) => {
              const isActive = activeTaskIndex === idx
              const taskKey = idx === 0 ? 'task1' : 'task2'
              const text = writingSubmissions[taskKey] || ''
              const count = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(Boolean).length
              const isDone = count >= task.minWords

              return (
                <button
                  key={task.taskNumber}
                  type="button"
                  onClick={() => setActiveTaskIndex(idx as 0 | 1)}
                  className={`btn-interactive flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all border ${
                    isActive
                      ? 'border-red-200 bg-red-50/80 text-red-600 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Task {task.taskNumber}</span>
                  <span
                    className={isActive ? 'text-red-300 font-normal' : 'text-slate-300 font-normal'}
                  >
                    |
                  </span>
                  <span
                    className={`text-[11px] font-mono ${
                      isDone
                        ? 'text-emerald-600 font-bold'
                        : isActive
                          ? 'text-red-600 font-bold'
                          : 'text-slate-500 font-medium'
                    }`}
                  >
                    {count}/{task.minWords} từ
                  </span>
                  {isDone && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                </button>
              )
            })}
          </div>

          {/* Right: Prev/Next Task Navigation Buttons ──────────────── */}
          <div className="flex items-center gap-2 shrink-0">
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
