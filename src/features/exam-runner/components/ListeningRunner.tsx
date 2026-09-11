import React, { useState } from 'react'
import { Volume2, VolumeX, Play, Pause, Headphones, Flag, CheckCircle2 } from 'lucide-react'
import type { ListeningExamSkill } from '../types/fullExam.types'
import { useFullExamStore } from '../store/fullExamStore'

interface ListeningRunnerProps {
  skillData: ListeningExamSkill
}

export const ListeningRunner: React.FC<ListeningRunnerProps> = ({ skillData }) => {
  const {
    activeSectionIndex,
    setActiveSectionIndex,
    listeningAnswers,
    setListeningAnswer,
    flaggedQuestions,
    toggleFlag,
    isSubmitted,
    examMode,
  } = useFullExamStore()

  // Audio simulator state
  const [isPlaying, setIsPlaying] = useState<boolean>(examMode === 'STRICT')
  const [volume, setVolume] = useState<number>(80)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  const currentSection = skillData.sections[activeSectionIndex] || skillData.sections[0]
  const [startQ, endQ] = currentSection.questionRange

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-slate-100 p-6 md:p-8 custom-scrollbar">
      <div className="mx-auto max-w-3xl space-y-5">
        {/* ── Section Navigation Tabs ───────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {skillData.sections.map((sec, idx) => {
            const isActive = activeSectionIndex === idx
            const [s, e] = sec.questionRange
            let answeredCount = 0
            for (let i = s; i <= e; i++) {
              if (listeningAnswers[i] && listeningAnswers[i].trim() !== '') {
                answeredCount++
              }
            }
            const totalInSec = e - s + 1

            return (
              <button
                key={sec.sectionNumber}
                type="button"
                onClick={() => setActiveSectionIndex(idx)}
                className={`btn-interactive flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all border ${
                  isActive
                    ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Section {sec.sectionNumber}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {answeredCount}/{totalInSec}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Integrated Section Header Card with Audio Player ───────── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-red-600">
                <Headphones className="h-3.5 w-3.5" />
                <span>
                  Questions {startQ} – {endQ}
                </span>
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">{currentSection.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{currentSection.scenario}</p>
            </div>

            {/* Audio Controls Embedded Inside the Section Card */}
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2 border border-slate-200/80 self-start sm:self-auto shadow-2xs">
              {examMode === 'STRICT' ? (
                <div className="flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-bold text-white shadow-xs select-none">
                  <Headphones className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                  <span>Phát liên tục (Thi thật)</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn-interactive flex h-9 items-center gap-1.5 rounded-lg bg-red-600 px-3.5 text-xs font-bold text-white hover:bg-red-700 shadow-xs active:scale-95 transition-all"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-3.5 w-3.5" /> <span>Tạm dừng</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-3.5 w-3.5" /> <span>Phát Audio</span>
                    </>
                  )}
                </button>
              )}

              <div className="flex items-center gap-2 pr-1">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                  className="text-slate-500 hover:text-slate-800"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-red-500" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value))
                    setIsMuted(false)
                  }}
                  aria-label="Điều chỉnh âm lượng"
                  className="h-1.5 w-16 sm:w-20 cursor-pointer accent-red-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions Renderers */}
        <div className="space-y-4">
          {currentSection.questions.map((q) => {
            const currentAns = listeningAnswers[q.id] || ''
            const isFlagged = !!flaggedQuestions[`LISTENING_${q.id}`]

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                      {q.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase">
                      {q.type.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFlag('LISTENING', q.id)}
                    className={`btn-interactive flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      isFlagged
                        ? 'bg-amber-100 text-amber-800'
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Flag
                      className={`h-3.5 w-3.5 ${isFlagged ? 'fill-amber-500 text-amber-600' : ''}`}
                    />
                    <span>{isFlagged ? 'Đã đánh dấu' : 'Xem lại'}</span>
                  </button>
                </div>

                {q.instruction && (
                  <p className="mb-3 text-xs italic text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {q.instruction}
                  </p>
                )}

                <div className="text-sm font-medium text-slate-800 mb-4">{q.prompt}</div>

                {/* Input controls based on question type */}
                {q.type === 'MULTIPLE_CHOICE' && q.options ? (
                  <div className="flex flex-col gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => setListeningAnswer(q.id, opt.key)}
                        className={`btn-interactive flex items-start gap-3 rounded-xl p-3 text-left border ${
                          currentAns === opt.key
                            ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900/10'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            currentAns === opt.key
                              ? 'bg-slate-900 text-white'
                              : 'border border-slate-300 text-slate-600'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <span className="text-xs font-medium pt-0.5 leading-relaxed">
                          {opt.text}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={currentAns}
                    onChange={(e) => setListeningAnswer(q.id, e.target.value)}
                    placeholder="Nhập đáp án bạn nghe được..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:border-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 transition-colors"
                  />
                )}

                {/* Review Mode details */}
                {isSubmitted && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs border border-slate-200">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>
                        Đáp án đúng: <strong className="text-emerald-700">{q.correctAnswer}</strong>
                      </span>
                    </div>
                    <p className="text-slate-600">{q.explanation}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
