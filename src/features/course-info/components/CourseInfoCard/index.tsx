import React from 'react'
import type { CourseInfo } from '../../types'
import { formatDate } from '@/lib/utils'

interface CourseInfoCardProps {
  data: CourseInfo
}

export const CourseInfoCard: React.FC<CourseInfoCardProps> = ({ data }) => {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant pb-4">
        <div>
          <span className="animate-pop-in inline-flex items-center gap-1.5 rounded-full bg-tertiary-container px-3 py-1 text-label-sm font-semibold text-on-tertiary-container shadow-xs">
            <span className="h-2 w-2 rounded-full bg-tertiary"></span>
            Đang hoạt động
          </span>
          <h2 className="mt-2 text-headline-md font-bold text-on-surface">{data.name}</h2>
          <p className="text-body-sm text-secondary">Cấp độ mục tiêu: {data.level}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={data.zoomLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-md font-semibold text-on-primary hover:bg-primary-hover shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">videocam</span>
            Vào phòng Zoom
          </a>
        </div>
      </div>

      {/* Grid of details */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3.5">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
            <span className="text-label-sm uppercase tracking-wider">Thời gian khóa học</span>
          </div>
          <p className="mt-1 text-body-md font-semibold text-on-surface">
            {formatDate(data.startDate)} – {formatDate(data.endDate)}
          </p>
          <span className="text-[11px] text-secondary">{data.semester}</span>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3.5">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-lg">schedule</span>
            <span className="text-label-sm uppercase tracking-wider">Giờ học cố định</span>
          </div>
          <p className="mt-1 text-body-md font-semibold text-on-surface">{data.classTime}</p>
          <span className="text-[11px] text-secondary">20:00 - 22:00 (Thứ 2 - 4 - 6)</span>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3.5">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-lg">meeting_room</span>
            <span className="text-label-sm uppercase tracking-wider">Phòng học Zoom</span>
          </div>
          <p className="mt-1 text-body-md font-semibold text-primary">{data.zoomRoom}</p>
          <span className="text-[11px] text-secondary">ID & Passcode đính kèm lịch</span>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3.5">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-lg">chat</span>
            <span className="text-label-sm uppercase tracking-wider">Nhóm Zalo lớp</span>
          </div>
          <p className="mt-1 text-body-md font-semibold text-on-surface truncate">
            {data.zaloGroupName}
          </p>
          <a
            href={data.zaloGroupLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-0.5"
          >
            Mở liên kết Zalo <span className="material-symbols-outlined text-xs">open_in_new</span>
          </a>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3.5">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-lg">assignment</span>
            <span className="text-label-sm uppercase tracking-wider">Tổng bài tập</span>
          </div>
          <p className="mt-1 text-body-md font-semibold text-on-surface">
            {data.totalExercises} bài luyện tập
          </p>
          <span className="text-[11px] text-secondary">
            {data.totalAssignments} bài tập nộp chấm
          </span>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3.5">
          <div className="flex items-center gap-2 text-secondary">
            <span className="material-symbols-outlined text-lg">verified_user</span>
            <span className="text-label-sm uppercase tracking-wider">Trạng thái học viên</span>
          </div>
          <p className="mt-1 text-body-md font-semibold text-tertiary">Chính khóa (Đạt yêu cầu)</p>
          <span className="text-[11px] text-secondary">Mã HV: DOL-8829</span>
        </div>
      </div>
    </div>
  )
}
