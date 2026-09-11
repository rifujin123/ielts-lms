import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import {
  Search,
  ChevronDown,
  Timer,
  CornerDownRight,
  SearchX,
  Check,
  PlayCircle,
  Eye,
} from 'lucide-react'
import { testService } from '@/services/testService'
import type { TestType, TestStatus } from '@/types/api.types'
import { testsMock } from '@/mocks/tests.mock'

/**
 * TestsPage — Online Tests & Mock Exams (screen 12).
 * Styled to match the Exercises page layout 1:1:
 * Clean 2-column grid, search + dropdown filters, subcategory with arrow,
 * minimal meta badge and vibrant action button without badge clutter.
 */
export const TestsPage: React.FC = () => {
  const navigate = useNavigate()
  const [testType, setTestType] = useState<'all' | TestType>('all')
  const [status, setStatus] = useState<'all' | TestStatus>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  // Dropdown open states
  const [isStatusOpen, setIsStatusOpen] = useState(false)
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const typeRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false)
      }
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) {
        setIsTypeOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: tests = testsMock } = useQuery({
    queryKey: ['online-tests'],
    queryFn: () => testService.getOnlineTests(),
  })

  const statusOptions: { label: string; value: 'all' | TestStatus }[] = [
    { label: 'Tất cả trạng thái', value: 'all' },
    { label: 'Chưa làm', value: 'pending' },
    { label: 'Đang làm', value: 'in_progress' },
    { label: 'Đã nộp bài', value: 'completed' },
  ]

  const typeOptions: { label: string; value: 'all' | TestType }[] = [
    { label: 'Tất cả phân loại', value: 'all' },
    { label: 'Full Test', value: 'full' },
    { label: 'Mini Test', value: 'mini' },
    { label: 'Skill Mock', value: 'mock' },
  ]

  const currentStatusLabel =
    status === 'all'
      ? 'Trạng thái'
      : statusOptions.find((o) => o.value === status)?.label || 'Trạng thái'

  const currentTypeLabel =
    testType === 'all'
      ? 'Phân loại'
      : typeOptions.find((o) => o.value === testType)?.label || 'Phân loại'

  const filteredTests = (tests ?? []).filter((test) => {
    if (testType !== 'all' && test.type !== testType) return false
    if (status !== 'all' && test.status !== status) return false
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      const matchTitle = test.title.toLowerCase().includes(q)
      const matchSkill = test.skill.toLowerCase().includes(q)
      const matchSub = test.subCategory?.toLowerCase().includes(q)
      if (!matchTitle && !matchSkill && !matchSub) return false
    }
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
        Danh sách bài test &amp; thi thử
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
            placeholder="Tìm kiếm bài test..."
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
                setIsTypeOpen(false)
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
          <div className="relative" ref={typeRef}>
            <button
              type="button"
              onClick={() => {
                setIsTypeOpen((prev) => !prev)
                setIsStatusOpen(false)
              }}
              className="h-11 px-4 rounded-xl bg-slate-100/90 hover:bg-slate-200/70 text-sm font-medium text-slate-700 flex items-center gap-2 border border-transparent transition-colors"
            >
              <span>{currentTypeLabel}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${
                  isTypeOpen ? 'rotate-180' : ''
                }`}
                strokeWidth={2}
              />
            </button>

            {isTypeOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-20 animate-pop-in">
                {typeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setTestType(opt.value)
                      setIsTypeOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors ${
                      testType === opt.value
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {testType === opt.value && (
                      <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Test Cards Grid (2 columns) ─────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            onClick={() => navigate(`/exam/${test.id}`)}
            className="group card-interactive flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 cursor-pointer min-h-[160px]"
          >
            <div>
              {/* Type / Skill Icon & Name */}
              <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                <Timer className="h-4 w-4 text-slate-400" strokeWidth={1.8} />
                <span>
                  {test.type === 'full'
                    ? 'Full Test'
                    : test.type === 'mini'
                      ? 'Mini Test'
                      : 'Skill Mock'}{' '}
                  - {test.skill}
                </span>
              </div>

              {/* Title */}
              <h3 className="mt-2.5 text-base font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors">
                {test.title}
              </h3>

              {/* Subcategory with curved arrow */}
              <div className="mt-1.5 flex items-center gap-1.5 text-slate-500 text-sm font-normal">
                <CornerDownRight
                  className="h-3.5 w-3.5 text-slate-400 shrink-0"
                  strokeWidth={1.8}
                />
                <span className="line-clamp-1">
                  {test.subCategory || 'Chuẩn cấu trúc đề thi Cambridge IELTS'}
                </span>
              </div>
            </div>

            {/* Duration / Score badge & Action indicator */}
            <div className="mt-4 sm:mt-5 flex items-center justify-between">
              <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {test.duration} phút
                {test.score !== undefined ? ` - Band ${test.score}` : ''}
              </span>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 group-hover:text-red-700 transition-colors">
                {test.status === 'completed' ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Xem kết quả</span>
                  </>
                ) : test.status === 'in_progress' ? (
                  <>
                    <PlayCircle className="h-4 w-4 fill-red-100 text-red-600" />
                    <span>Tiếp tục thi</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 fill-red-100 text-red-600" />
                    <span>Vào thi ngay</span>
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Empty State ─────────────────────────────────────────── */}
      {filteredTests.length === 0 && (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
          <SearchX className="h-10 w-10 text-slate-400" strokeWidth={1.5} />
          <h3 className="mt-3 text-sm font-bold text-slate-800">Không tìm thấy bài test nào</h3>
          <p className="mt-1 text-xs text-slate-500">
            Vui lòng thử tìm kiếm bằng từ khóa khác hoặc thay đổi bộ lọc trạng thái / phân loại.
          </p>
        </div>
      )}
    </div>
  )
}

export default TestsPage
