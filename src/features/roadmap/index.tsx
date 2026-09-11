import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Route, CheckCircle2, PlayCircle } from 'lucide-react'
import { roadmapService } from '@/services/roadmapService'
import { roadmapMock } from '@/mocks/roadmap.mock'

/**
 * RoadmapPage — Course Phase Overview (screen 03).
 * Shows multi-phase course structure and progression path.
 * Line count budget: 200-300 lines.
 */
export const RoadmapPage: React.FC = () => {
  const { data: items = roadmapMock, isLoading: _isLoading } = useQuery({
    queryKey: ['roadmap-items'],
    queryFn: () => roadmapService.getRoadmapItems(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  const phases = [
    {
      number: 1,
      title: 'Giai đoạn 1: Nền tảng Linearthinking',
      status: 'completed',
      description:
        'Nắm vững tư duy cấu trúc câu, đọc hiểu tuyến tính và phương pháp học từ vựng theo cụm.',
      sessions: 'Buổi 1 - 12',
    },
    {
      number: 2,
      title: 'Giai đoạn 2: Luyện đề & Tăng tốc kỹ năng',
      status: 'active',
      description:
        'Áp dụng Linearthinking vào giải quyết các dạng bài thi Cambridge 4 kỹ năng trong áp lực thời gian.',
      sessions: 'Buổi 13 - 28',
    },
    {
      number: 3,
      title: 'Giai đoạn 3: Chiến thuật phòng thi & Final Test',
      status: 'upcoming',
      description:
        'Thi thử như thi thật, hoàn thiện điểm yếu cá nhân và nhận phân tích band điểm chi tiết.',
      sessions: 'Buổi 29 - 36',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
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
            <span className="font-semibold text-on-surface">Lộ trình học tập</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">
            Lộ trình tổng thể khóa học
          </h1>
          <p className="text-body-sm text-secondary">
            Khóa học IELTS 6.5 Intensive gồm 3 giai đoạn tinh gọn, tối ưu theo phương pháp
            Linearthinking.
          </p>
        </div>

        <Link
          to="/roadmap/personal"
          className="btn-interactive inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary hover:bg-primary-hover shadow-xs"
        >
          <Route className="h-4 w-4" strokeWidth={2} />
          Xem lộ trình cá nhân hóa
        </Link>
      </div>

      {/* 3 Phase Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {phases.map((phase, idx) => (
          <div
            key={phase.number}
            className={`animate-fade-in-up stagger-${idx + 1} card-interactive relative flex flex-col justify-between rounded-2xl border p-6 shadow-xs ${
              phase.status === 'active'
                ? 'border-primary bg-surface-container-lowest ring-2 ring-primary/20'
                : 'border-outline-variant bg-surface-container-low/60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-label-sm font-bold uppercase text-secondary">
                  {phase.sessions}
                </span>
                {phase.status === 'completed' && (
                  <span className="animate-pop-in rounded-full bg-tertiary-container px-2.5 py-0.5 text-label-sm font-semibold text-on-tertiary-container">
                    Hoàn thành
                  </span>
                )}
                {phase.status === 'active' && (
                  <span className="animate-pop-in rounded-full bg-primary-container px-2.5 py-0.5 text-label-sm font-semibold text-on-primary-container">
                    Đang học
                  </span>
                )}
                {phase.status === 'upcoming' && (
                  <span className="animate-pop-in rounded-full bg-surface-container-high px-2.5 py-0.5 text-label-sm font-semibold text-secondary">
                    Sắp tới
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-headline-sm font-bold text-on-surface">{phase.title}</h3>
              <p className="mt-2 text-body-sm text-secondary leading-relaxed">
                {phase.description}
              </p>
            </div>

            <div className="mt-6 border-t border-outline-variant pt-4">
              <span className="text-label-sm font-semibold text-primary">
                {phase.status === 'active' ? 'Tiếp tục giai đoạn →' : 'Xem chi tiết'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommended Topics from items */}
      <div className="animate-fade-in-up stagger-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
        <h3 className="text-headline-sm font-bold text-on-surface">Nhiệm vụ trọng tâm hiện tại</h3>
        <p className="text-body-sm text-secondary">
          Các bài tập và nội dung quan trọng được khuyến nghị hoàn thành trong tuần này:
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {(items ?? []).map((item) => (
            <div
              key={item.id}
              className="card-interactive flex flex-wrap items-center justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-4"
            >
              <div className="flex items-center gap-3">
                {item.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-tertiary shrink-0" strokeWidth={2} />
                ) : (
                  <PlayCircle className="h-5 w-5 text-primary shrink-0" strokeWidth={2} />
                )}
                <div>
                  <h4 className="text-body-md font-bold text-on-surface">{item.title}</h4>
                  <p className="text-body-sm text-secondary">{item.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-body-sm text-secondary">~{item.estimatedMinutes} phút</span>
                <span className="animate-pop-in rounded bg-surface-container-high px-2 py-0.5 text-[11px] font-semibold text-on-surface">
                  {item.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoadmapPage
