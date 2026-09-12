import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { ArrowLeft, List, X, Loader2, AlertCircle } from 'lucide-react'
import { VocabCollector } from '@/shared/components/VocabCollector'

// 🚀 Vite 5 Web Worker Setup — High Performance Local Worker
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
}

export interface PdfMaterialViewerProps {
  url: string
  title: string
  subtitle?: string
  studentInfo?: {
    name: string
    phone: string
  }
  onClose?: () => void
  className?: string
}

/**
 * PdfMaterialViewer — Standard Neutral PDF Viewer with:
 * - Neutral bottom page switcher bar
 * - Right-side collapsible table of contents (Mục lục)
 * - Pure standard reader aesthetics without system design branding
 */
export const PdfMaterialViewer: React.FC<PdfMaterialViewerProps> = ({
  url,
  title,
  subtitle,
  onClose,
  className = '',
}) => {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [showToc, setShowToc] = useState<boolean>(false)
  const [containerWidth, setContainerWidth] = useState<number>(850)
  const mainContentRef = useRef<HTMLDivElement>(null)

  // Responsive page width
  useEffect(() => {
    const updateWidth = () => {
      if (mainContentRef.current) {
        setContainerWidth(Math.min(mainContentRef.current.clientWidth - 48, 900))
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [showToc])

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
  }

  // Smooth scroll to target page
  const scrollToPage = useCallback((targetPage: number) => {
    const el = document.getElementById(`pdf-page-${targetPage}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setPageNumber(targetPage)
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        setPageNumber((prev) => {
          const target = Math.max(prev - 1, 1)
          scrollToPage(target)
          return target
        })
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault()
        setPageNumber((prev) => {
          const target = numPages ? Math.min(prev + 1, numPages) : prev
          scrollToPage(target)
          return target
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [numPages, scrollToPage])

  // Scroll spy observer: tracks which page is in viewport
  useEffect(() => {
    if (!numPages || !mainContentRef.current) return

    const root = mainContentRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) {
          visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
          const pgAttr = visible[0].target.getAttribute('data-page-number')
          if (pgAttr) {
            const pg = parseInt(pgAttr, 10)
            if (!isNaN(pg)) {
              setPageNumber(pg)
            }
          }
        }
      },
      {
        root,
        threshold: [0.2, 0.5, 0.8],
      },
    )

    const pageElements = root.querySelectorAll('.pdf-page-container')
    pageElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
    }
  }, [numPages, showToc])

  return (
    <div
      className={`flex h-full w-full flex-col overflow-hidden bg-neutral-200 font-sans antialiased text-neutral-900 ${className}`}
    >
      {/* ── Top Bar ──────────────────────────────────────────────── */}
      <header className="flex items-center justify-between border-b border-neutral-300 bg-white px-4 py-2.5 z-20">
        <div className="flex items-center gap-3 min-w-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 rounded border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại</span>
            </button>
          )}

          {/* Toggle Mục lục (Bên trái) */}
          <button
            type="button"
            onClick={() => setShowToc(!showToc)}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium border transition-colors ${
              showToc
                ? 'bg-neutral-800 text-white border-neutral-800'
                : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
            }`}
            title="Mục lục"
          >
            <List className="h-4 w-4" />
            <span>Mục lục</span>
          </button>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-neutral-900 leading-tight">
              {title}
            </h3>
            {subtitle && <p className="truncate text-[11px] text-neutral-500">{subtitle}</p>}
          </div>
        </div>

        {numPages > 0 && <div className="text-xs font-mono text-neutral-500">{numPages} trang</div>}
      </header>

      {/* ── Workspace: Left Collapsible TOC + Main Canvas ─────────── */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* ── Collapsible Left-Side TOC (Mục lục ở bên trái) ──────── */}
        {showToc && (
          <aside className="w-64 shrink-0 overflow-y-auto border-r border-neutral-300 bg-white p-3 flex flex-col gap-2 select-none shadow-md z-20">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Mục lục ({numPages} trang)
              </span>
              <button
                type="button"
                onClick={() => setShowToc(false)}
                className="p-1 rounded hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800"
                title="Đóng mục lục"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 overflow-y-auto pt-1">
              {Array.from({ length: numPages || 1 }, (_, index) => {
                const targetPage = index + 1
                const isActive = pageNumber === targetPage

                return (
                  <button
                    key={`toc_page_${targetPage}`}
                    type="button"
                    onClick={() => scrollToPage(targetPage)}
                    className={`flex flex-col items-center rounded border p-2 text-left transition-colors ${
                      isActive
                        ? 'border-neutral-800 bg-neutral-100 font-semibold text-neutral-900'
                        : 'border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <div className="relative overflow-hidden rounded border border-neutral-200 bg-white">
                      <Document file={url}>
                        <Page
                          pageNumber={targetPage}
                          width={140}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </div>
                    <span className="mt-1.5 text-[11px]">Trang {targetPage}</span>
                  </button>
                )
              })}
            </div>
          </aside>
        )}

        {/* Main Reading Canvas */}
        <main
          ref={mainContentRef}
          className="relative flex-1 overflow-auto bg-neutral-200/80 p-4 sm:p-6 flex flex-col items-center custom-scrollbar select-text"
        >
          <VocabCollector containerRef={mainContentRef} sourceTitle={title} sourceSkill="reading" />

          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex h-96 flex-col items-center justify-center gap-3 text-neutral-500">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-700" />
                <span className="text-xs font-medium">Đang tải PDF...</span>
              </div>
            }
            error={
              <div className="flex h-96 flex-col items-center justify-center gap-2 text-rose-600">
                <AlertCircle className="h-8 w-8" />
                <span className="text-sm font-medium">
                  Không thể tải tệp PDF. Vui lòng thử lại sau!
                </span>
              </div>
            }
          >
            <div className="flex flex-col items-center gap-6 pb-12">
              {Array.from({ length: numPages || 1 }, (_, index) => {
                const pg = index + 1
                return (
                  <div
                    key={`page_${pg}`}
                    id={`pdf-page-${pg}`}
                    data-page-number={pg}
                    className="pdf-page-container overflow-hidden rounded bg-white shadow-md border border-neutral-300"
                  >
                    <Page
                      pageNumber={pg}
                      width={containerWidth}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  </div>
                )
              })}
            </div>
          </Document>
        </main>
      </div>
    </div>
  )
}

export default PdfMaterialViewer
