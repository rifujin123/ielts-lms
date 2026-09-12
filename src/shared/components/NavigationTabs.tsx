import type React from 'react'
import type { LucideIcon } from 'lucide-react'

export interface TabItem<T extends string = string> {
  id: T
  label: string
  icon?: LucideIcon
  count?: number | string
}

export interface NavigationTabsProps<T extends string = string> {
  tabs: TabItem<T>[]
  activeTab: T
  onChange: (tabId: T) => void
  className?: string
}

export function NavigationTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className = '',
}: NavigationTabsProps<T>): React.ReactElement {
  return (
    <div
      className={`flex overflow-x-auto rounded-xl border-b border-outline-variant bg-surface-container-lowest px-4 ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        const Icon = tab.icon

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`btn-interactive -mb-px flex cursor-pointer items-center gap-2 border-b-2 px-5 py-3.5 text-label-md transition-colors duration-150 whitespace-nowrap ${
              isActive
                ? 'border-primary font-bold text-primary'
                : 'border-transparent font-medium text-secondary hover:text-on-surface'
            }`}
          >
            {Icon && <Icon className="h-4 w-4" strokeWidth={isActive ? 2.2 : 1.75} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[11px] font-mono leading-none ${
                  isActive
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'bg-surface-container-high text-secondary'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default NavigationTabs
