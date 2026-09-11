import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, Download, Check } from 'lucide-react'
import { attendanceService } from '@/services/attendanceService'
import { attendanceMock } from '@/mocks/attendance.mock'

/**
 * AttendancePage — Attendance Summary & Session History (screen 14).
 * Displays full attendance status table, recap notes, and export actions.
 * Line count budget: 200-300 lines.
 */
export const AttendancePage: React.FC = () => {
  const { data: sessions = attendanceMock, isLoading: _isLoading } = useQuery({
    queryKey: ['attendance-summary'],
    queryFn: () => attendanceService.getAttendance(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  const attendedCount = (sessions ?? []).filter((s) => s.status === 'attended').length
  const total = (sessions ?? []).length

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-body-sm text-secondary"
          >
            <Link to="/classroom" className="hover:text-on-surface">
              Lớp học
            </Link>
            <ChevronRight className="h-4 w-4 text-secondary/70" strokeWidth={2} />
            <span className="font-semibold text-on-surface">Sổ điểm danh</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">
            Lịch sử điểm danh & Buổi học
          </h1>
          <p className="text-body-sm text-secondary">
            Theo dõi chi tiết các buổi học đã tham gia và tài liệu tóm tắt sau lớp.
          </p>
        </div>

        <button
          type="button"
          className="btn-interactive inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container shadow-xs"
        >
          <Download className="h-4 w-4 text-secondary" strokeWidth={2} />
          Xuất báo cáo điểm danh
        </button>
      </div>

      {/* ── Summary statistics ──────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="animate-fade-in-up stagger-1 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs">
          <span className="text-label-sm font-semibold text-secondary uppercase">Đã tham gia</span>
          <p className="mt-1 text-headline-md font-bold text-tertiary">
            {attendedCount} / {total} Buổi
          </p>
          <span className="text-[11px] text-secondary">Tỷ lệ chuyên cần đạt 100%</span>
        </div>

        <div className="animate-fade-in-up stagger-2 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs">
          <span className="text-label-sm font-semibold text-secondary uppercase">Số buổi vắng</span>
          <p className="mt-1 text-headline-md font-bold text-on-surface">0 Buổi</p>
          <span className="text-[11px] text-tertiary font-medium">
            Đủ điều kiện dự thi Final Test
          </span>
        </div>

        <div className="animate-fade-in-up stagger-3 card-interactive rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs">
          <span className="text-label-sm font-semibold text-secondary uppercase">
            Buổi học sắp tới
          </span>
          <p className="mt-1 text-headline-md font-bold text-primary">Buổi 4</p>
          <span className="text-[11px] text-secondary">Thứ 4, 19/08/2026 (20:00)</span>
        </div>
      </div>

      {/* ── Session History Table ───────────────────────────────── */}
      <div className="animate-fade-in-up stagger-4 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-xs">
        <div className="border-b border-outline-variant p-4">
          <h3 className="text-headline-sm font-bold text-on-surface">Chi tiết từng buổi học</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body-sm">
            <thead className="border-b border-outline-variant bg-surface-container-low text-[11px] font-bold uppercase text-secondary">
              <tr>
                <th className="px-5 py-3">Buổi</th>
                <th className="px-5 py-3">Chủ đề bài học</th>
                <th className="px-5 py-3">Ngày & Giờ</th>
                <th className="px-5 py-3">Điểm danh</th>
                <th className="px-5 py-3 text-right">Tài liệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {(sessions ?? []).map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="px-5 py-4 font-bold text-on-surface">Buổi {session.number}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-on-surface">{session.topic}</div>
                    {session.summary && (
                      <div className="text-[11px] text-secondary mt-0.5">{session.summary}</div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-secondary">
                    <div>{session.date}</div>
                    <div className="text-[11px]">{session.time}</div>
                  </td>
                  <td className="px-5 py-4">
                    {session.status === 'attended' ? (
                      <span className="animate-pop-in inline-flex items-center gap-1 rounded-full bg-tertiary-container px-2.5 py-0.5 text-[11px] font-bold text-on-tertiary-container">
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                        Có mặt
                      </span>
                    ) : (
                      <span className="animate-pop-in inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-0.5 text-[11px] font-medium text-secondary">
                        Sắp tới
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="btn-interactive inline-flex items-center gap-1.5 text-label-sm font-semibold text-primary hover:underline"
                    >
                      <Download className="h-3.5 w-3.5" strokeWidth={2} />
                      Tải slide
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AttendancePage
