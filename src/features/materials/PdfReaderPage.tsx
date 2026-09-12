import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { materialService } from '@/services/materialService'
import { booksMock } from '@/mocks/books.mock'
import { PdfMaterialViewer } from './components/PdfMaterialViewer'

export const PdfReaderPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const bookId = searchParams.get('bookId') || 'BOOK-01'

  const { data: books = booksMock } = useQuery({
    queryKey: ['course-books'],
    queryFn: () => materialService.getBooks(),
  })

  const currentBook = books.find((b) => b.id === bookId) || books[0] || booksMock[0]

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100">
      <PdfMaterialViewer
        url={currentBook.pdfUrl || '/sample-ielts-material.pdf'}
        title={currentBook.title}
        subtitle={currentBook.subtitle}
        onClose={() => navigate(-1)}
        className="h-full w-full rounded-none border-0"
      />
    </div>
  )
}

export default PdfReaderPage
