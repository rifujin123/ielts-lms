import React, { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import {
  Search,
  ChevronDown,
  Target,
  CornerDownRight,
  SearchX,
  Check,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react'
import { roadmapService } from '@/services/roadmapService'
import type { RoadmapStatus } from '@/types/api.types'
import { roadmapMock } from '@/mocks/roadmap.mock'
import { toast } from '@/shared/components/Toast/toastStore'

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

  // Dropdown open states
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false)
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: items = roadmapMock } = useQuery({
    queryKey: ['roadmap-items'],
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

  const currentStatusLabel =
    status === 'all'
      ? 'Trạng thái'
      : statusOptions.find((o) => o.value === status)?.label || 'Trạng thái'

  const currentCategoryLabel =
    category === 'all'
      ? 'Phân loại'
      : categoryOptions.find((o) => o.value === category)?.label || 'Phân loại'

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
            placeholder="Tìm kiếm nhiệm vụ lộ trình..."
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
                setIsCategoryOpen(false)
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
          <div className="relative" ref={categoryRef}>
            <button
              type="button"
              onClick={() => {
                setIsCategoryOpen((prev) => !prev)
                setIsStatusOpen(false)
              }}
              className="h-11 px-4 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 text-sm font-medium text-slate-700 flex items-center gap-2 border border-transparent transition-colors"
            >
              <span>{currentCategoryLabel}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${
                  isCategoryOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
              />
            </button>

            {isCategoryOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-20 animate-pop-in">
                {categoryOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setCategory(opt.value)
                      setIsCategoryOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                      category === opt.value
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {category === opt.value && (
                      <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
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

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 group-hover:text-red-700 transition-colors">
                {task.status === 'completed' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="text-slate-600">Đã hoàn thành</span>
                  </>
                ) : task.status === 'in_progress' ? (
                  <>
                    <PlayCircle className="h-4 w-4 fill-red-100 text-red-600" />
                    <span>Tiếp tục học</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 fill-red-100 text-red-600" />
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
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <SearchX className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
          <h3 className="mt-3 text-sm font-bold text-slate-800">Không tìm thấy nhiệm vụ nào</h3>
          <p className="mt-1 text-xs text-slate-500">
            Vui lòng thử tìm kiếm bằng từ khóa khác hoặc thay đổi bộ lọc trạng thái / phân loại.
          </p>
        </div>
      )}
    </div>
  )
}

export default PersonalRoadmapPage
