import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import { roadmapService } from '@/services/roadmapService'
import { PageLoader } from '@/shared/components/PageLoader'

/**
 * PersonalRoadmapPage — Personalized Student Roadmap (screen 08).
 * Displays customized tasks, filtering by status and difficulty.
 * Line count budget: 200-300 lines.
 */
export const PersonalRoadmapPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, 300)

  const { data: items, isLoading } = useQuery({
    queryKey: ['roadmap-items'],
    queryFn: () => roadmapService.getRoadmapItems(),
  })

  if (isLoading) return <PageLoader />

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
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-semibold text-on-surface">Lộ trình cá nhân hóa</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">Roadmap cá nhân hóa</h1>
          <p className="text-body-sm text-secondary">
            Được giảng viên và thuật toán AI DOL tùy chỉnh dựa trên điểm yếu kỹ năng của bạn.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-1 border border-outline-variant">
          {(['all', 'pending', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-label-sm font-semibold transition-colors ${
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
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-secondary">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm nhiệm vụ học tập..."
          className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2 pl-9 pr-4 text-body-sm text-on-surface focus:border-primary focus:outline-none"
        />
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredItems.map((task) => (
          <div
            key={task.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  task.status === 'completed'
                    ? 'bg-tertiary-container text-tertiary'
                    : 'bg-primary-container text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {task.status === 'completed' ? 'check' : 'school'}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-surface-container-high px-2 py-0.5 text-[11px] font-bold text-secondary uppercase">
                    {task.type}
                  </span>
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
                className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-label-sm font-semibold transition-colors shadow-xs ${
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
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-secondary">search_off</span>
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
