import React, { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import {
  Search,
  ChevronDown,
  FileText,
  CornerDownRight,
  SearchX,
  Check,
  PlayCircle,
} from 'lucide-react'
import { exerciseService } from '@/services/exerciseService'
import type { ExerciseSkill, ExerciseStatus } from '@/types/api.types'
import { exercisesMock } from '@/mocks/exercises.mock'
import { ExerciseGamifiedRunner } from './runner'
import { toast } from '@/shared/components/Toast/toastStore'

/**
 * ExercisesPage — Practice Exercises List (matches reference design 1:1).
 * Layout: 2-column grid, clean minimal card, subcategory with arrow,
 * question count badge, and Duolingo-style bite-sized gamified runner.
 */
export const ExercisesPage: React.FC = () => {
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null)
  const [skill, setSkill] = useState<'all' | ExerciseSkill>('all')
  const [status, setStatus] = useState<'all' | ExerciseStatus>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  // Dropdown open states
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isSkillOpen, setIsSkillOpen] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const skillRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false)
      }
      if (skillRef.current && !skillRef.current.contains(event.target as Node)) {
        setIsSkillOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: exercises = exercisesMock } = useQuery({
    queryKey: ['exercises', skill, status, debouncedSearch],
    queryFn: () =>
      exerciseService.getExercises({
        skill: skill === 'all' ? undefined : skill,
        status: status === 'all' ? undefined : status,
        search: debouncedSearch || undefined,
      }),
  })

  const statusOptions: { label: string; value: 'all' | ExerciseStatus }[] = [
    { label: 'Tất cả trạng thái', value: 'all' },
    { label: 'Chưa hoàn thành', value: 'pending' },
    { label: 'Đang làm', value: 'in_progress' },
    { label: 'Đã nộp bài', value: 'completed' },
  ]

  const skillOptions: { label: string; value: 'all' | ExerciseSkill }[] = [
    { label: 'Tất cả phân loại', value: 'all' },
    { label: 'Reading', value: 'Reading' },
    { label: 'Listening', value: 'Listening' },
    { label: 'Writing', value: 'Writing' },
    { label: 'Speaking', value: 'Speaking' },
  ]

  const currentStatusLabel =
    status === 'all'
      ? 'Trạng thái'
      : statusOptions.find((o) => o.value === status)?.label || 'Trạng thái'

  const currentSkillLabel =
    skill === 'all'
      ? 'Phân loại'
      : skillOptions.find((o) => o.value === skill)?.label || 'Phân loại'

  if (activeExerciseId) {
    return (
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
        <ExerciseGamifiedRunner
          exerciseId={activeExerciseId}
          onExit={() => setActiveExerciseId(null)}
          onComplete={({ accuracyPct }) => {
            toast.success(`Chúc mừng! Bạn đã hoàn thành bài tập (Chính xác: ${accuracyPct}%)`)
            setActiveExerciseId(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Danh sách exercises</h1>

      {/* ── Filter Bar: Search + Status Dropdown + Category Dropdown ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            strokeWidth={2}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm..."
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 border border-transparent focus:border-slate-300 focus:outline-none transition-all shadow-2xs"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2.5">
          {/* Trạng thái Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => {
                setIsStatusOpen((prev) => !prev)
                setIsSkillOpen(false)
              }}
              className="h-11 px-4 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 text-sm font-medium text-slate-700 flex items-center gap-2 border border-transparent transition-colors"
            >
              <span>{currentStatusLabel}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${
                  isStatusOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
              />
            </button>

            {isStatusOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-20 animate-pop-in">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setStatus(opt.value)
                      setIsStatusOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                      status === opt.value
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {status === opt.value && (
                      <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phân loại Dropdown */}
          <div className="relative" ref={skillRef}>
            <button
              type="button"
              onClick={() => {
                setIsSkillOpen((prev) => !prev)
                setIsStatusOpen(false)
              }}
              className="h-11 px-4 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 text-sm font-medium text-slate-700 flex items-center gap-2 border border-transparent transition-colors"
            >
              <span>{currentSkillLabel}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${
                  isSkillOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
              />
            </button>

            {isSkillOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-20 animate-pop-in">
                {skillOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setSkill(opt.value)
                      setIsSkillOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                      skill === opt.value
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {skill === opt.value && (
                      <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Exercise Cards Grid (2 columns) ─────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {(exercises ?? []).map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveExerciseId(item.id)}
            className="group card-interactive flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 cursor-pointer min-h-[160px]"
          >
            <div>
              {/* Skill Icon & Name */}
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <FileText className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
                <span>{item.skill}</span>
              </div>

              {/* Title */}
              <h3 className="mt-2.5 text-base font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </h3>

              {/* Subcategory with curved arrow */}
              <div className="mt-1.5 flex items-center gap-1.5 text-slate-500 text-sm font-normal">
                <CornerDownRight
                  className="h-3.5 w-3.5 text-slate-400 shrink-0"
                  strokeWidth={1.8}
                />
                <span>{item.subCategory || `${item.skill} 1 - ${item.skill} 1`}</span>
              </div>
            </div>

            {/* Question count badge & Action indicator */}
            <div className="mt-4 sm:mt-5 flex items-center justify-between">
              <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {item.questionCount} câu
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 group-hover:text-red-700 transition-colors">
                <PlayCircle className="h-4 w-4 fill-red-100 text-red-600" />
                Luyện tập ngay
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Empty State ─────────────────────────────────────────── */}
      {(exercises ?? []).length === 0 && (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <SearchX className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
          <h3 className="mt-3 text-sm font-bold text-slate-800">Không tìm thấy bài tập nào</h3>
          <p className="mt-1 text-xs text-slate-500">
            Vui lòng thử tìm kiếm bằng từ khóa khác hoặc thay đổi bộ lọc trạng thái / phân loại.
          </p>
        </div>
      )}
    </div>
  )
}

export default ExercisesPage
