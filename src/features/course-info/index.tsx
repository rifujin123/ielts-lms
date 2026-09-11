import React from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ChevronRight,
  Download,
  MessageSquare,
  CheckCircle2,
  Clock,
  User,
  Layers,
} from 'lucide-react'
import { useCourseInfo } from './hooks/useCourseInfo'
import { CourseInfoCard } from './components/CourseInfoCard'
import { InstructorCard } from './components/InstructorCard'
import { ScheduleGrid } from './components/ScheduleGrid'
import { ObjectivesCard } from './components/ObjectivesCard'
import { ClassRulesCard } from './components/ClassRulesCard'
import { courseInfoMock } from '@/mocks/course.mock'

/**
 * CourseInfoPage — Entry point for the Course Information & Class Rules (Root route `/`).
 * Faithful implementation of stitch asset: 16_DOL_IELTS_Course_Information_Class_Rules_3a6ef7c2.html.
 *
 * Line count budget: 200-300 lines.
 */
export const CourseInfoPage: React.FC = () => {
  const {
    data: courseInfo = courseInfoMock,
    isLoading: _isLoading,
    error,
  } = useCourseInfo('IELTS-6.5-2026')

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  if (error || !courseInfo) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <AlertCircle className="h-10 w-10 text-error" strokeWidth={2} />
        <h3 className="mt-2 text-headline-sm text-on-surface">Không tìm thấy thông tin khóa học</h3>
        <p className="text-body-sm text-secondary">Vui lòng thử lại sau hoặc liên hệ ban học vụ.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Breadcrumbs & Quick actions ─────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-body-sm text-secondary"
        >
          <Link to="/dashboard" className="hover:text-on-surface transition-colors">
            Khóa học của tôi
          </Link>
          <ChevronRight className="h-4 w-4 text-secondary/70" strokeWidth={2} />
          <span className="font-semibold text-on-surface">Thông tin khóa học</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            className="btn-interactive inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container shadow-xs"
          >
            <Download className="h-4 w-4" strokeWidth={2} />
            Tải cẩm nang PDF
          </button>
          <a
            href="https://zalo.me/g/dol-ielts-65"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-interactive inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container shadow-xs"
          >
            <MessageSquare className="h-4 w-4" strokeWidth={2} />
            Nhóm trao đổi
          </a>
        </div>
      </div>

      {/* ── Page Hero Title Banner ───────────────────────────────── */}
      <div className="animate-fade-in-up stagger-1 relative overflow-hidden rounded-2xl border border-outline-variant bg-gradient-to-r from-red-600 to-red-700 p-6 sm:p-8 text-on-primary shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-label-sm font-semibold backdrop-blur-xs">
            <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
            Khóa học chính khóa DOL English
          </div>
          <h1 className="mt-3 text-headline-lg sm:text-display-hero text-white font-extrabold tracking-tight">
            {courseInfo.level}
          </h1>
          <p className="mt-2 text-body-md text-white/90 leading-relaxed">
            Học phần tăng tốc phương pháp Linearthinking, rèn luyện tư duy logic 4 kỹ năng chuẩn
            Cambridge với lộ trình cá nhân hóa theo từng giai đoạn.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-body-sm text-white/80">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" strokeWidth={2} />
              <span>20:00 - 22:00 (Thứ 2 - 4 - 6)</span>
            </div>
            <div className="hidden h-3 w-px bg-white/30 sm:block" />
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" strokeWidth={2} />
              <span>{courseInfo.instructors[0]?.name}</span>
            </div>
            <div className="hidden h-3 w-px bg-white/30 sm:block" />
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4" strokeWidth={2} />
              <span>{courseInfo.phase.name}</span>
            </div>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-10 select-none text-[180px] font-black leading-none text-white/10"
        >
          DOL
        </div>
      </div>

      {/* ── Main Bento Grid Layout ──────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Section 1: Course details key-value grid (2 columns wide) */}
        <div className="animate-fade-in-up stagger-2 card-interactive rounded-2xl lg:col-span-2">
          <CourseInfoCard data={courseInfo} />
        </div>

        {/* Section 2: Instructor details (1 column wide) */}
        <div className="animate-fade-in-up stagger-2 card-interactive rounded-2xl col-span-1">
          {courseInfo.instructors[0] && <InstructorCard instructor={courseInfo.instructors[0]} />}
        </div>

        {/* Section 3: Weekly schedule grid (full 3 columns width) */}
        <div className="animate-fade-in-up stagger-3 card-interactive rounded-2xl lg:col-span-3">
          <ScheduleGrid schedule={courseInfo.schedule} />
        </div>

        {/* Section 4: Learning Objectives (1 column wide) */}
        <div className="animate-fade-in-up stagger-4 card-interactive rounded-2xl col-span-1">
          <ObjectivesCard
            description={courseInfo.objectiveDescription}
            highlights={courseInfo.objectiveHighlights}
          />
        </div>

        {/* Section 5: Class Rules & Responsibilities (2 columns wide) */}
        <div className="animate-fade-in-up stagger-4 card-interactive rounded-2xl lg:col-span-2">
          <ClassRulesCard rules={courseInfo.classRules} />
        </div>
      </div>

      {/* ── Footer note ─────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center justify-between border-t border-outline-variant pt-4 text-body-sm text-secondary">
        <div>DOL English © 2026 — Hệ thống Quản trị Học tập Học viên</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-primary transition-colors">
            Chính sách bảo mật
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Điều khoản dịch vụ
          </a>
          <a href="#" className="hover:text-primary transition-colors">
            Trợ giúp
          </a>
        </div>
      </div>
    </div>
  )
}

export default CourseInfoPage
