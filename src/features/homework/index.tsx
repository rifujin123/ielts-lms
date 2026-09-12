import React, { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronRight,
  CheckCircle2,
  Award,
  Upload,
  BookOpen,
  Calendar,
  Layers,
  Search,
  X,
  FileCheck2,
  MessageSquare,
} from 'lucide-react'
import { homeworkService } from '@/services/homeworkService'
import { homeworkMock } from '@/mocks/homework.mock'
import type { HomeworkItem } from '@/types/api.types'
import { EmptyState, NavigationTabs, ProgressBar } from '@/shared/components'

interface SyllabusUnit {
  id: string
  session: string
  module: string
  focus: string
  desc: string
  tags: string[]
  totalLessons: number
  completedLessons: number
  status: 'completed' | 'in_progress' | 'upcoming'
  instructor: string
}

/**
 * HomeworkPage — Homework Assignments & Syllabus (screen 07).
 * Reuses the signature Vocabulary Card design pattern (2-col grid, progress bar, tags, status pills, stats banner).
 */
export const HomeworkPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'homework' | 'syllabus'>('homework')
  const [search, setSearch] = useState('')
  const [selectedSubmittedHw, setSelectedSubmittedHw] = useState<HomeworkItem | null>(null)

  const { data: homeworkList = homeworkMock } = useQuery({
    queryKey: ['homework-list'],
    queryFn: () => homeworkService.getHomeworkList(),
  })

  // Prevent background scroll when submission detail modal is open
  useEffect(() => {
    if (!selectedSubmittedHw) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [selectedSubmittedHw])

  const syllabusUnits: SyllabusUnit[] = useMemo(
    () => [
      {
        id: 'SYL-01',
        session: 'Buổi 1 - 4',
        module: 'Module 1: Reading Foundations',
        focus: 'Phương pháp nhận diện liên kết câu & Cấu trúc tư duy Linearthinking',
        desc: 'Nắm vững kỹ thuật Simplify & Read Connection, giải quyết triệt để bẫy từ vựng trong Matching Headings và True/False/Not Given.',
        tags: ['Reading', 'Linearthinking', 'Band 6.5+'],
        totalLessons: 4,
        completedLessons: 4,
        status: 'completed',
        instructor: 'Thầy Hồ Thành',
      },
      {
        id: 'SYL-02',
        session: 'Buổi 5 - 8',
        module: 'Module 2: Writing Task 2 Logic',
        focus: 'Cách xây dựng luận điểm & Lập dàn ý theo tư duy tuyến tính',
        desc: 'Phát triển idea mạch lạc không bị cụt ý, ứng dụng cấu trúc P.E.E.R (Point - Explanation - Example - Result) cho mọi chủ đề trừu tượng.',
        tags: ['Writing Task 2', 'Idea Generation', 'Band 7.0'],
        totalLessons: 4,
        completedLessons: 2,
        status: 'in_progress',
        instructor: 'Cô Mai Linh',
      },
      {
        id: 'SYL-03',
        session: 'Buổi 9 - 12',
        module: 'Module 3: Listening & Speaking Fluency',
        focus: 'Bẫy phát âm trong hội thoại học thuật & Phản xạ trả lời tự nhiên',
        desc: 'Luyện nghe nhận diện âm nuốt, nối âm, trọng âm câu và xây dựng phản xạ Part 2, Part 3 bằng sơ đồ tư duy liên kết ý.',
        tags: ['Listening', 'Speaking Part 2-3', 'Connected Speech'],
        totalLessons: 4,
        completedLessons: 0,
        status: 'upcoming',
        instructor: 'Thầy Hồ Thành',
      },
      {
        id: 'SYL-04',
        session: 'Buổi 13 - 16',
        module: 'Module 4: Writing Task 1 & Full Mock Exam',
        focus: 'Báo cáo số liệu biểu đồ & Thi thử toàn diện 4 kỹ năng',
        desc: 'Chiến thuật mô tả biểu đồ đa dạng (Line, Bar, Pie, Map, Process) và 1 buổi thi thử áp lực thời gian chuẩn Computer-Based IELTS.',
        tags: ['Writing Task 1', 'Full Mock Exam', 'CBT Test'],
        totalLessons: 4,
        completedLessons: 0,
        status: 'upcoming',
        instructor: 'Ban Học Vụ',
      },
    ],
    [],
  )

  // Filtered lists
  const filteredHomework = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return homeworkList ?? []
    return (homeworkList ?? []).filter((hw) => hw.title.toLowerCase().includes(q))
  }, [homeworkList, search])

  const filteredSyllabus = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return syllabusUnits
    return syllabusUnits.filter(
      (u) =>
        u.module.toLowerCase().includes(q) ||
        u.focus.toLowerCase().includes(q) ||
        u.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [syllabusUnits, search])

  // Statistics for progress bar
  const hwStats = useMemo(() => {
    const total = (homeworkList ?? []).length
    const submitted = (homeworkList ?? []).filter((h) => h.status === 'submitted').length
    const percent = total > 0 ? Math.round((submitted / total) * 100) : 0
    return { total, submitted, percent }
  }, [homeworkList])

  const syllabusStats = useMemo(() => {
    const totalLessons = syllabusUnits.reduce((acc, u) => acc + u.totalLessons, 0)
    const completedLessons = syllabusUnits.reduce((acc, u) => acc + u.completedLessons, 0)
    const percent = Math.round((completedLessons / totalLessons) * 100)
    return { totalLessons, completedLessons, percent }
  }, [syllabusUnits])

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-body-sm text-secondary"
          >
            <Link to="/" className="hover:text-on-surface transition-colors">
              Khóa học
            </Link>
            <ChevronRight className="h-4 w-4 text-secondary/70" strokeWidth={2} />
            <span className="font-semibold text-on-surface">
              {activeTab === 'homework' ? 'Syllabus & Bài học' : 'Khung giáo trình chi tiết'}
            </span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">
            {activeTab === 'homework'
              ? 'Bài tập về nhà & Giáo trình'
              : 'Khung chương trình học tập'}
          </h1>
          <p className="text-body-sm text-secondary">
            Nộp bài tập định kỳ để giảng viên nhận xét chi tiết và chấm điểm trước mỗi buổi học.
          </p>
        </div>

        {/* Search Input & Dual Action */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
              strokeWidth={1.8}
            />
            <input
              type="text"
              placeholder={activeTab === 'homework' ? 'Tìm bài tập...' : 'Tìm bài học, chủ đề...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl border border-outline-variant bg-surface-container-lowest pl-9 pr-4 text-body-sm placeholder:text-secondary/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs (0px Shift) ── */}
      <NavigationTabs
        tabs={[
          { id: 'homework', label: 'Bài tập về nhà', icon: Layers, count: hwStats.total },
          {
            id: 'syllabus',
            label: 'Khung giáo trình',
            icon: BookOpen,
            count: `${syllabusUnits.length} Module`,
          },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as 'homework' | 'syllabus')}
      />

      {/* ── Single Compact Progress Bar ─────────────────────────── */}
      <div className="animate-fade-in-up rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 sm:p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 text-body-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-on-surface">
              {activeTab === 'homework'
                ? 'Tiến độ hoàn thành bài tập'
                : 'Tiến độ hoàn thành giáo trình'}
            </span>
            <span className="text-secondary text-body-xs">
              {activeTab === 'homework'
                ? `(${hwStats.submitted} / ${hwStats.total} bài đã nộp)`
                : `(${syllabusStats.completedLessons} / ${syllabusStats.totalLessons} buổi học)`}
            </span>
          </div>
          <span className="font-extrabold text-primary text-label-md">
            {activeTab === 'homework' ? `${hwStats.percent}%` : `${syllabusStats.percent}%`}
          </span>
        </div>
        <ProgressBar
          value={activeTab === 'homework' ? hwStats.percent : syllabusStats.percent}
          size="lg"
          variant="primary"
          className="mt-2.5"
        />
      </div>

      {/* ── 2-Column Card Grid (Matching Vocabulary Design) ──────── */}
      {activeTab === 'homework' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredHomework.map((hw, idx) => {
            const isSubmitted = hw.status === 'submitted'
            const percent = isSubmitted ? 100 : 0
            const skillTag = hw.skill || 'Listening'

            return (
              <div
                key={hw.id}
                className={`animate-fade-in-up stagger-${(idx % 4) + 1} card-interactive flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-colors`}
              >
                <div>
                  {/* Top Row: Tags + Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge-tag">{skillTag}</span>
                      <span className="badge-tag">{hw.practiceCount} bài thực hành</span>
                    </div>

                    {isSubmitted ? (
                      <span className="badge-minimal animate-pop-in">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Đã nộp bài
                      </span>
                    ) : (
                      <span className="badge-minimal">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Chưa nộp
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-headline-sm font-bold text-on-surface hover:text-primary transition-colors">
                    {hw.title}
                  </h3>

                  {/* Teacher Score Callout if Graded */}
                  {hw.score !== undefined && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-tertiary-container/30 border border-tertiary/20 px-3 py-1.5 text-label-sm font-bold text-tertiary">
                      <Award className="h-4 w-4 text-tertiary" strokeWidth={2.2} />
                      <span>Điểm giảng viên: {hw.score} / 9.0</span>
                    </div>
                  )}

                  {/* Progress Bar (Matching Vocabulary) */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-body-sm">
                      <span className="text-secondary">
                        {isSubmitted ? 'Đã hoàn tất nộp bài' : 'Chưa gửi bài tập'}
                      </span>
                      <span
                        className={`font-bold ${isSubmitted ? 'text-tertiary' : 'text-amber-500'}`}
                      >
                        {percent}%
                      </span>
                    </div>
                    <ProgressBar
                      value={percent}
                      size="sm"
                      variant={isSubmitted ? 'emerald' : 'amber'}
                    />
                  </div>
                </div>

                {/* Card Footer (Border-T) */}
                <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-secondary font-medium">
                    <Calendar className="h-3.5 w-3.5 text-secondary/70" />
                    <span>{hw.dueDate ? `Hạn nộp: ${hw.dueDate}` : 'Không giới hạn'}</span>
                  </div>

                  {isSubmitted ? (
                    <button
                      type="button"
                      onClick={() => setSelectedSubmittedHw(hw)}
                      className="btn-interactive inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-label-sm font-bold text-secondary hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4 text-tertiary" strokeWidth={2} />
                      Xem bài đã nộp
                    </button>
                  ) : (
                    <Link
                      to="/exercises"
                      className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-label-sm font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" strokeWidth={2} />
                      Nộp bài ngay
                    </Link>
                  )}
                </div>
              </div>
            )
          })}

          {filteredHomework.length === 0 && (
            <div className="col-span-1 md:col-span-2">
              <EmptyState
                title="Không tìm thấy bài tập nào"
                description="Thử tìm kiếm với từ khóa khác."
              />
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredSyllabus.map((unit, idx) => {
            const percent = Math.round((unit.completedLessons / unit.totalLessons) * 100)
            const isDone = unit.status === 'completed'
            const isInProgress = unit.status === 'in_progress'

            return (
              <div
                key={unit.id}
                className={`animate-fade-in-up stagger-${(idx % 4) + 1} card-interactive flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-colors`}
              >
                <div>
                  {/* Top Row: Session Tag + Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge-tag">{unit.session}</span>
                      {unit.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="badge-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {isDone ? (
                      <span className="badge-minimal animate-pop-in">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Đã học xong
                      </span>
                    ) : isInProgress ? (
                      <span className="badge-minimal">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Đang diễn ra
                      </span>
                    ) : (
                      <span className="badge-minimal">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary/50" />
                        Sắp diễn ra
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="mt-3 text-headline-sm font-bold text-on-surface hover:text-primary transition-colors">
                    {unit.module}
                  </h3>

                  {/* Focus summary */}
                  <p className="mt-1.5 text-body-sm text-secondary line-clamp-2 leading-relaxed">
                    {unit.desc}
                  </p>

                  {/* Progress Bar (Matching Vocabulary) */}
                  <div className="mt-4">
                    <div className="mb-1.5 flex justify-between text-body-sm">
                      <span className="text-secondary font-medium">
                        Đã học {unit.completedLessons} / {unit.totalLessons} buổi
                      </span>
                      <span
                        className={`font-bold ${
                          isDone
                            ? 'text-tertiary'
                            : isInProgress
                              ? 'text-primary'
                              : 'text-secondary'
                        }`}
                      >
                        {percent}%
                      </span>
                    </div>
                    <ProgressBar
                      value={percent}
                      size="sm"
                      variant={isDone ? 'emerald' : isInProgress ? 'primary' : 'secondary'}
                    />
                  </div>
                </div>

                {/* Card Footer (Border-T) */}
                <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4">
                  <div className="flex items-center gap-1.5 text-[11px] text-secondary">
                    <span>GV:</span>
                    <strong className="text-on-surface font-semibold">{unit.instructor}</strong>
                  </div>

                  <Link
                    to="/exercises"
                    className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-label-sm font-bold text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4" strokeWidth={2} />
                    Xem bài tập buổi
                  </Link>
                </div>
              </div>
            )
          })}

          {filteredSyllabus.length === 0 && (
            <div className="col-span-1 md:col-span-2">
              <EmptyState
                title="Không tìm thấy bài học nào"
                description="Thử tìm kiếm với từ khóa khác."
              />
            </div>
          )}
        </div>
      )}

      {/* ── Submission Detail Modal (createPortal) ────────────────── */}
      {selectedSubmittedHw &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="animate-pop-in relative w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl my-auto">
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-container text-tertiary">
                    <FileCheck2 className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-title-md font-bold text-on-surface">
                      Chi tiết bài tập đã nộp
                    </h3>
                    <p className="text-body-xs text-secondary">
                      Mã bài tập: {selectedSubmittedHw.id}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSubmittedHw(null)}
                  className="rounded-xl p-1.5 text-secondary hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <span className="text-label-xs font-semibold text-secondary uppercase tracking-wider">
                    Tên bài nộp:
                  </span>
                  <h4 className="mt-1 text-body-md font-bold text-on-surface">
                    {selectedSubmittedHw.title}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-surface-container-low p-3 border border-outline-variant">
                    <span className="text-label-xs font-semibold text-secondary uppercase">
                      Điểm đánh giá
                    </span>
                    <p className="mt-1 text-headline-sm font-extrabold text-tertiary">
                      {selectedSubmittedHw.score ?? '8.5'} / 9.0
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface-container-low p-3 border border-outline-variant">
                    <span className="text-label-xs font-semibold text-secondary uppercase">
                      Trạng thái chấm
                    </span>
                    <p className="mt-1 text-label-md font-bold text-on-surface flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-tertiary" />
                      Đã chấm điểm
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                  <div className="flex items-center gap-1.5 text-label-sm font-bold text-primary mb-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Nhận xét của Giảng viên:</span>
                  </div>
                  <p className="text-body-sm text-on-surface leading-relaxed">
                    “Bài làm rất chắc tay! Tư duy liên kết câu (Linearthinking) trong bài Reading
                    được áp dụng rất tốt, xác định chuẩn các từ khóa dẫn xuất (linking words). Tiếp
                    tục phát huy ở phần Writing Task 2 sắp tới.”
                  </p>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmittedHw(null)}
                    className="btn-interactive rounded-xl bg-primary px-5 py-2 text-label-sm font-semibold text-white hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

export default HomeworkPage
