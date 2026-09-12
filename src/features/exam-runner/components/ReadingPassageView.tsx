import React, { useState, useRef } from 'react'
import { Highlighter, BookmarkPlus, Trash2, Bookmark } from 'lucide-react'
import { useIeltsExamStore } from '../store/ieltsExamStore'
import { useFullExamStore } from '../store/fullExamStore'
import { toast } from '@/shared/components/Toast/toastStore'
import { VocabFloatingTooltip } from '@/shared/components/VocabCollector'

export const ReadingPassageView: React.FC = () => {
  const { manifest, activePassageId, fontSizeScale, highlights, addHighlight, removeHighlight } =
    useIeltsExamStore()
  const { examMode, isSubmitted } = useFullExamStore()

  const passage = manifest.passages.find((p) => p.id === activePassageId)
  const passageRef = useRef<HTMLDivElement>(null)

  // Floating toolbar state
  const [selectedText, setSelectedText] = useState<string>('')
  const [contextSentence, setContextSentence] = useState<string>('')
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null)
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null)
  const [isVocabTooltipOpen, setIsVocabTooltipOpen] = useState(false)

  const handleMouseUp = () => {
    if (isVocabTooltipOpen) return

    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setToolbarPos(null)
      setSelectedText('')
      return
    }

    const text = selection.toString().trim()
    if (text.length >= 2) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Trích xuất cả câu chứa từ vựng cho ngữ cảnh học thuật
      const fullText = range.startContainer.textContent || ''
      let sentence = text
      if (fullText) {
        const start = Math.max(0, fullText.lastIndexOf('.', range.startOffset) + 1)
        let end = fullText.indexOf('.', range.endOffset)
        if (end === -1) end = fullText.length
        sentence = fullText.slice(start, end).trim()
      }

      setSelectionRect(rect)
      setContextSentence(sentence)
      setSelectedText(text)

      // Tính toán tọa độ hiển thị toolbar chính xác theo viewport (fixed)
      // Không cộng window.scrollY để tránh lệch khi cuộn trang
      const tbWidth = 340
      const tbHeight = 44
      let left = rect.left + rect.width / 2 - tbWidth / 2
      left = Math.max(12, Math.min(window.innerWidth - tbWidth - 12, left))

      // Nếu gần mép trên (dưới sticky header), hiển thị thanh phía dưới vùng chọn
      let top = rect.top - tbHeight - 8
      if (top < 68) {
        top = rect.bottom + 8
      }

      setToolbarPos({ x: left, y: top })
    } else {
      setToolbarPos(null)
      setSelectedText('')
    }
  }

  // Highlight màu vàng chuẩn thi IELTS
  const handleApplyHighlight = () => {
    if (!selectedText) return
    addHighlight({
      passageId: activePassageId,
      text: selectedText,
      color: 'yellow',
    })
    window.getSelection()?.removeAllRanges()
    setToolbarPos(null)
    setSelectedText('')
    toast.success('Đã highlight đoạn văn bản', { duration: 1500 })
  }

  // Mở popup Lưu vào sổ từ vựng của tôi
  const handleOpenVocabLookup = () => {
    setToolbarPos(null)
    setIsVocabTooltipOpen(true)
  }

  const currentPassageHighlights = highlights.filter((h) => h.passageId === activePassageId)

  const fontClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-[15px] leading-relaxed',
    lg: 'text-base leading-loose',
  }[fontSizeScale]

  // Render paragraph text with yellow IELTS highlights
  const renderHighlightedParagraph = (paragraphText: string) => {
    if (currentPassageHighlights.length === 0) return paragraphText

    const matchingHls = currentPassageHighlights.filter((h) =>
      paragraphText.toLowerCase().includes(h.text.toLowerCase()),
    )
    if (matchingHls.length === 0) return paragraphText

    const escaped = matchingHls.map((h) => h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
    const regex = new RegExp(`(${escaped})`, 'gi')
    const parts = paragraphText.split(regex)

    return parts.map((part, idx) => {
      const isHl = matchingHls.find((h) => h.text.toLowerCase() === part.toLowerCase())
      if (isHl) {
        return (
          <mark
            key={idx}
            onClick={(e) => {
              e.stopPropagation()
              removeHighlight(isHl.id)
              toast.info('Đã xóa highlight', { duration: 1500 })
            }}
            title="Bấm để xóa highlight này"
            className="bg-yellow-200/90 hover:bg-yellow-300 text-yellow-950 border-b border-yellow-400/80 px-0.5 rounded-xs not-italic font-medium cursor-pointer transition-colors"
          >
            {part}
          </mark>
        )
      }
      return part
    })
  }

  if (!passage) return null

  return (
    <div
      ref={passageRef}
      onMouseUp={handleMouseUp}
      onCopy={(e) => {
        if (examMode === 'STRICT' && !isSubmitted) {
          e.preventDefault()
          toast.warning('Chế độ Thi Thật: Sao chép văn bản bị khóa', {
            description:
              'Để đảm bảo tính trung thực của kỳ thi, vui lòng không sao chép văn bản bài đọc ra ngoài.',
          })
        }
      }}
      className="relative h-full overflow-y-auto bg-slate-50/70 p-6 md:p-8 font-serif select-text"
    >
      {/* ── Floating Selection Toolbar (Lưu vào sổ từ vựng của tôi & Highlight) ── */}
      {toolbarPos && (
        <div
          style={{
            position: 'fixed',
            left: `${toolbarPos.x}px`,
            top: `${toolbarPos.y}px`,
          }}
          onMouseDown={(e) => e.preventDefault()}
          className="z-50 animate-pop-in font-sans antialiased flex items-center gap-1 rounded-full border border-slate-200/90 bg-white p-1 shadow-lg shadow-slate-900/10 text-xs font-semibold select-none"
        >
          {/* Nút 1: Lưu vào sổ từ vựng của tôi (nền trắng bình thường) */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleOpenVocabLookup}
            title="Lưu từ vựng vào sổ từ cá nhân của tôi"
            className="btn-interactive flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-3 py-1.5 transition-colors"
          >
            <BookmarkPlus className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} />
            <span>Lưu vào sổ từ vựng của tôi</span>
          </button>

          <div className="h-3.5 w-px bg-slate-200" />

          {/* Nút 2: Highlight (nền trắng bình thường, chữ Highlight) */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleApplyHighlight}
            title="Highlight đoạn văn bản"
            className="btn-interactive flex items-center gap-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 px-3 py-1.5 transition-colors"
          >
            <Highlighter className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.75} />
            <span>Highlight</span>
          </button>
        </div>
      )}

      {/* ── Contextual Vocab Floating Tooltip ─────────────────────── */}
      <VocabFloatingTooltip
        selectedText={selectedText}
        contextSentence={contextSentence}
        rect={selectionRect}
        isOpen={isVocabTooltipOpen}
        onClose={() => {
          setIsVocabTooltipOpen(false)
          setSelectedText('')
          window.getSelection()?.removeAllRanges()
        }}
        sourceTitle={`Passage ${passage.id}: ${passage.title}`}
        sourceSkill="reading"
      />

      {/* ── Passage Title & Subtitle ──────────────────────────────── */}
      <div className="mb-6 border-b border-slate-200 pb-5 font-sans">
        <div className="inline-flex items-center gap-2 rounded-md bg-slate-200/80 px-2.5 py-1 text-xs font-bold text-slate-700 uppercase tracking-wider">
          READING PASSAGE {passage.id}
        </div>
        <h2 className="mt-2 text-2xl font-bold text-slate-900 tracking-tight font-serif">
          {passage.title}
        </h2>
        {passage.subtitle && (
          <p className="mt-1 text-sm italic text-slate-600 font-sans">{passage.subtitle}</p>
        )}
      </div>

      {/* ── Passage Paragraphs ─────────────────────────────────────── */}
      <div className={`space-y-5 text-slate-800 ${fontClasses}`}>
        {passage.contentParagraphs.map((p, idx) => (
          <div key={idx} className="group relative flex items-start gap-3">
            {p.label && (
              <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-md bg-slate-200/90 text-xs font-bold font-sans text-slate-900 select-none shadow-2xs">
                {p.label}
              </span>
            )}
            <p className="flex-1 text-justify">{renderHighlightedParagraph(p.text)}</p>
          </div>
        ))}
      </div>

      {/* ── Bottom: Active Highlights Drawer ──────────────────────── */}
      {currentPassageHighlights.length > 0 && (
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-4 font-sans shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Highlighter className="h-4 w-4 text-slate-600" />
              <span>Ghi chú đánh dấu trong bài ({currentPassageHighlights.length})</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {currentPassageHighlights.map((hl) => (
              <div
                key={hl.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-200/80 bg-slate-50/70 p-2 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                  <span className="text-slate-800 font-medium line-clamp-2">
                    &ldquo;{hl.text}&rdquo;
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeHighlight(hl.id)}
                  title="Xóa đánh dấu"
                  className="btn-interactive text-slate-400 hover:text-slate-700 transition-colors p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtle guide hint */}
      <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-sans text-slate-400">
        <Bookmark className="h-3.5 w-3.5" />
        <span>Mẹo: Bôi đen từ vựng để lưu vào sổ từ vựng của tôi hoặc highlight màu vàng</span>
      </div>
    </div>
  )
}
