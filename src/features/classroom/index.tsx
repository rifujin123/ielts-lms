import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { attendanceService } from '@/services/attendanceService'
import { attendanceMock } from '@/mocks/attendance.mock'

/**
 * ClassroomPage — Online Classroom Hub (screen 13).
 * Shows live room link, learning streak, and upcoming live session cards.
 * Line count budget: 200-300 lines.
 */
export const ClassroomPage: React.FC = () => {
  const { data: sessions = attendanceMock, isLoading: _isLoading } = useQuery({
    queryKey: ['classroom-sessions'],
    queryFn: () => attendanceService.getAttendance(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  const nextSession = (sessions ?? []).find((s) => s.status === 'upcoming')

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-body-sm text-secondary"
          >
            <Link to="/" className="hover:text-on-surface">
              Khóa học
            </Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="font-semibold text-on-surface">Phòng học trực tuyến</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">
            Lớp học trực tuyến DOL
          </h1>
          <p className="text-body-sm text-secondary">
            Tham gia lớp học tương tác trực tuyến qua Zoom bảo mật với giảng viên chuyên môn.
          </p>
        </div>

        <Link
          to="/attendance"
          className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container shadow-xs"
        >
          <span className="material-symbols-outlined text-base">fact_check</span>
          Xem sổ điểm danh
        </Link>
      </div>

      {/* ── Next Upcoming Class Banner ──────────────────────────── */}
      <div className="rounded-2xl border border-primary/30 bg-red-50/50 p-6 shadow-xs ring-1 ring-primary/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-label-sm font-semibold text-on-primary">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              Buổi học kế tiếp
            </span>
            <h2 className="mt-3 text-headline-md font-bold text-on-surface">
              Buổi {nextSession?.number}:{' '}
              {nextSession?.topic ?? 'Listening: Section 1 & 2 - Bẫy phát âm'}
            </h2>
            <p className="mt-1 text-body-sm text-secondary">
              Thời gian: {nextSession?.time ?? '20:00 - 22:00'} | Ngày:{' '}
              {nextSession?.date ?? '19/08/2026'}
            </p>
          </div>

          <a
            href="https://zoom.us/j/8829012389"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-md font-bold text-on-primary hover:bg-primary-hover transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">videocam</span>
            Vào phòng Zoom ngay
          </a>
        </div>
      </div>

      {/* ── Streak & Rules Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-2xl">
                local_fire_department
              </span>
              <h3 className="text-headline-sm font-bold text-on-surface">Chuỗi chuyên cần</h3>
            </div>
            <p className="mt-2 text-body-sm text-secondary">
              Bạn đã tham gia liên tục 3 buổi học mà không vắng buổi nào. Tiếp tục duy trì phong độ!
            </p>
            <div className="mt-4 flex items-center gap-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-container font-bold text-tertiary"
                >
                  ✓
                </div>
              ))}
              {[4, 5, 6].map((num) => (
                <div
                  key={num}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container text-secondary font-semibold"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-outline-variant pt-4 text-[12px] text-secondary">
            Tỷ lệ điểm danh hiện tại: <span className="font-bold text-tertiary">100%</span>
          </div>
        </div>

        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">rule</span>
            <h3 className="text-headline-sm font-bold text-on-surface">Quy chuẩn phòng học Zoom</h3>
          </div>
          <div className="mt-3 flex flex-col gap-2.5 text-body-sm text-secondary">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-tertiary text-lg shrink-0">
                check
              </span>
              <span>Đổi tên hiển thị theo cú pháp: [Mã HV] - [Họ và tên]</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-tertiary text-lg shrink-0">
                check
              </span>
              <span>Bật webcam trong suốt buổi học để tương tác cùng giảng viên</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-tertiary text-lg shrink-0">
                check
              </span>
              <span>Mở sẵn tài liệu và vở ghi trước giờ học 5 phút</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassroomPage
