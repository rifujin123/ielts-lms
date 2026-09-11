import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { homeworkService } from '@/services/homeworkService'
import { finalTestMock } from '@/mocks/homework.mock'

/**
 * FinalTestPage — Course Final Test & Graduation (screen 06).
 * Shows final exam conditions, submission status, target band, and results.
 * Line count budget: 200-300 lines.
 */
export const FinalTestPage: React.FC = () => {
  const { data: finalTest = finalTestMock, isLoading: _isLoading } = useQuery({
    queryKey: ['final-test'],
    queryFn: () => homeworkService.getFinalTest(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-body-sm text-secondary"
        >
          <Link to="/" className="hover:text-on-surface">
            Khóa học
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="font-semibold text-on-surface">Kỳ thi cuối khóa</span>
        </nav>
        <h1 className="mt-1 text-headline-lg font-bold text-on-surface">
          Kỳ thi Final Test tốt nghiệp
        </h1>
        <p className="text-body-sm text-secondary">
          Bài kiểm tra mô phỏng 100% định dạng đề thi thật IELTS trên máy tính chuẩn IDP/BC.
        </p>
      </div>

      {/* ── Status Banner ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-label-sm font-semibold text-amber-900">
              <span className="material-symbols-outlined text-sm">hourglass_top</span>
              Chưa thi
            </span>
            <h2 className="mt-3 text-headline-md font-bold text-on-surface">{finalTest?.title}</h2>
            <p className="text-body-sm text-secondary">
              Mục tiêu chuẩn đầu ra: {finalTest?.targetBand}
            </p>
          </div>

          <Link
            to="/practice"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-label-md font-semibold text-on-primary hover:bg-primary-hover shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">edit_document</span>
            Vào phòng thi thử
          </Link>
        </div>

        {/* Exam metadata grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <span className="text-label-sm text-secondary uppercase">Thời lượng thi</span>
            <p className="mt-1 text-headline-sm font-bold text-on-surface">165 Phút</p>
            <span className="text-[11px] text-secondary">4 Kỹ năng liên tục</span>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <span className="text-label-sm text-secondary uppercase">Lịch thi dự kiến</span>
            <p className="mt-1 text-headline-sm font-bold text-on-surface">22/11/2026</p>
            <span className="text-[11px] text-secondary">08:00 Sáng (Chủ nhật)</span>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <span className="text-label-sm text-secondary uppercase">Hình thức thi</span>
            <p className="mt-1 text-headline-sm font-bold text-primary">Computer-Delivered</p>
            <span className="text-[11px] text-secondary">Giám thị chấm bài trực tiếp</span>
          </div>
        </div>

        {/* Feedback note */}
        {finalTest?.feedback && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">
              info
            </span>
            <p className="text-body-sm text-secondary leading-relaxed">{finalTest.feedback}</p>
          </div>
        )}
      </div>

      {/* ── Requirements checklist ─────────────────────────────── */}
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
        <h3 className="text-headline-sm font-bold text-on-surface">
          Điều kiện tham gia Final Test
        </h3>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
            <span className="text-body-sm text-on-surface">
              Tham gia ít nhất 80% số buổi học chính khóa (30/36 buổi)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
            <span className="text-body-sm text-on-surface">
              Hoàn thành tối thiểu 85% bài tập về nhà trên LMS
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary text-xl">check_circle</span>
            <span className="text-body-sm text-on-surface">
              Hoàn thành bài thi thử giữa kỳ (Mid-term Test)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinalTestPage
