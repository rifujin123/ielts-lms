import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { FileText, CornerDownRight, PlayCircle } from 'lucide-react'
import { exerciseService } from '@/services/exerciseService'
import type { ExerciseSkill, ExerciseStatus } from '@/types/api.types'
import { exercisesMock } from '@/mocks/exercises.mock'
import { ExerciseGamifiedRunner } from './runner'
import { toast } from '@/shared/components/Toast/toastStore'
import { EmptyState, FilterDropdown, SearchInput } from '@/shared/components'

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
        <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm..." />

        <div className="flex items-center gap-2.5">
          <FilterDropdown
            label="Trạng thái"
            value={status}
            options={statusOptions}
            onChange={(val) => setStatus(val as 'all' | ExerciseStatus)}
          />
          <FilterDropdown
            label="Phân loại"
            value={skill}
            options={skillOptions}
            onChange={(val) => setSkill(val as 'all' | ExerciseSkill)}
          />
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
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-hover transition-colors">
                <PlayCircle className="h-4 w-4 fill-primary/10 text-primary" />
                Luyện tập ngay
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Empty State ─────────────────────────────────────────── */}
      {(exercises ?? []).length === 0 && (
        <EmptyState
          title="Không tìm thấy bài tập nào"
          description="Vui lòng thử tìm kiếm bằng từ khóa khác hoặc thay đổi bộ lọc trạng thái / phân loại."
        />
      )}
    </div>
  )
}

export default ExercisesPage
