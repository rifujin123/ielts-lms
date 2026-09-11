import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, BookMarked } from 'lucide-react'
import { materialService } from '@/services/materialService'
import { booksMock } from '@/mocks/books.mock'

/**
 * MaterialsPage — Course Materials & Textbooks (screen 05).
 * Lists all course textbooks, supplementary handouts, and unit guides.
 * Line count budget: 200-300 lines.
 */
export const MaterialsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'main' | 'supplementary'>('all')

  const { data: books = booksMock, isLoading: _isLoading } = useQuery({
    queryKey: ['course-books'],
    queryFn: () => materialService.getBooks(),
  })

  // ⏸️ Skip spinner for now:
  // if (_isLoading) return <PageLoader />

  const filteredBooks = (books ?? []).filter((book) =>
    filterType === 'all' ? true : book.type === filterType,
  )

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
            <span className="font-semibold text-on-surface">Tài liệu học tập</span>
          </nav>
          <h1 className="mt-1 text-headline-lg font-bold text-on-surface">Giáo trình & Tài liệu</h1>
          <p className="text-body-sm text-secondary">
            Tài liệu độc quyền từ DOL English, được phân loại theo từng kỹ năng và giai đoạn học.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 rounded-xl bg-surface-container-low p-1 border border-outline-variant">
          {(['all', 'main', 'supplementary'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`btn-interactive rounded-lg px-3 py-1.5 text-label-sm font-semibold transition-colors ${
                filterType === type
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              {type === 'all' && 'Tất cả'}
              {type === 'main' && 'Giáo trình chính'}
              {type === 'supplementary' && 'Tài liệu bổ trợ'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Book Cards Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredBooks.map((book, idx) => (
          <div
            key={book.id}
            className={`animate-fade-in-up stagger-${(idx % 4) + 1} card-interactive flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-xs transition-colors`}
          >
            <div>
              <div className="flex items-start gap-4">
                {/* Book cover visual with embedded image */}
                <div
                  className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container bg-cover bg-center shadow-sm"
                  style={{
                    backgroundImage: `url(${book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'})`,
                    backgroundColor: book.coverColor,
                  }}
                  aria-label={book.title}
                >
                  {/* Academic book spine accent on the left */}
                  <div className="absolute inset-y-0 left-0 w-1.5 bg-black/25" />
                  {/* Subtle gloss and depth overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-white/10 pointer-events-none" />
                </div>

                <div className="flex-1">
                  <span className="animate-pop-in rounded bg-surface-container px-2 py-0.5 text-[11px] font-bold text-secondary uppercase">
                    {book.type === 'main' ? 'Giáo trình chính khóa' : 'Tài liệu bổ trợ'}
                  </span>
                  <h3 className="mt-1 text-headline-sm font-bold text-on-surface leading-snug">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-body-sm text-secondary">{book.subtitle}</p>
                </div>
              </div>

              {/* Units summary */}
              <div className="mt-5 rounded-xl border border-outline-variant bg-surface-container-low p-3">
                <div className="flex items-center justify-between text-label-sm font-semibold text-on-surface">
                  <span>Cấu trúc giáo trình:</span>
                  <span className="text-primary">{book.units.length} Units học phần</span>
                </div>
                <div className="mt-2 flex flex-col gap-1.5">
                  {book.units.slice(0, 2).map((unit) => (
                    <div
                      key={unit.id}
                      className="flex items-center gap-2 text-body-sm text-secondary truncate"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-secondary/50" />
                      <span className="truncate">{unit.title}</span>
                    </div>
                  ))}
                  {book.units.length > 2 && (
                    <span className="text-[11px] text-secondary italic">
                      + {book.units.length - 2} Units khác
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-outline-variant pt-4">
              <span className="text-body-sm font-medium text-secondary">Bản quyền DOL English</span>
              <Link
                to="/materials/books"
                className="btn-interactive inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
              >
                <BookMarked className="h-4 w-4" strokeWidth={2} />
                Đọc giáo trình
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MaterialsPage
