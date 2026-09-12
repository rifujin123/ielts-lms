import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  ShieldCheck,
  GraduationCap,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  Clock,
  UserCheck,
  Video,
  BookOpen,
  Edit2,
  Save,
  X,
  AlertCircle,
} from 'lucide-react'
import { studentProfileService } from '@/services/studentProfileService'
import type { StudentProfile } from '@/types/profile.types'
import { toast } from '@/shared/components/Toast/toastStore'
import { PageLoader, NavigationTabs, ProgressBar } from '@/shared/components'

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'courses'>('info')

  // Phone editing state
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [isSavingPhone, setIsSavingPhone] = useState(false)

  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        const data = await studentProfileService.getProfile()
        if (isMounted) {
          setProfile(data)
          setPhoneInput(data.phone)
          setIsLoading(false)
        }
      } catch {
        if (isMounted) setIsLoading(false)
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  // Handle phone update
  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault()
    const vnPhoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
    if (!vnPhoneRegex.test(phoneInput.trim())) {
      toast.error('Số điện thoại không hợp lệ', {
        description: 'Vui lòng nhập số điện thoại Việt Nam gồm 10 chữ số (VD: 0912345678).',
      })
      return
    }

    setIsSavingPhone(true)
    try {
      const updated = await studentProfileService.updatePhone({ phone: phoneInput })
      setProfile(updated)
      setIsEditingPhone(false)
      toast.success('Cập nhật số điện thoại thành công!')
    } catch {
      toast.error('Không thể lưu số điện thoại', {
        description: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
      })
    } finally {
      setIsSavingPhone(false)
    }
  }

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Chưa nhập', color: 'bg-outline-variant' }
    let score = 0
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass)) score += 1
    if (/[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1

    if (score <= 1) return { score: 1, label: 'Yếu', color: 'bg-error' }
    if (score <= 3) return { score: 2, label: 'Trung bình', color: 'bg-amber-500' }
    return { score: 3, label: 'Mạnh', color: 'bg-tertiary' }
  }

  const strength = getPasswordStrength(newPassword)

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      toast.error('Thiếu thông tin', { description: 'Vui lòng nhập mật khẩu hiện tại.' })
      return
    }
    if (newPassword.length < 8) {
      toast.error('Mật khẩu quá ngắn', { description: 'Mật khẩu mới phải có tối thiểu 8 ký tự.' })
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp', {
        description: 'Mật khẩu xác nhận phải trùng khớp với mật khẩu mới.',
      })
      return
    }

    setIsChangingPassword(true)
    try {
      await studentProfileService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success('Đổi mật khẩu thành công!', {
        description: 'Tài khoản của bạn đã được bảo vệ với mật khẩu mới.',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra khi đổi mật khẩu.'
      toast.error('Không thể đổi mật khẩu', { description: msg })
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading || !profile) {
    return <PageLoader message="Đang tải thông tin tài khoản..." />
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* ── Top Header & Hero Card ── */}
      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-container text-headline-sm font-bold text-on-primary-container shadow-xs">
              {profile.initials}
              <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-surface-container-lowest bg-tertiary" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-title-lg font-bold text-on-surface tracking-tight">
                  {profile.name}
                </h1>
                <span className="rounded-md bg-secondary-container px-2.5 py-0.5 text-label-xs font-semibold text-on-secondary-container">
                  {profile.id}
                </span>
                <span className="rounded-md bg-primary-container/60 px-2.5 py-0.5 text-label-xs font-semibold text-on-primary-container">
                  {profile.enrolledCourse.title}
                </span>
              </div>
              <p className="text-body-sm text-secondary">{profile.email}</p>
            </div>
          </div>

          {/* Membership Validity Pill Card */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3.5 sm:min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-label-xs font-semibold text-secondary uppercase tracking-wider">
                Trạng thái tài khoản
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-tertiary">
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                Còn hạn
              </span>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-title-md font-bold text-on-surface">
                Còn {profile.remainingDays} ngày
              </span>
              <span className="text-[11px] text-secondary">Hết hạn: {profile.expiryDate}</span>
            </div>
            <ProgressBar value={75} variant="emerald" size="sm" className="mt-2" />
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs (0px Shift) ── */}
      <NavigationTabs
        tabs={[
          { id: 'info', label: 'Thông tin tài khoản', icon: User },
          { id: 'security', label: 'Bảo mật & Mật khẩu', icon: ShieldCheck },
          { id: 'courses', label: 'Gói học & Lớp học', icon: GraduationCap },
        ]}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as 'info' | 'security' | 'courses')}
      />

      {/* ── TAB 1: THÔNG TIN TÀI KHOẢN ── */}
      {activeTab === 'info' && (
        <div className="animate-fade-in-up space-y-6">
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
            <h2 className="text-title-md font-bold text-on-surface mb-1">
              Chi tiết hồ sơ học viên
            </h2>
            <p className="text-body-sm text-secondary mb-6">
              Thông tin liên lạc dùng để nhận tài liệu, thông báo bài tập và xác thực tài khoản.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Full name */}
              <div className="space-y-1.5">
                <label className="text-label-sm font-semibold text-on-surface flex items-center gap-1.5">
                  <User className="h-4 w-4 text-secondary" strokeWidth={1.75} />
                  Họ và tên
                </label>
                <div className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md font-medium text-on-surface">
                  {profile.name}
                </div>
                <p className="text-[11px] text-secondary">
                  Tên theo danh sách ghi danh chính thức.
                </p>
              </div>

              {/* Student ID */}
              <div className="space-y-1.5">
                <label className="text-label-sm font-semibold text-on-surface flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-secondary" strokeWidth={1.75} />
                  Mã học viên
                </label>
                <div className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md font-mono font-medium text-on-surface">
                  {profile.id}
                </div>
                <p className="text-[11px] text-secondary">
                  Mã định danh duy nhất tại IELTS Hồ Thành.
                </p>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-label-sm font-semibold text-on-surface flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-secondary" strokeWidth={1.75} />
                  Địa chỉ Email
                </label>
                <div className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md font-medium text-on-surface">
                  <span>{profile.email}</span>
                  <span title="Email đăng nhập cố định">
                    <Lock className="h-4 w-4 text-secondary/60" strokeWidth={2} />
                  </span>
                </div>
                <p className="text-[11px] text-secondary">
                  Email đăng nhập. Để thay đổi email, vui lòng liên hệ giáo vụ trung tâm.
                </p>
              </div>

              {/* Phone (Editable) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-label-sm font-semibold text-on-surface flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-secondary" strokeWidth={1.75} />
                    Số điện thoại liên hệ
                  </label>
                  {!isEditingPhone && (
                    <button
                      type="button"
                      onClick={() => setIsEditingPhone(true)}
                      className="flex items-center gap-1 text-label-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" strokeWidth={2} />
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {isEditingPhone ? (
                  <form onSubmit={handleSavePhone} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="Nhập số điện thoại (VD: 0912345678)"
                        className="flex-1 rounded-xl border border-primary bg-surface-container-lowest px-4 py-2 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={isSavingPhone}
                        className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-label-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <Save className="h-3.5 w-3.5" strokeWidth={2} />
                        {isSavingPhone ? 'Đang lưu...' : 'Lưu'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneInput(profile.phone)
                          setIsEditingPhone(false)
                        }}
                        className="rounded-xl border border-outline-variant bg-surface-container-lowest p-2 text-secondary hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        <X className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                    <p className="text-[11px] text-secondary">
                      Nhập số điện thoại 10 chữ số tại Việt Nam để nhận thông báo lịch học qua
                      Zalo/SMS.
                    </p>
                  </form>
                ) : (
                  <div className="rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-body-md font-medium text-on-surface">
                    {profile.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: BẢO MẬT & MẬT KHẨU ── */}
      {activeTab === 'security' && (
        <div className="animate-fade-in-up space-y-6">
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
            <div className="mb-6">
              <h2 className="text-title-md font-bold text-on-surface mb-1">Thay đổi mật khẩu</h2>
              <p className="text-body-sm text-secondary">
                Bảo vệ tài khoản học viên bằng mật khẩu mạnh kết hợp chữ hoa, chữ thường và chữ số.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="max-w-xl space-y-5">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-label-sm font-semibold text-on-surface">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 pr-11 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự, gồm số và chữ hoa"
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 pr-11 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength meter */}
                {newPassword && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-secondary">Độ mạnh:</span>
                      <span className="font-bold text-on-surface">{strength.label}</span>
                    </div>
                    <div className="flex h-1.5 gap-1.5">
                      <div
                        className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-surface-container-high'}`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-surface-container-high'}`}
                      />
                      <div
                        className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-surface-container-high'}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-label-sm font-semibold text-on-surface">
                  Nhập lại mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới vừa đặt"
                    className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 pr-11 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {confirmPassword && newPassword && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px]">
                    {newPassword === confirmPassword ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-tertiary" />
                        <span className="text-tertiary font-medium">
                          Mật khẩu xác nhận đã trùng khớp
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5 text-error" />
                        <span className="text-error font-medium">Mật khẩu xác nhận chưa khớp</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-label-md font-semibold text-white shadow-xs hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                  {isChangingPassword ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB 3: GÓI HỌC & LỚP HỌC ── */}
      {activeTab === 'courses' && (
        <div className="animate-fade-in-up space-y-6">
          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-title-md font-bold text-on-surface mb-1">
                  Khóa học & Lớp học đang ghi danh
                </h2>
                <p className="text-body-sm text-secondary">
                  Thông tin lịch học, giảng viên và lộ trình tiến độ khóa học hiện tại.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-container/30 border border-tertiary/20 px-3 py-1 text-label-sm font-semibold text-tertiary self-start sm:self-auto">
                <CheckCircle2 className="h-4 w-4" />
                Đang theo học
              </span>
            </div>

            {/* Course Card Detail */}
            <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-5 space-y-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-outline-variant pb-4">
                <div>
                  <span className="rounded bg-primary-container px-2.5 py-0.5 text-label-xs font-bold text-on-primary-container uppercase tracking-wider">
                    Target: {profile.enrolledCourse.targetBand}
                  </span>
                  <h3 className="text-title-lg font-bold text-on-surface mt-2">
                    {profile.enrolledCourse.title}
                  </h3>
                  <p className="text-body-sm text-secondary font-mono mt-0.5">
                    Mã lớp: {profile.enrolledCourse.classCode}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link
                    to="/classroom"
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-label-sm font-semibold text-white hover:bg-primary/90 transition-colors shadow-xs"
                  >
                    <Video className="h-4 w-4" strokeWidth={2} />
                    Vào lớp học
                  </Link>
                  <Link
                    to="/homework"
                    className="flex items-center gap-1.5 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2 text-label-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <BookOpen className="h-4 w-4" strokeWidth={2} />
                    Syllabus
                  </Link>
                </div>
              </div>

              {/* Schedule and Instructors */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Schedule */}
                <div className="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/60 space-y-1">
                  <div className="flex items-center gap-2 text-label-sm font-semibold text-secondary">
                    <Calendar className="h-4 w-4 text-primary" />
                    Lịch học định kỳ
                  </div>
                  <p className="text-body-md font-bold text-on-surface pt-1">
                    {profile.enrolledCourse.schedule}
                  </p>
                </div>

                {/* Lead Instructor */}
                <div className="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/60 space-y-1">
                  <div className="flex items-center gap-2 text-label-sm font-semibold text-secondary">
                    <UserCheck className="h-4 w-4 text-primary" />
                    Giảng viên phụ trách
                  </div>
                  <p className="text-body-md font-bold text-on-surface pt-1">
                    {profile.enrolledCourse.leadInstructor.name}
                  </p>
                  <p className="text-[11px] text-secondary">
                    {profile.enrolledCourse.leadInstructor.role}
                  </p>
                </div>

                {/* TA */}
                <div className="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/60 space-y-1">
                  <div className="flex items-center gap-2 text-label-sm font-semibold text-secondary">
                    <Clock className="h-4 w-4 text-primary" />
                    Trợ giảng lớp
                  </div>
                  <p className="text-body-md font-bold text-on-surface pt-1">
                    {profile.enrolledCourse.teachingAssistant.name}
                  </p>
                  <p className="text-[11px] text-secondary">
                    {profile.enrolledCourse.teachingAssistant.role}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="rounded-xl bg-surface-container-lowest p-4 border border-outline-variant/60 space-y-2">
                <div className="flex items-center justify-between text-body-sm font-medium">
                  <span className="text-on-surface">Tiến độ hoàn thành khóa học</span>
                  <span className="font-bold text-primary">
                    {profile.enrolledCourse.completedSessions} /{' '}
                    {profile.enrolledCourse.totalSessions} buổi (
                    {Math.round(
                      (profile.enrolledCourse.completedSessions /
                        profile.enrolledCourse.totalSessions) *
                        100,
                    )}
                    %)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
