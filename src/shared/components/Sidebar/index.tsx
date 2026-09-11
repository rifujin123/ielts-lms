import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface NavItemDef {
  label: string
  to: string
  icon: string
  badge?: string
}

interface NavGroupDef {
  title?: string
  items: NavItemDef[]
}

const navGroups: NavGroupDef[] = [
  {
    title: 'TỔNG QUAN',
    items: [
      { label: 'Overview', to: '/dashboard', icon: 'dashboard' },
      { label: 'Syllabus & Bài học', to: '/homework', icon: 'menu_book' },
      { label: 'Điểm danh & Buổi học', to: '/attendance', icon: 'calendar_month' },
    ],
  },
  {
    title: 'BÀI TẬP TRONG KHOÁ',
    items: [
      { label: 'Online tests', to: '/tests', icon: 'quiz' },
      { label: 'Vocabulary', to: '/vocabulary', icon: 'translate' },
      { label: 'Exercises', to: '/exercises', icon: 'edit_note' },
      { label: 'Roadmap cá nhân hóa', to: '/roadmap/personal', icon: 'alt_route' },
      { label: 'Luyện tập tương tác', to: '/practice', icon: 'headphones' },
    ],
  },
  {
    title: 'THỐNG KÊ & THÔNG TIN',
    items: [
      { label: 'Final Test', to: '/final-test', icon: 'assignment_turned_in' },
      { label: 'Tài liệu & Sách', to: '/materials', icon: 'library_books' },
      { label: 'Lớp học trực tuyến', to: '/classroom', icon: 'school' },
      { label: 'Thông tin khóa học', to: '/', icon: 'info' },
    ],
  },
]

export interface SidebarProps {
  className?: string
  onItemClick?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onItemClick }) => {
  return (
    <aside
      className={cn(
        'custom-scrollbar flex w-56 flex-col border-r border-outline-variant bg-surface-container-lowest py-3.5 text-on-surface select-none overflow-y-auto',
        className,
      )}
    >
      <nav className="flex flex-col gap-5 px-2.5">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="flex flex-col gap-0.5">
            {group.title && (
              <h4 className="px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-secondary/70">
                {group.title}
              </h4>
            )}
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onItemClick}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-2.5 rounded-full px-3 py-2 text-body-sm transition-all duration-200 ease-out',
                    isActive
                      ? 'bg-red-50 text-primary font-bold shadow-xs ring-1 ring-primary/20 scale-[1.01]'
                      : 'text-secondary hover:bg-surface-container-low hover:text-on-surface hover:translate-x-0.5',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'material-symbols-outlined text-[20px] transition-transform duration-200',
                        isActive
                          ? 'text-primary scale-110'
                          : 'text-secondary group-hover:text-on-surface',
                      )}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate flex-1 text-[13px]">{item.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pop-in shrink-0" />
                    )}
                    {item.badge && (
                      <span className="rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-bold text-on-primary-container animate-pop-in">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Support box at bottom */}
      <div className="mt-auto px-3 pt-6">
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3.5">
          <div className="flex items-center gap-2 text-label-md font-semibold text-on-surface">
            <span className="material-symbols-outlined text-primary text-lg">support_agent</span>
            Hỗ trợ học vụ
          </div>
          <p className="mt-1 text-body-sm text-secondary leading-snug">
            Cần hỗ trợ về lịch học hoặc bài tập? Liên hệ ban học vụ DOL.
          </p>
          <a
            href="https://zalo.me/g/dol-ielts-65"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant py-1.5 text-label-sm font-semibold text-on-surface hover:bg-surface-container"
          >
            Nhóm Zalo lớp
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
