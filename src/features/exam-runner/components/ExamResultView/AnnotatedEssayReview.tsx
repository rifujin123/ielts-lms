import React, { useState, useMemo } from 'react'
import {
  AlertCircle,
  Sparkles,
  BookmarkCheck,
  Check,
  Copy,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  MessageSquare,
  TrendingUp,
  FileText,
  Award,
} from 'lucide-react'
import {
  mockStudentSubmissions,
  type EssayAnnotation,
  type AnnotationCategory,
  type StudentEssaySubmission,
} from '../../data/mockTeacherRubric'

export interface AnnotatedEssayReviewProps {
  initialTask?: 1 | 2
  studentSubmissions?: Record<'task1' | 'task2', StudentEssaySubmission>
}

const CATEGORY_CONFIG: Record<
  AnnotationCategory,
  {
    label: string
    shortLabel: string
    highlightClass: string
    badgeClass: string
    icon: typeof AlertCircle
    accentBorder: string
  }
> = {
  GRAMMAR: {
    label: 'Ngữ pháp (Grammar)',
    shortLabel: 'Ngữ pháp',
    highlightClass:
      'bg-rose-100 text-rose-900 border-b-2 border-rose-500 cursor-pointer transition-all duration-150 rounded-sm px-1 py-0.5',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: AlertCircle,
    accentBorder: 'border-l-rose-500',
  },
  LEXICAL: {
    label: 'Từ vựng & Collocation (Lexical)',
    shortLabel: 'Từ vựng',
    highlightClass:
      'bg-amber-100 text-amber-900 border-b-2 border-amber-500 cursor-pointer transition-all duration-150 rounded-sm px-1 py-0.5',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: TrendingUp,
    accentBorder: 'border-l-amber-500',
  },
  COHERENCE: {
    label: 'Mạch lạc & Liên từ (Coherence)',
    shortLabel: 'Mạch lạc',
    highlightClass:
      'bg-sky-100 text-sky-900 border-b-2 border-sky-500 cursor-pointer transition-all duration-150 rounded-sm px-1 py-0.5',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: BookmarkCheck,
    accentBorder: 'border-l-sky-500',
  },
  KUDOS: {
    label: 'Điểm sáng bài viết (Teacher Kudos)',
    shortLabel: 'Lời khen',
    highlightClass:
      'bg-emerald-100 text-emerald-900 border-b-2 border-emerald-500 cursor-pointer transition-all duration-150 rounded-sm px-1 py-0.5',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Sparkles,
    accentBorder: 'border-l-emerald-500',
  },
}

interface TextChunk {
  text: string
  annotation?: EssayAnnotation
}

function parseParagraphSegments(paragraph: string, annotations: EssayAnnotation[]): TextChunk[] {
  interface Match {
    start: number
    end: number
    annotation: EssayAnnotation
  }
  const matches: Match[] = []

  for (const ann of annotations) {
    if (!ann.originalText) continue
    let idx = paragraph.indexOf(ann.originalText)
    while (idx !== -1) {
      matches.push({
        start: idx,
        end: idx + ann.originalText.length,
        annotation: ann,
      })
      if (ann.originalText.length === 0) break
      idx = paragraph.indexOf(ann.originalText, idx + ann.originalText.length)
    }
  }

  if (matches.length === 0) {
    return [{ text: paragraph }]
  }

  matches.sort((a, b) => a.start - b.start)

  const nonOverlapping: Match[] = []
  let lastEnd = 0
  for (const m of matches) {
    if (m.start >= lastEnd) {
      nonOverlapping.push(m)
      lastEnd = m.end
    }
  }

  const chunks: TextChunk[] = []
  let cursor = 0
  for (const m of nonOverlapping) {
    if (m.start > cursor) {
      chunks.push({ text: paragraph.slice(cursor, m.start) })
    }
    chunks.push({ text: paragraph.slice(m.start, m.end), annotation: m.annotation })
    cursor = m.end
  }
  if (cursor < paragraph.length) {
    chunks.push({ text: paragraph.slice(cursor) })
  }
  return chunks
}

export const AnnotatedEssayReview: React.FC<AnnotatedEssayReviewProps> = ({
  initialTask = 1,
  studentSubmissions = mockStudentSubmissions,
}) => {
  const [activeTask, setActiveTask] = useState<1 | 2>(initialTask)
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<AnnotationCategory | 'ALL'>('ALL')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const currentSubmission: StudentEssaySubmission =
    activeTask === 1 ? studentSubmissions.task1 : studentSubmissions.task2

  // Filtered annotations list
  const filteredAnnotations = useMemo(() => {
    if (categoryFilter === 'ALL') return currentSubmission.annotations
    return currentSubmission.annotations.filter((a) => a.category === categoryFilter)
  }, [currentSubmission.annotations, categoryFilter])

  // Currently active annotation object
  const activeAnnotation = useMemo(() => {
    if (!selectedAnnotationId) return currentSubmission.annotations[0] || null
    return currentSubmission.annotations.find((a) => a.id === selectedAnnotationId) || null
  }, [currentSubmission.annotations, selectedAnnotationId])

  // Navigate between annotations
  const activeAnnotationIndex = useMemo(() => {
    if (!activeAnnotation) return -1
    return filteredAnnotations.findIndex((a) => a.id === activeAnnotation.id)
  }, [filteredAnnotations, activeAnnotation])

  const handlePrevAnnotation = () => {
    if (filteredAnnotations.length === 0) return
    const prevIdx =
      (activeAnnotationIndex - 1 + filteredAnnotations.length) % filteredAnnotations.length
    setSelectedAnnotationId(filteredAnnotations[prevIdx].id)
  }

  const handleNextAnnotation = () => {
    if (filteredAnnotations.length === 0) return
    const nextIdx = (activeAnnotationIndex + 1) % filteredAnnotations.length
    setSelectedAnnotationId(filteredAnnotations[nextIdx].id)
  }

  const handleCopyRewrite = (text: string, id: string) => {
    if (!text) return
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Split essay into paragraphs
  const paragraphs = useMemo(() => {
    return currentSubmission.essayText.split('\n\n').filter(Boolean)
  }, [currentSubmission.essayText])

  return (
    <div className="w-full space-y-6">
      {/* ── Top Header & Task Switcher ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-2xs">
            <GraduationCap className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-bold text-purple-800">
                Chấm điểm chi tiết bởi Giám khảo Hồ Thành
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Nộp lúc: {currentSubmission.submittedAt}
              </span>
            </div>
            <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900">
              Đối Soát Bài Viết & Nhận Xét 4 Màu (Annotated Essay Review)
            </h2>
          </div>
        </div>

        {/* Task 1 / Task 2 Pill Buttons (0px Shift) */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveTask(1)
              setSelectedAnnotationId(null)
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
              Band {studentSubmissions.task1.bandScore.toFixed(1)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTask(2)
              setSelectedAnnotationId(null)
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
              Band {studentSubmissions.task2.bandScore.toFixed(1)}
            </span>
          </button>
        </div>
      </div>

      {/* ── 4 Cambridge Criteria Scorecard ───────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {currentSubmission.criteriaScores.criterion1Name}
            </span>
            <Award className="h-4 w-4 text-purple-600" strokeWidth={1.75} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentSubmission.criteriaScores.criterion1Score.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 9.0</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-purple-600 transition-all duration-500"
              style={{
                width: `${(currentSubmission.criteriaScores.criterion1Score / 9) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Coherence & Cohesion
            </span>
            <BookmarkCheck className="h-4 w-4 text-sky-600" strokeWidth={1.75} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentSubmission.criteriaScores.coherenceCohesion.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 9.0</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-sky-600 transition-all duration-500"
              style={{
                width: `${(currentSubmission.criteriaScores.coherenceCohesion / 9) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Lexical Resource
            </span>
            <TrendingUp className="h-4 w-4 text-amber-600" strokeWidth={1.75} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentSubmission.criteriaScores.lexicalResource.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 9.0</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-amber-600 transition-all duration-500"
              style={{
                width: `${(currentSubmission.criteriaScores.lexicalResource / 9) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Grammar & Accuracy
            </span>
            <AlertCircle className="h-4 w-4 text-rose-600" strokeWidth={1.75} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentSubmission.criteriaScores.grammaticalRangeAccuracy.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 9.0</span>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-rose-600 transition-all duration-500"
              style={{
                width: `${(currentSubmission.criteriaScores.grammaticalRangeAccuracy / 9) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Teacher Overall Comment Banner ────────────────────────── */}
      <div className="flex items-start gap-3.5 rounded-2xl border border-purple-200 bg-purple-50/70 p-4.5 text-xs text-purple-950">
        <MessageSquare className="h-5 w-5 text-purple-700 shrink-0 mt-0.5" strokeWidth={1.75} />
        <div className="flex-1">
          <span className="font-bold text-purple-900 block mb-0.5">
            Nhận xét chung của Giáo viên (Executive Examiner Summary):
          </span>
          <p className="leading-relaxed text-purple-900/90">{currentSubmission.teacherSummary}</p>
        </div>
      </div>

      {/* ── Interactive 4-Color Annotation Filter & Legend Bar ────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Bộ lọc nhận xét:</span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCategoryFilter('ALL')}
              className={`btn-interactive rounded-lg px-2.5 py-1 text-xs font-bold transition-all duration-150 border ${
                categoryFilter === 'ALL'
                  ? 'border-slate-800 bg-slate-800 text-white shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả ({currentSubmission.annotations.length})
            </button>

            {(['GRAMMAR', 'LEXICAL', 'COHERENCE', 'KUDOS'] as AnnotationCategory[]).map((cat) => {
              const config = CATEGORY_CONFIG[cat]
              const count = currentSubmission.annotations.filter((a) => a.category === cat).length
              const isActive = categoryFilter === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`btn-interactive flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all duration-150 border ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      cat === 'GRAMMAR'
                        ? 'bg-rose-500'
                        : cat === 'LEXICAL'
                          ? 'bg-amber-500'
                          : cat === 'COHERENCE'
                            ? 'bg-sky-500'
                            : 'bg-emerald-500'
                    }`}
                  />
                  <span>{config.shortLabel}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Word count badge */}
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <span>Độ dài bài viết:</span>
          <strong className="text-slate-900">{currentSubmission.wordCount} từ</strong>
        </div>
      </div>

      {/* ── Main Two-Column Layout: Essay View + Inspector Panel ──── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Essay Content with 4-Color Inline Highlights */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Văn bản bài nộp (Nhấp vào đoạn highlight để xem gợi ý sửa)
            </h3>
            <span className="text-[11px] text-slate-400">Nhấp hoặc di chuột vào chữ màu</span>
          </div>

          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-800 font-normal">
            {paragraphs.map((paragraph, pIdx) => {
              const segments = parseParagraphSegments(paragraph, currentSubmission.annotations)
              return (
                <p key={pIdx} className="indent-0">
                  {segments.map((segment, sIdx) => {
                    if (!segment.annotation) {
                      return <span key={sIdx}>{segment.text}</span>
                    }

                    const ann = segment.annotation
                    const config = CATEGORY_CONFIG[ann.category]
                    const isSelected = activeAnnotation?.id === ann.id

                    return (
                      <span
                        key={sIdx}
                        onClick={() => setSelectedAnnotationId(ann.id)}
                        title={`[${config.shortLabel}] ${ann.teacherComment}`}
                        className={`${config.highlightClass} ${
                          isSelected ? 'ring-2 ring-offset-1 ring-slate-900 font-semibold' : ''
                        }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setSelectedAnnotationId(ann.id)
                          }
                        }}
                      >
                        {segment.text}
                      </span>
                    )
                  })}
                </p>
              )
            })}
          </div>
        </div>

        {/* Right Column: Selected Annotation Inspector & Rewrite Box */}
        <div className="lg:col-span-5 space-y-4 sticky top-6">
          {activeAnnotation ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-md transition-all duration-200">
              {/* Card Header with Category & Navigation */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                      CATEGORY_CONFIG[activeAnnotation.category].badgeClass
                    }`}
                  >
                    {React.createElement(CATEGORY_CONFIG[activeAnnotation.category].icon, {
                      className: 'h-3.5 w-3.5',
                      strokeWidth: 2,
                    })}
                    {CATEGORY_CONFIG[activeAnnotation.category].label}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevAnnotation}
                    title="Nhận xét trước"
                    className="btn-interactive flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-[11px] font-bold text-slate-500 px-1">
                    {activeAnnotationIndex + 1} / {filteredAnnotations.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNextAnnotation}
                    title="Nhận xét kế tiếp"
                    className="btn-interactive flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Original phrase highlighted */}
              <div className="my-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Đoạn văn được đánh dấu trong bài:
                </span>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-800 font-mono">
                  &ldquo;{activeAnnotation.originalText}&rdquo;
                </div>
              </div>

              {/* Teacher Comment */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Nhận xét của Giáo viên:
                </span>
                <div className="rounded-xl border-l-4 border-slate-200 bg-slate-50/60 p-3.5 text-xs leading-relaxed text-slate-700 shadow-2xs">
                  {activeAnnotation.teacherComment}
                </div>
              </div>

              {/* Rewrite Recommendation (Band 8.0+) */}
              {activeAnnotation.rewriteSuggestion && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      Gợi ý nâng cấp chuẩn Band 8.0+ (Rewrite):
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyRewrite(
                          activeAnnotation.rewriteSuggestion || '',
                          activeAnnotation.id,
                        )
                      }
                      className="btn-interactive flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      {copiedId === activeAnnotation.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span>Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Sao chép câu</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs font-medium text-emerald-900 leading-relaxed">
                    {activeAnnotation.rewriteSuggestion}
                  </div>
                </div>
              )}

              {/* Pedagogical Explanation */}
              {activeAnnotation.explanation && (
                <div className="text-[11px] text-slate-500 leading-normal pt-2 border-t border-slate-100">
                  <strong className="text-slate-700">Giải thích tiêu chuẩn chấm: </strong>
                  {activeAnnotation.explanation}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-xs text-slate-500">
              Nhấp vào bất kỳ đoạn tô màu nào trong bài viết để mở chi tiết nhận xét của giáo viên.
            </div>
          )}

          {/* List of All Annotations for Quick Jump */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Toàn bộ nhận xét ({filteredAnnotations.length})
            </h4>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {filteredAnnotations.map((ann, idx) => {
                const config = CATEGORY_CONFIG[ann.category]
                const isSelected = activeAnnotation?.id === ann.id
                return (
                  <button
                    key={ann.id}
                    type="button"
                    onClick={() => setSelectedAnnotationId(ann.id)}
                    className={`btn-interactive w-full text-left rounded-xl p-3 text-xs transition-all duration-150 border flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50 shadow-2xs ring-1 ring-slate-900'
                        : 'border-slate-200/80 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <span
                      className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                        ann.category === 'GRAMMAR'
                          ? 'bg-rose-500'
                          : ann.category === 'LEXICAL'
                            ? 'bg-amber-500'
                            : ann.category === 'COHERENCE'
                              ? 'bg-sky-500'
                              : 'bg-emerald-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-slate-800 truncate">
                          #{idx + 1}. {config.shortLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">Xem</span>
                      </div>
                      <p className="text-slate-600 line-clamp-1 font-mono text-[11px]">
                        &ldquo;{ann.originalText}&rdquo;
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
