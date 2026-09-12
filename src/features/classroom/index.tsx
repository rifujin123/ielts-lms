import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, ClipboardCheck, Video, Flame, ShieldCheck, Check } from 'lucide-react'
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
            <ChevronRight className="h-4 w-4 text-secondary/70" strokeWidth={2} />
            <span className="font-semibold text-on-surface">Phòng học trực tuyến</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">
            Lớp học trực tuyến IELTS Hồ Thành
          </h1>
          <p className="text-body-sm text-secondary">
            Tham gia lớp học tương tác trực tuyến qua Zoom bảo mật với giảng viên chuyên môn.
          </p>
        </div>

        <Link
          to="/attendance"
          className="btn-interactive inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container shadow-xs"
        >
          <ClipboardCheck className="h-4 w-4 text-secondary" strokeWidth={2} />
          Xem sổ điểm danh
        </Link>
      </div>

      {/* ── Next Upcoming Class Banner ──────────────────────────── */}
      <div className="animate-fade-in-up stagger-1 card-interactive rounded-2xl border border-primary/30 bg-red-50/50 p-6 shadow-xs ring-1 ring-primary/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="badge-minimal animate-pop-in">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
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
            className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-label-md font-bold text-on-primary hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Video className="h-5 w-5" strokeWidth={2} />
            Vào phòng Zoom ngay
          </a>
        </div>
      </div>

      {/* ── Streak & Rules Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="animate-fade-in-up stagger-2 card-interactive flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-amber-500" strokeWidth={2} />
              <h3 className="text-headline-sm font-bold text-on-surface">Chuỗi chuyên cần</h3>
            </div>
            <p className="mt-2 text-body-sm text-secondary">
              Bạn đã tham gia liên tục 3 buổi học mà không vắng buổi nào. Tiếp tục duy trì phong độ!
            </p>
            <div className="mt-4 flex items-center gap-2">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="animate-pop-in flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-container font-bold text-tertiary"
                >
                  <Check className="h-5 w-5" strokeWidth={2.5} />
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

        <div className="animate-fade-in-up stagger-3 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" strokeWidth={2} />
            <h3 className="text-headline-sm font-bold text-on-surface">Quy chuẩn phòng học Zoom</h3>
          </div>
          <div className="mt-3 flex flex-col gap-2.5 text-body-sm text-secondary">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-tertiary shrink-0 mt-0.5" strokeWidth={2.5} />
              <span>Đổi tên hiển thị theo cú pháp: [Mã HV] - [Họ và tên]</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-tertiary shrink-0 mt-0.5" strokeWidth={2.5} />
              <span>Bật webcam trong suốt buổi học để tương tác cùng giảng viên</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-tertiary shrink-0 mt-0.5" strokeWidth={2.5} />
              <span>Mở sẵn tài liệu và vở ghi trước giờ học 5 phút</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { AttendancePage } from './AttendancePage'
export default ClassroomPage
