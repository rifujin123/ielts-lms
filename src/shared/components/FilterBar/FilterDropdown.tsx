import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface FilterOption<T extends string = string> {
  value: T
  label: string
}

export interface FilterDropdownProps<T extends string = string> {
  label: string
  value: T
  options: FilterOption<T>[]
  onChange: (value: T) => void
  className?: string
}

export function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  className = '',
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedLabel = options.find((opt) => opt.value === value)?.label || label

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn-interactive flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-transparent bg-slate-100/90 px-4 text-body-sm font-medium text-slate-700 transition-colors hover:bg-slate-200/70"
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform duration-150 ${
            isOpen ? 'rotate-180' : ''
          }`}
          strokeWidth={2}
        />
      </button>

      {isOpen && (
        <div className="animate-pop-in absolute right-0 top-full z-20 mt-1.5 w-44 rounded-xl border border-outline-variant bg-surface-container-lowest py-1.5 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value)
                setIsOpen(false)
              }}
              className={`flex w-full cursor-pointer items-center justify-between px-3.5 py-2 text-left text-body-sm transition-colors ${
                opt.value === value
                  ? 'bg-surface-container text-on-surface font-bold'
                  : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterDropdown
