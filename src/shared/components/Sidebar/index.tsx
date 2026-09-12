import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  FileCheck,
  Languages,
  PenLine,
  Route,
  Award,
  Library,
  Video,
  Info,
  Headset,
  Film,
  ExternalLink,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItemDef {
  label: string
  to: string
  icon: LucideIcon
  badge?: string
}

interface NavGroupDef {
  title?: string
  items: NavItemDef[]
}

const navGroups: NavGroupDef[] = [
  {
    title: 'GENERAL',
    items: [
      { label: 'Overview', to: '/dashboard', icon: LayoutDashboard },
      { label: 'Syllabus', to: '/homework', icon: BookOpen },
      { label: 'Attendance', to: '/attendance', icon: CalendarDays },
    ],
  },
  {
    title: 'PRACTICE',
    items: [
      { label: 'Mock Tests', to: '/tests', icon: FileCheck },
      { label: 'Vocabulary', to: '/vocabulary', icon: Languages },
      { label: 'Dictation', to: '/topics', icon: Film },
      { label: 'Exercises', to: '/exercises', icon: PenLine },
      { label: 'Study Roadmap', to: '/roadmap/personal', icon: Route },
      { label: 'Error Log', to: '/error-log', icon: AlertTriangle },
    ],
  },
  {
    title: 'RESOURCES & INFO',
    items: [
      { label: 'Final Assessment', to: '/final-test', icon: Award },
      { label: 'Course Materials', to: '/materials', icon: Library },
      { label: 'Virtual Class', to: '/classroom', icon: Video },
      { label: 'Course Info', to: '/', icon: Info },
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
                    'group relative flex items-center gap-2.5 rounded-full px-3 py-2 text-body-sm transition-all duration-200 ease-out border border-l-4',
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-bold shadow-xs border-slate-200 border-l-slate-900 scale-[1.01]'
                      : 'border-transparent text-secondary hover:bg-surface-container-low hover:text-on-surface hover:translate-x-0.5',
                  )
                }
              >
                {({ isActive }) => {
                  const Icon = item.icon
                  return (
                    <>
                      <Icon
                        className={cn(
                          'h-[18px] w-[18px] shrink-0 transition-transform duration-200',
                          isActive
                            ? 'text-slate-900 scale-110'
                            : 'text-secondary group-hover:text-on-surface',
                        )}
                        strokeWidth={isActive ? 2.2 : 1.75}
                      />
                      <span className="truncate flex-1 text-[13px]">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs animate-pop-in">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )
                }}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Support box at bottom */}
      <div className="mt-auto px-3 pt-6">
        <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3.5">
          <div className="flex items-center gap-2 text-label-md font-semibold text-on-surface">
            <Headset className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
            Hỗ trợ học vụ
          </div>
          <p className="mt-1 text-body-sm text-secondary leading-snug">
            Cần hỗ trợ về lịch học hoặc bài tập? Liên hệ ban học vụ IELTS Hồ Thành.
          </p>
          <a
            href="https://zalo.me/g/ielts-hothanh-65"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant py-1.5 text-label-sm font-semibold text-on-surface hover:bg-surface-container"
          >
            Nhóm Zalo lớp
            <ExternalLink className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          </a>
        </div>
      </div>
    </aside>
  )
}
