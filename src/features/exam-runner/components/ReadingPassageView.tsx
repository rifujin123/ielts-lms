import React, { useState, useRef } from 'react'
import { Highlighter, Trash2, Bookmark } from 'lucide-react'
import { useIeltsExamStore } from '../store/ieltsExamStore'
import { useFullExamStore } from '../store/fullExamStore'
import { toast } from '@/shared/components/Toast/toastStore'

export const ReadingPassageView: React.FC = () => {
  const { manifest, activePassageId, fontSizeScale, highlights, addHighlight, removeHighlight } =
    useIeltsExamStore()
  const { examMode } = useFullExamStore()

  const passage = manifest.passages.find((p) => p.id === activePassageId)
  const passageRef = useRef<HTMLDivElement>(null)

  // Floating toolbar state
  const [selectedText, setSelectedText] = useState<string>('')
  const [toolbarPos, setToolbarPos] = useState<{ x: number; y: number } | null>(null)

  const handleMouseUp = () => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setToolbarPos(null)
      setSelectedText('')
      return
    }

    const text = selection.toString().trim()
    if (text.length > 2) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      // Position toolbar right above selection
      setToolbarPos({
        x: Math.max(10, rect.left + rect.width / 2 - 80),
        y: Math.max(10, rect.top + window.scrollY - 45),
      })
      setSelectedText(text)
    } else {
      setToolbarPos(null)
      setSelectedText('')
    }
  }

  const handleApplyHighlight = (color: 'yellow' | 'emerald') => {
    if (!selectedText) return
    addHighlight({
      passageId: activePassageId,
      text: selectedText,
      color,
    })
    window.getSelection()?.removeAllRanges()
    setToolbarPos(null)
    setSelectedText('')
  }

  const currentPassageHighlights = highlights.filter((h) => h.passageId === activePassageId)

  const fontClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-[15px] leading-relaxed',
    lg: 'text-base leading-loose',
  }[fontSizeScale]

  if (!passage) return null

  return (
    <div
      ref={passageRef}
      onMouseUp={handleMouseUp}
      onCopy={(e) => {
        if (examMode === 'STRICT') {
          e.preventDefault()
          toast.warning('Chế độ Thi Thật: Sao chép văn bản bị khóa', {
            description:
              'Để đảm bảo tính trung thực của kỳ thi, vui lòng không sao chép văn bản bài đọc ra ngoài.',
          })
        }
      }}
      className="relative h-full overflow-y-auto bg-slate-50/70 p-6 md:p-8 font-serif"
    >
      {/* ── Floating Highlight Toolbar ────────────────────────────── */}
      {toolbarPos && (
        <div
          style={{
            position: 'fixed',
            left: `${toolbarPos.x}px`,
            top: `${toolbarPos.y}px`,
          }}
          className="z-50 animate-pop-in flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 shadow-xl ring-1 ring-white/20"
        >
          <span className="text-[11px] font-sans font-medium text-slate-300 mr-1">Đánh dấu:</span>
          <button
            type="button"
            onClick={() => handleApplyHighlight('yellow')}
            title="Đánh dấu màu vàng"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-300 hover:scale-110 transition-transform shadow-xs"
          />
          <button
            type="button"
            onClick={() => handleApplyHighlight('emerald')}
            title="Đánh dấu màu xanh"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 hover:scale-110 transition-transform shadow-xs"
          />
        </div>
      )}

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
            <p className="flex-1 text-justify">{p.text}</p>
          </div>
        ))}
      </div>

      {/* ── Bottom: Active Highlights Drawer ──────────────────────── */}
      {currentPassageHighlights.length > 0 && (
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-4 font-sans shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Highlighter className="h-4 w-4 text-amber-500" />
              <span>Ghi chú đánh dấu trong bài ({currentPassageHighlights.length})</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {currentPassageHighlights.map((hl) => (
              <div
                key={hl.id}
                className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 p-2 text-xs"
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      hl.color === 'yellow' ? 'bg-yellow-400' : 'bg-emerald-400'
                    }`}
                  />
                  <span className="italic text-slate-700 line-clamp-2">
                    &ldquo;{hl.text}&rdquo;
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeHighlight(hl.id)}
                  title="Xóa đánh dấu"
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
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
        <span>Mẹo: Bôi đen bất kỳ đoạn văn bản nào để mở công cụ đánh dấu màu</span>
      </div>
    </div>
  )
}
