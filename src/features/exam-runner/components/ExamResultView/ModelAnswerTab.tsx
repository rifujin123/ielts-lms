import React, { useState } from 'react'
import {
  Award,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  HelpCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react'
import { mockModelAnswers, type ModelAnswerData } from '../../data/mockTeacherRubric'

export interface ModelAnswerTabProps {
  initialTask?: 1 | 2
  modelAnswers?: Record<'task1' | 'task2', ModelAnswerData>
}

export const ModelAnswerTab: React.FC<ModelAnswerTabProps> = ({
  initialTask = 1,
  modelAnswers = mockModelAnswers,
}) => {
  const [activeTask, setActiveTask] = useState<1 | 2>(initialTask)
  const [expandedSectionKey, setExpandedSectionKey] = useState<string | null>('intro')
  const [copiedCollocation, setCopiedCollocation] = useState<string | null>(null)
  const [selectedVocabPhrase, setSelectedVocabPhrase] = useState<string | null>(null)

  const currentModel: ModelAnswerData = activeTask === 1 ? modelAnswers.task1 : modelAnswers.task2

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedCollocation(text)
    setTimeout(() => setCopiedCollocation(null), 2000)
  }

  const toggleSection = (key: string) => {
    setExpandedSectionKey((prev) => (prev === key ? null : key))
  }

  return (
    <div className="w-full space-y-6">
      {/* ── Top Header & Task Switcher ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-2xs">
            <Award className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                {currentModel.targetBand}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Chuẩn giám khảo Cambridge ESOL
              </span>
            </div>
            <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
              Bài Mẫu Band 8.5+ & Phân Tích Cấu Trúc (Model Answer & Structure)
            </h2>
          </div>
        </div>

        {/* Task Switcher Buttons (0px Shift) */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTask(1)
              setExpandedSectionKey('intro')
              setSelectedVocabPhrase(null)
            }}
            className={`btn-interactive flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 border ${
              activeTask === 1
                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Task 1 (Report)</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTask === 1 ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              8.5+
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTask(2)
              setExpandedSectionKey('intro')
              setSelectedVocabPhrase(null)
            }}
            className={`btn-interactive flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 border ${
              activeTask === 2
                ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Task 2 (Essay)</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                activeTask === 2 ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              8.5+
            </span>
          </button>
        </div>
      </div>

      {/* ── Examiner Breakdown Rationale ─────────────────────────────── */}
      <div className="flex items-start gap-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4.5 text-xs text-amber-950">
        <Lightbulb className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" strokeWidth={1.75} />
        <div className="flex-1">
          <span className="font-bold text-amber-900 block mb-0.5">
            Phân tích phương pháp chấm điểm của Giám khảo (Examiner Rationale):
          </span>
          <p className="leading-relaxed text-amber-900/90">{currentModel.examinerAnalysis}</p>
        </div>
      </div>

      {/* ── Main Two-Column Layout ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Full Model Answer Text */}
        <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-slate-700" strokeWidth={1.75} />
              <h3 className="text-sm font-bold text-slate-900">
                Toàn văn bài mẫu (Full Band 8.5 Model Essay)
              </h3>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
              {currentModel.wordCount} từ
            </span>
          </div>

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-800">
            {currentModel.fullEssay.split('\n\n').map((para, idx) => (
              <p key={idx} className="text-justify font-serif">
                {para}
              </p>
            ))}
          </div>

          {/* Quick Copy Whole Essay Action */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Nguồn: Đề mẫu bản quyền Cambridge IELTS</span>
            <button
              type="button"
              onClick={() => handleCopy(currentModel.fullEssay)}
              className="btn-interactive inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              {copiedCollocation === currentModel.fullEssay ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã sao chép toàn bài</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Sao chép toàn bộ bài</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Structural Breakdown & Key Collocations */}
        <div className="lg:col-span-6 space-y-6">
          {/* Structural Accordion Sections */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600" strokeWidth={1.75} />
                Phân tích dàn ý từng đoạn (Structural Breakdown)
              </h3>
              <span className="text-[11px] text-slate-400">Nhấp để mở rộng</span>
            </div>

            <div className="space-y-3">
              {currentModel.structureSections.map((section) => {
                const isExpanded = expandedSectionKey === section.sectionKey
                return (
                  <div
                    key={section.sectionKey}
                    className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.sectionKey)}
                      className="btn-interactive w-full flex items-center justify-between p-3.5 text-left bg-slate-50/70 hover:bg-slate-100/70"
                    >
                      <span className="text-xs font-bold text-slate-900">{section.title}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 space-y-3 bg-white border-t border-slate-100 animate-fade-in-up">
                        {/* Section Text Snippet */}
                        <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs leading-relaxed text-slate-800 font-serif">
                          {section.content}
                        </div>

                        {/* Band Notes */}
                        <div className="rounded-xl border-l-4 border-l-purple-500 bg-purple-50/50 p-3 text-xs text-purple-950">
                          <strong className="text-purple-900 block mb-0.5">
                            Điểm cộng tiêu chí (Examiner Rubric Notes):
                          </strong>
                          <p className="leading-relaxed">{section.bandNotes}</p>
                        </div>

                        {/* Key vocabulary pills in this section */}
                        {section.highlightedVocab.length > 0 && (
                          <div className="pt-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                              Cụm từ then chốt trong đoạn:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {section.highlightedVocab.map((item, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setSelectedVocabPhrase(item.phrase)}
                                  className={`btn-interactive inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all duration-150 ${
                                    selectedVocabPhrase === item.phrase
                                      ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-2xs'
                                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>{item.phrase}</span>
                                  <span className="rounded-sm bg-purple-100 px-1 py-0.2 text-[10px] font-bold text-purple-800">
                                    Band {item.bandLevel}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Key Collocations Card Grid */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-600" strokeWidth={1.75} />
                <h3 className="text-sm font-bold text-slate-900">
                  Cụm Collocation & Thành Ngữ Ăn Điểm (Key Academic Collocations)
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-400">
                {currentModel.keyCollocations.length} cụm từ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentModel.keyCollocations.map((colloc, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 flex flex-col justify-between hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 rounded-md px-1.5 py-0.5">
                        {colloc.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(colloc.collocation)}
                        title="Sao chép cụm từ"
                        className="btn-interactive text-slate-400 hover:text-slate-700"
                      >
                        {copiedCollocation === colloc.collocation ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900">{colloc.collocation}</h4>
                    <p className="mt-1 text-[11px] font-medium text-emerald-700">
                      {colloc.vietnameseMeaning}
                    </p>
                  </div>

                  <p className="mt-2 text-[10px] text-slate-500 italic border-t border-slate-200/60 pt-1.5">
                    {colloc.definition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
