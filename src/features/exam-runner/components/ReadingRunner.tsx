import React, { useState, useEffect, useRef } from 'react'
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

type SnapState = 'PEEK' | 'SPLIT' | 'FULL'

export const ReadingRunner: React.FC<ReadingRunnerProps> = () => {
  const readingStore = useIeltsExamStore()

  // Mobile viewport detection (< 768px)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768
    }
    return false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mobile Bottom Sheet State: 15% (Peek), 45% (Split), 90% (Full)
  const [snapState, setSnapState] = useState<SnapState>('SPLIT')
  const [sheetHeightPct, setSheetHeightPct] = useState<number>(45)
  const isDraggingRef = useRef<boolean>(false)
  const touchStartYRef = useRef<number>(0)
  const startHeightRef = useRef<number>(45)

  const currentPassage = readingStore.manifest.passages.find(
    (p) => p.id === readingStore.activePassageId,
  )
  const [startQ, endQ] = currentPassage ? currentPassage.questionRange : [1, 13]
  const currentQuestions = readingStore.manifest.questions.filter(
    (q) => q.id >= startQ && q.id <= endQ,
  )

  const setSnapHeight = (pct: number) => {
    setSheetHeightPct(pct)
    if (pct <= 25) setSnapState('PEEK')
    else if (pct <= 65) setSnapState('SPLIT')
    else setSnapState('FULL')
  }

  // When active question changes on mobile and sheet is in PEEK, auto expand to SPLIT
  useEffect(() => {
    if (isMobile && snapState === 'PEEK') {
      setSnapHeight(45)
    }
  }, [readingStore.activeQuestionId, isMobile, snapState])

  // Touch drag handlers for the Bottom Sheet handle
  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true
    touchStartYRef.current = e.touches[0].clientY
    startHeightRef.current = sheetHeightPct
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return
    const deltaY = touchStartYRef.current - e.touches[0].clientY
    const heightDeltaPct = (deltaY / window.innerHeight) * 100
    const newHeight = Math.max(12, Math.min(92, startHeightRef.current + heightDeltaPct))
    setSheetHeightPct(newHeight)
  }

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    // Snap to nearest state
    if (sheetHeightPct < 30) {
      setSnapHeight(15)
    } else if (sheetHeightPct <= 68) {
      setSnapHeight(45)
    } else {
      setSnapHeight(90)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {/* ── Main Workspace ──────────────────────────────────────────── */}
      {isMobile ? (
        /* Mobile Ergonomic Layout: Background Passage + Resizable Question Bottom Sheet */
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Background Layer: Full-Width Reading Passage */}
          <div className="flex-1 overflow-hidden bg-white">
            <ReadingPassageView />
          </div>

          {/* Foreground Layer: Resizable Question Bottom Sheet */}
          <div
            style={{ height: `${sheetHeightPct}%` }}
            className="absolute bottom-0 left-0 right-0 z-20 flex flex-col rounded-t-3xl border-t border-slate-300 bg-white shadow-2xl transition-[height] duration-200 ease-out"
          >
            {/* Tactile Pull Handle & Quick Snap Toolbar */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="shrink-0 pt-3 pb-2.5 px-4 cursor-grab active:cursor-grabbing border-b border-slate-200 bg-slate-50/95 rounded-t-3xl select-none"
            >
              {/* Central drag indicator bar */}
              <div className="w-12 h-1.5 rounded-full bg-slate-300 mx-auto mb-2" />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-red-100 text-[11px] font-bold text-red-700 shrink-0">
                    Q{startQ}–Q{endQ}
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate">
                    {currentPassage?.title}
                  </span>
                </div>

                {/* Quick Snap State Selector Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSnapHeight(15)}
                    className={`btn-interactive px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-colors ${
                      snapState === 'PEEK'
                        ? 'border-red-600 bg-red-600 text-white shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    15% Thu nhỏ
                  </button>
                  <button
                    type="button"
                    onClick={() => setSnapHeight(45)}
                    className={`btn-interactive px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-colors ${
                      snapState === 'SPLIT'
                        ? 'border-red-600 bg-red-600 text-white shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    45% Chia đôi
                  </button>
                  <button
                    type="button"
                    onClick={() => setSnapHeight(90)}
                    className={`btn-interactive px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-colors ${
                      snapState === 'FULL'
                        ? 'border-red-600 bg-red-600 text-white shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    90% Mở rộng
                  </button>
                </div>
              </div>
            </div>

            {/* Questions Container */}
            <div
              id="reading-questions-panel"
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
            >
              {currentQuestions.map((q) => (
                <QuestionCard key={q.id} question={q} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Dual-Pane Resizable Workspace (>= 768px) */
        <div className="flex-1 overflow-hidden">
          <Group orientation="horizontal" id="ielts-reading-split-main" className="h-full">
            {/* Left: Reading Passage with Highlighter */}
            <Panel defaultSize="48%" minSize="30%" className="h-full">
              <ReadingPassageView />
            </Panel>

            <Separator className="group relative flex w-2 items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors cursor-col-resize select-none">
              <div className="flex h-10 w-1 items-center justify-center rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors">
                <GripVertical className="h-3.5 w-3.5 text-white opacity-0 group-hover:opacity-100" />
              </div>
            </Separator>

            {/* Right: Question Cards */}
            <Panel
              defaultSize="52%"
              minSize="35%"
              className="h-full overflow-y-auto bg-white p-6 md:p-10 custom-scrollbar"
            >
              <div id="reading-questions-panel" className="mx-auto max-w-2xl space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-red-100 text-xs font-bold text-red-700 mb-2">
                    Questions {startQ} – {endQ}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{currentPassage?.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    Đọc kỹ đoạn văn ở khung bên trái và chọn đáp án tương ứng bên dưới.
                  </p>
                </div>

                <div className="space-y-5">
                  {currentQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))}
                </div>
              </div>
            </Panel>
          </Group>
        </div>
      )}

      {/* ── Reading Bottom Palette with Passage Switcher and Question Jump Pills ── */}
      <ExamBottomPalette />
    </div>
  )
}
