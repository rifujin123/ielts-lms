import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { Timer, CornerDownRight, PlayCircle, Eye } from 'lucide-react'
import { testService } from '@/services/testService'
import type { TestType, TestStatus } from '@/types/api.types'
import { testsMock } from '@/mocks/tests.mock'
import { EmptyState, FilterDropdown, SearchInput } from '@/shared/components'
import { queryKeys } from '@/lib/queryKeys'

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

  const { data: tests = testsMock } = useQuery({
    queryKey: queryKeys.tests.list(),
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
        <SearchInput value={search} onChange={setSearch} placeholder="Tìm kiếm bài test..." />

        <div className="flex items-center gap-2.5">
          <FilterDropdown
            label="Trạng thái"
            value={status}
            options={statusOptions}
            onChange={(val) => setStatus(val as 'all' | TestStatus)}
          />
          <FilterDropdown
            label="Phân loại"
            value={testType}
            options={typeOptions}
            onChange={(val) => setTestType(val as 'all' | TestType)}
          />
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

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:text-primary-hover transition-colors">
                {test.status === 'completed' ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>Xem kết quả</span>
                  </>
                ) : test.status === 'in_progress' ? (
                  <>
                    <PlayCircle className="h-4 w-4 fill-primary/10 text-primary" />
                    <span>Tiếp tục thi</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 fill-primary/10 text-primary" />
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
        <EmptyState
          title="Không tìm thấy bài test nào"
          description="Vui lòng thử tìm kiếm bằng từ khóa khác hoặc thay đổi bộ lọc trạng thái / phân loại."
        />
      )}
    </div>
  )
}

export default TestsPage
