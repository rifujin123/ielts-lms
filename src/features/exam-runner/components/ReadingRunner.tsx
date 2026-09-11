import React from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import { GripVertical } from 'lucide-react'
import { useIeltsExamStore } from '../store/ieltsExamStore'
import { ReadingPassageView } from './ReadingPassageView'
import { QuestionCard } from './QuestionCard'
import { ExamBottomPalette } from './ExamBottomPalette'
import type { ReadingExamSkill } from '../types/fullExam.types'

interface ReadingRunnerProps {
  skillData?: ReadingExamSkill
}

export const ReadingRunner: React.FC<ReadingRunnerProps> = () => {
  const readingStore = useIeltsExamStore()

  const currentPassage = readingStore.manifest.passages.find(
    (p) => p.id === readingStore.activePassageId,
  )
  const [startQ, endQ] = currentPassage ? currentPassage.questionRange : [1, 13]
  const currentQuestions = readingStore.manifest.questions.filter(
    (q) => q.id >= startQ && q.id <= endQ,
  )

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-100">
      {/* ── Main Dual-Pane Resizable Workspace (Full Viewport Height) ── */}
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
            <div id="reading-questions-panel" className="mx-auto max-w-3xl space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                  Questions {startQ} – {endQ}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{currentPassage?.title}</h3>
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

      {/* ── Reading Bottom Palette with Passage Switcher and Question Jump Pills ── */}
      <ExamBottomPalette />
    </div>
  )
}
