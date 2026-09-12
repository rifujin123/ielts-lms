import React from 'react'
import { Search, X } from 'lucide-react'

export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  onClear?: () => void
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className = '',
  onClear,
}) => {
  return (
    <div className={`relative flex-1 ${className}`}>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary"
        strokeWidth={2}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-transparent bg-slate-100/90 pl-10 pr-9 text-body-sm text-on-surface placeholder:text-secondary/60 transition-all shadow-2xs hover:bg-slate-100 focus:border-outline-variant focus:bg-surface-container-lowest focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('')
            onClear?.()
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
          aria-label="Xóa tìm kiếm"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      )}
    </div>
  )
}

export default SearchInput
