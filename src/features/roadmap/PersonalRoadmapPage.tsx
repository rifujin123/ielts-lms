import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { Target, CornerDownRight, PlayCircle, CheckCircle2 } from 'lucide-react'
import { roadmapService } from '@/services/roadmapService'
import type { RoadmapStatus } from '@/types/api.types'
import { roadmapMock } from '@/mocks/roadmap.mock'
import { toast } from '@/shared/components/Toast/toastStore'
import { EmptyState, FilterDropdown, SearchInput } from '@/shared/components'
import { queryKeys } from '@/lib/queryKeys'

/**
 * PersonalRoadmapPage — Personalized Student Roadmap (screen 08).
 * Redesigned to match the Exercises page section layout & 2-column cards 1:1:
 * Clean 2-column grid, search + dropdown filters, subcategory with curved arrow,
 * minimal meta badge and vibrant action indicator without badge clutter.
 */
export const PersonalRoadmapPage: React.FC = () => {
  const [status, setStatus] = useState<'all' | RoadmapStatus>('all')
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  const { data: items = roadmapMock } = useQuery({
    queryKey: queryKeys.roadmap.items(),
    queryFn: () => roadmapService.getRoadmapItems(),
  })

  const statusOptions: { label: string; value: 'all' | RoadmapStatus }[] = [
    { label: 'Tất cả trạng thái', value: 'all' },
    { label: 'Cần làm', value: 'not_started' },
    { label: 'Đang làm', value: 'in_progress' },
    { label: 'Đã hoàn thành', value: 'completed' },
  ]

  const categoryOptions: { label: string; value: string }[] = [
    { label: 'Tất cả phân loại', value: 'all' },
    { label: 'Reading Core', value: 'Reading Core' },
    { label: 'Writing Core', value: 'Writing Core' },
    { label: 'Speaking Workshop', value: 'Speaking Workshop' },
    { label: 'Listening Master', value: 'Listening Master' },
    { label: 'Vocabulary Booster', value: 'Vocabulary Booster' },
  ]

  const filteredItems = (items ?? []).filter((task) => {
    if (status !== 'all' && task.status !== status) return false
    if (category !== 'all' && task.type !== category) return false
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      const matchTitle = task.title.toLowerCase().includes(q)
      const matchDesc = task.description.toLowerCase().includes(q)
      const matchType = task.type.toLowerCase().includes(q)
      if (!matchTitle && !matchDesc && !matchType) return false
    }
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
        Danh sách Roadmap cá nhân hóa
      </h1>

      {/* ── Filter Bar: Search + Status Dropdown + Category Dropdown ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Tìm kiếm nhiệm vụ lộ trình..."
        />

        <div className="flex items-center gap-2.5">
          <FilterDropdown
            label="Trạng thái"
            value={status}
            options={statusOptions}
            onChange={(val) => setStatus(val as 'all' | RoadmapStatus)}
          />
          <FilterDropdown
            label="Phân loại"
            value={category}
            options={categoryOptions}
            onChange={setCategory}
          />
        </div>
      </div>

      {/* ── Roadmap Cards Grid (2 columns) ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredItems.map((task) => (
          <div
            key={task.id}
            onClick={() => {
              if (task.status === 'completed') {
                toast.info(`Nhiệm vụ "${task.title}" đã được hoàn thành trước đó.`)
              } else {
                toast.success(`Bắt đầu nhiệm vụ "${task.title}"`)
              }
            }}
            className="group card-interactive flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 cursor-pointer min-h-[160px]"
          >
            <div>
              {/* Type & Difficulty Icon & Name */}
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Target className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
                <span>
                  {task.type} -{' '}
                  {task.difficulty === 'beginner'
                    ? 'Cơ bản'
                    : task.difficulty === 'intermediate'
                      ? 'Trung cấp'
                      : 'Nâng cao'}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-2.5 text-base font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors">
                {task.title}
              </h3>

              {/* Subcategory / Description with curved arrow */}
              <div className="mt-1.5 flex items-center gap-1.5 text-slate-500 text-sm font-normal">
                <CornerDownRight
                  className="h-3.5 w-3.5 text-slate-400 shrink-0"
                  strokeWidth={1.8}
                />
                <span className="line-clamp-1">{task.description}</span>
              </div>
            </div>

            {/* Estimated time badge & Action indicator */}
            <div className="mt-4 sm:mt-5 flex items-center justify-between">
              <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {task.estimatedMinutes} phút
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-hover transition-colors">
                {task.status === 'completed' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-slate-600">Đã hoàn thành</span>
                  </>
                ) : task.status === 'in_progress' ? (
                  <>
                    <PlayCircle className="h-4 w-4 fill-primary/10 text-primary" />
                    <span>Tiếp tục học</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 fill-primary/10 text-primary" />
                    <span>Bắt đầu ngay</span>
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Empty State ─────────────────────────────────────────── */}
      {filteredItems.length === 0 && (
        <EmptyState
          title="Không tìm thấy nhiệm vụ nào"
          description="Vui lòng thử tìm kiếm bằng từ khóa khác hoặc thay đổi bộ lọc trạng thái / phân loại."
        />
      )}
    </div>
  )
}

export default PersonalRoadmapPage
