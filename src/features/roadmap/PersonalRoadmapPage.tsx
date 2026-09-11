import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { ChevronRight, Search, CheckCircle2, Target, SearchX } from 'lucide-react'
import { roadmapService } from '@/services/roadmapService'
import { roadmapMock } from '@/mocks/roadmap.mock'

/**
 * PersonalRoadmapPage — Personalized Student Roadmap (screen 08).
 * Displays customized tasks, filtering by status and difficulty.
 * Line count budget: 200-300 lines.
 */
export const PersonalRoadmapPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  const { data: items = roadmapMock, isLoading: _isLoading } = useQuery({
    queryKey: ['roadmap-items'],
    queryFn: () => roadmapService.getRoadmapItems(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  const filteredItems = (items ?? []).filter((item) => {
    if (filter === 'pending' && item.status === 'completed') return false
    if (filter === 'completed' && item.status !== 'completed') return false
    if (debouncedSearch && !item.title.toLowerCase().includes(debouncedSearch.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-body-sm text-secondary"
          >
            <Link to="/roadmap" className="hover:text-on-surface">
              Lộ trình
            </Link>
            <ChevronRight className="h-4 w-4 text-secondary/70" strokeWidth={2} />
            <span className="font-semibold text-on-surface">Lộ trình cá nhân hóa</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">Roadmap cá nhân hóa</h1>
          <p className="text-body-sm text-secondary">
            Được giảng viên và thuật toán AI IELTS Hồ Thành tùy chỉnh dựa trên điểm yếu kỹ năng của
            bạn.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-1 border border-outline-variant">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`btn-interactive rounded-lg px-3 py-1.5 text-label-sm font-semibold transition-colors ${
                filter === tab
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              {tab === 'all' && 'Tất cả'}
              {tab === 'pending' && 'Cần làm'}
              {tab === 'completed' && 'Đã xong'}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary"
          strokeWidth={1.8}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm nhiệm vụ học tập..."
          className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-4 text-body-sm text-on-surface focus:border-primary focus:outline-none shadow-xs"
        />
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredItems.map((task, idx) => (
          <div
            key={task.id}
            className={`animate-fade-in-up stagger-${(idx % 5) + 1} card-interactive flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs sm:flex-row sm:items-center`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 shadow-xs ${
                  task.status === 'completed'
                    ? 'bg-slate-100 text-emerald-600'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
                ) : (
                  <Target className="h-5 w-5 text-primary" strokeWidth={2} />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-tag animate-pop-in">{task.type}</span>
                  <span className="text-[11px] font-semibold text-secondary">
                    Độ khó: {task.difficulty}
                  </span>
                </div>
                <h3 className="mt-1 text-headline-sm font-bold text-on-surface">{task.title}</h3>
                <p className="text-body-sm text-secondary line-clamp-1">{task.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <span className="text-body-sm font-medium text-secondary">
                {task.estimatedMinutes} phút
              </span>
              <button
                type="button"
                className={`btn-interactive inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-label-sm font-semibold transition-colors shadow-xs ${
                  task.status === 'completed'
                    ? 'bg-surface-container-low text-secondary hover:bg-surface-container'
                    : 'bg-primary text-on-primary hover:bg-primary-hover'
                }`}
              >
                {task.status === 'completed' ? 'Xem lại' : 'Bắt đầu ngay'}
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="animate-fade-in-up flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant p-8 text-center">
            <SearchX className="h-10 w-10 text-secondary/60" strokeWidth={1.5} />
            <p className="mt-2 text-body-md font-semibold text-on-surface">
              Không tìm thấy mục nào
            </p>
            <p className="text-body-sm text-secondary">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PersonalRoadmapPage
