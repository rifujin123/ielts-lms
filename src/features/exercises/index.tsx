import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import {
  ChevronRight,
  Search,
  BookOpen,
  PenLine,
  Headphones,
  Mic,
  Award,
  Eye,
  Play,
  CheckCircle2,
} from 'lucide-react'
import { exerciseService } from '@/services/exerciseService'
import type { ExerciseSkill, ExerciseStatus } from '@/types/api.types'
import { exercisesMock } from '@/mocks/exercises.mock'

/**
 * ExercisesPage — Practice Exercises List (screens 01, 09).
 * Supports filtering by Skill (Reading, Writing, Listening, Speaking),
 * Status (all, pending, completed), and debounced search (300ms).
 *
 * Line count budget: 200-300 lines.
 */
export const ExercisesPage: React.FC = () => {
  const [skill, setSkill] = useState<'all' | ExerciseSkill>('all')
  const [status, setStatus] = useState<'all' | ExerciseStatus>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  const { data: exercises = exercisesMock, isLoading: _isLoading } = useQuery({
    queryKey: ['exercises', skill, status, debouncedSearch],
    queryFn: () =>
      exerciseService.getExercises({
        skill: skill === 'all' ? undefined : skill,
        status: status === 'all' ? undefined : status,
        search: debouncedSearch || undefined,
      }),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  const skillOptions: { label: string; value: 'all' | ExerciseSkill }[] = [
    { label: 'Tất cả kỹ năng', value: 'all' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Writing', value: 'Writing' },
    { label: 'Listening', value: 'Listening' },
    { label: 'Speaking', value: 'Speaking' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-body-sm text-secondary"
          >
            <Link to="/" className="hover:text-on-surface">
              Khóa học
            </Link>
            <ChevronRight className="h-4 w-4 text-secondary/70" strokeWidth={2} />
            <span className="font-semibold text-on-surface">Bài tập luyện tập</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">Kho bài tập luyện tập</h1>
          <p className="text-body-sm text-secondary">
            Hoàn thành các bài tập theo phương pháp Linearthinking để củng cố kỹ năng sau mỗi buổi
            học.
          </p>
        </div>

        {/* Search input with 300ms debounce */}
        <div className="relative w-full max-w-xs sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary"
            strokeWidth={1.8}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề bài tập..."
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-4 text-body-sm text-on-surface focus:border-primary focus:outline-none shadow-xs"
          />
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────── */}
      <div className="animate-fade-in-up stagger-1 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 shadow-xs">
        {/* Skill tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {skillOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSkill(opt.value)}
              className={`btn-interactive rounded-lg px-3 py-1.5 text-label-sm font-semibold transition-colors ${
                skill === opt.value
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'bg-surface-container-low text-secondary hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Status filter dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-body-sm text-secondary">Trạng thái:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'all' | ExerciseStatus)}
            aria-label="Lọc theo trạng thái bài tập"
            className="rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 text-label-sm font-semibold text-on-surface focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chưa hoàn thành</option>
            <option value="in_progress">Đang làm</option>
            <option value="completed">Đã nộp bài</option>
          </select>
        </div>
      </div>

      {/* ── Exercise Cards Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4">
        {(exercises ?? []).map((item, idx) => (
          <div
            key={item.id}
            className={`animate-fade-in-up stagger-${(idx % 5) + 1} card-interactive flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs transition-colors hover:border-primary/40 sm:flex-row sm:items-center`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold shadow-xs ${
                  item.skill === 'Reading'
                    ? 'bg-red-100 text-primary'
                    : item.skill === 'Writing'
                      ? 'bg-emerald-100 text-tertiary'
                      : item.skill === 'Listening'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.skill === 'Reading' && <BookOpen className="h-6 w-6" strokeWidth={2} />}
                {item.skill === 'Writing' && <PenLine className="h-6 w-6" strokeWidth={2} />}
                {item.skill === 'Listening' && <Headphones className="h-6 w-6" strokeWidth={2} />}
                {item.skill === 'Speaking' && <Mic className="h-6 w-6" strokeWidth={2} />}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="animate-pop-in rounded bg-surface-container px-2 py-0.5 text-[11px] font-bold text-secondary uppercase">
                    {item.skill}
                  </span>
                  <span className="text-[11px] text-secondary">{item.questionCount} câu hỏi</span>
                  {item.dueDate && (
                    <span className="text-[11px] font-medium text-amber-700">
                      Hạn nộp: {item.dueDate}
                    </span>
                  )}
                </div>

                <h3 className="mt-1 text-headline-sm font-bold text-on-surface">{item.title}</h3>

                {item.score !== undefined && (
                  <div className="mt-1 inline-flex items-center gap-1 text-label-sm font-bold text-tertiary">
                    <Award className="h-4 w-4" strokeWidth={2} />
                    Điểm số: {item.score} / 9.0
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              {item.status === 'completed' ? (
                <Link
                  to="/practice"
                  className="btn-interactive inline-flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-2 text-label-sm font-semibold text-secondary hover:bg-surface-container transition-colors"
                >
                  <Eye className="h-4 w-4" strokeWidth={2} />
                  Xem lại kết quả
                </Link>
              ) : (
                <Link
                  to="/practice"
                  className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
                >
                  <Play className="h-4 w-4" strokeWidth={2} />
                  Bắt đầu làm bài
                </Link>
              )}
            </div>
          </div>
        ))}

        {(exercises ?? []).length === 0 && (
          <div className="animate-fade-in-up flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-lowest p-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-secondary/60" strokeWidth={1.5} />
            <h3 className="mt-3 text-headline-sm font-bold text-on-surface">
              Không có bài tập nào
            </h3>
            <p className="mt-1 text-body-sm text-secondary">
              Bạn đã hoàn thành hết các bài tập hoặc không tìm thấy bài tập phù hợp với bộ lọc.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExercisesPage
