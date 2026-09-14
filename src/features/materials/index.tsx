import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight, BookOpen } from 'lucide-react'
import { materialService } from '@/services/materialService'
import { booksMock } from '@/mocks/books.mock'
import { queryKeys } from '@/lib/queryKeys'

/**
 * MaterialsPage — Course Materials & Textbooks (screen 05).
 * Lists all course textbooks, supplementary handouts, and unit guides.
 * Line count budget: 200-300 lines.
 */
export const MaterialsPage: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'main' | 'supplementary'>('all')

  const { data: books = booksMock, isLoading: _isLoading } = useQuery({
    queryKey: queryKeys.materials.books(),
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
            Tài liệu độc quyền từ IELTS Hồ Thành, được phân loại theo từng kỹ năng và giai đoạn học.
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
            className={`animate-fade-in-up stagger-${(idx % 4) + 1} card-interactive group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-outline-variant bg-cover bg-center p-6 shadow-md transition-all`}
            style={{
              backgroundImage: `url(${book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80'})`,
            }}
          >
            {/* Ultra-sheer transparent gradient overlay allowing the book cover background to show directly */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />

            {/* Card Content */}
            <div className="relative z-10 flex flex-col justify-between h-full min-h-[200px]">
              <div>
                <span className="animate-pop-in inline-block rounded-full bg-black/25 backdrop-blur-sm px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider border border-white/20 shadow-xs">
                  {book.type === 'main' ? 'Giáo trình chính khóa' : 'Tài liệu bổ trợ'}
                </span>
                <h3 className="mt-3 text-headline-sm font-bold text-white leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  {book.title}
                </h3>
                <p className="mt-1 text-body-sm text-white/90 leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  {book.subtitle}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4">
                <span className="text-xs text-white/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {book.totalPages ? `${book.totalPages} trang tài liệu` : 'Định dạng PDF'}
                </span>
                <Link
                  to={`/materials/reader?bookId=${book.id}`}
                  className="btn-interactive inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-label-sm font-semibold text-on-primary hover:bg-primary-hover transition-colors shadow-xs"
                >
                  <BookOpen className="h-4 w-4 text-amber-300" strokeWidth={2} />
                  <span>Đọc PDF</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { BooksPage } from './BooksPage'
export { PdfReaderPage } from './PdfReaderPage'
export { PdfMaterialViewer } from './components/PdfMaterialViewer'
export default MaterialsPage
