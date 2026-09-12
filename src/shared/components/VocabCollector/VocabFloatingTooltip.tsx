import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Volume2, BookmarkPlus, Check, X } from 'lucide-react'
import { toast } from '@/shared/components/Toast/toastStore'
import { personalVocabService } from '@/services/personalVocabService'
import type { WordPartOfSpeech, VocabSourceSkill } from '@/types/personalVocab.types'
import { useTextSelection } from '@/shared/hooks/useTextSelection'

export interface CollectedWordPayload {
  word: string
  phonetic: string
  partOfSpeech: WordPartOfSpeech
  meaning: string
  meaningVi: string
  contextSentence: string
  sourceTitle: string
  createdAt: string
}

export interface VocabFloatingTooltipProps {
  selectedText: string
  contextSentence: string
  rect: DOMRect | null
  x?: number
  y?: number
  isOpen: boolean
  onClose?: () => void
  sourceTitle?: string
  sourceSkill?: VocabSourceSkill
  onSave?: (payload: CollectedWordPayload) => void
  className?: string
}

export interface VocabCollectorProps {
  containerRef?: React.RefObject<HTMLElement | null>
  sourceTitle?: string
  sourceSkill?: VocabSourceSkill
  enabled?: boolean
  onSave?: (payload: CollectedWordPayload) => void
}

/** Pre-curated academic IELTS vocabulary reference dictionary */
interface DictionaryEntry {
  phonetic: string
  partOfSpeech: WordPartOfSpeech
  meaningVi: string
  meaningEn?: string
}

const ACADEMIC_DICTIONARY: Record<string, DictionaryEntry> = {
  indiscriminate: {
    phonetic: '/ˌɪndɪˈskrɪmɪnət/',
    partOfSpeech: 'adjective',
    meaningVi: 'Bừa bãi, không phân biệt, thiếu suy xét (gây hại)',
    meaningEn: 'Done at random or without careful judgement',
  },
  mitigate: {
    phonetic: '/ˈmɪt.ɪ.ɡeɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Làm giảm nhẹ, xoa dịu mức độ nghiêm trọng hay tác hại',
    meaningEn: 'To make something less harmful or severe',
  },
  ephemeral: {
    phonetic: '/ɪˈfem.ər.əl/',
    partOfSpeech: 'adjective',
    meaningVi: 'Phù du, chóng tàn, tồn tại trong thời gian rất ngắn',
    meaningEn: 'Lasting for a very short time',
  },
  ubiquitous: {
    phonetic: '/juːˈbɪk.wɪ.təs/',
    partOfSpeech: 'adjective',
    meaningVi: 'Phổ biến khắp nơi, có mặt ở mọi nơi',
    meaningEn: 'Present, appearing, or found everywhere',
  },
  deteriorate: {
    phonetic: '/dɪˈtɪə.ri.ə.reɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Xuống cấp, xấu đi, suy giảm trầm trọng',
    meaningEn: 'To become progressively worse',
  },
  proliferation: {
    phonetic: '/prəˌlɪf.əˈreɪ.ʃən/',
    partOfSpeech: 'noun',
    meaningVi: 'Sự gia tăng nhanh chóng về số lượng hoặc quy mô',
    meaningEn: 'Rapid increase in the number or amount of something',
  },
  sustainable: {
    phonetic: '/səˈsteɪ.nə.bəl/',
    partOfSpeech: 'adjective',
    meaningVi: 'Bền vững, có thể duy trì lâu dài',
    meaningEn: 'Able to be maintained at a certain rate or level',
  },
  prevalent: {
    phonetic: '/ˈprev.əl.ənt/',
    partOfSpeech: 'adjective',
    meaningVi: 'Thịnh hành, phổ biến rộng rãi',
    meaningEn: 'Widespread in a particular area at a particular time',
  },
  detrimental: {
    phonetic: '/ˌdet.rɪˈmen.təl/',
    partOfSpeech: 'adjective',
    meaningVi: 'Có hại, gây bất lợi tiêu cực',
    meaningEn: 'Tending to cause harm or damage',
  },
  advocate: {
    phonetic: '/ˈæd.və.keɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Chủ trương, ủng hộ công khai một lập trường',
    meaningEn: 'Publicly recommend or support',
  },
  conducive: {
    phonetic: '/kənˈdʒuː.sɪv/',
    partOfSpeech: 'adjective',
    meaningVi: 'Có lợi, tạo điều kiện thuận lợi cho điều gì',
    meaningEn: 'Making a certain situation or outcome likely or possible',
  },
  feasible: {
    phonetic: '/ˈfiː.zə.bəl/',
    partOfSpeech: 'adjective',
    meaningVi: 'Khả thi, có thể thực hiện thành công',
    meaningEn: 'Possible to do easily or conveniently',
  },
  plausible: {
    phonetic: '/ˈplɔː.zə.bəl/',
    partOfSpeech: 'adjective',
    meaningVi: 'Hợp lý, đáng tin cậy, có cơ sở',
    meaningEn: 'Seeming reasonable or probable',
  },
  lucrative: {
    phonetic: '/ˈluː.krə.tɪv/',
    partOfSpeech: 'adjective',
    meaningVi: 'Sinh lợi cao, đem lại nhiều lợi nhuận',
    meaningEn: 'Producing a great deal of profit',
  },
  inevitable: {
    phonetic: '/ɪnˈev.ɪ.tə.bəl/',
    partOfSpeech: 'adjective',
    meaningVi: 'Không thể tránh khỏi, chắc chắn sẽ xảy ra',
    meaningEn: 'Certain to happen; unavoidable',
  },
  spontaneous: {
    phonetic: '/spɒnˈteɪ.ni.əs/',
    partOfSpeech: 'adjective',
    meaningVi: 'Tự phát, tự nhiên không gượng ép',
    meaningEn: 'Performed or occurring as a result of a sudden impulse',
  },
  unprecedented: {
    phonetic: '/ʌnˈpres.ɪ.den.tɪd/',
    partOfSpeech: 'adjective',
    meaningVi: 'Chưa từng có tiền lệ trong lịch sử',
    meaningEn: 'Never done or known before',
  },
  disseminate: {
    phonetic: '/dɪˈsem.ɪ.neɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Lan truyền, phổ biến thông tin/kiến thức rộng rãi',
    meaningEn: 'Spread or disperse something widely',
  },
  scrutinize: {
    phonetic: '/ˈskruː.tɪ.naɪz/',
    partOfSpeech: 'verb',
    meaningVi: 'Xem xét, kiểm tra kỹ lưỡng tỉ mỉ',
    meaningEn: 'Examine or inspect closely and thoroughly',
  },
  substantiate: {
    phonetic: '/səbˈstæn.ʃi.eɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Chứng minh bằng chứng cứ xác thực',
    meaningEn: 'Provide evidence to support or prove the truth of',
  },
  pragmatic: {
    phonetic: '/præɡˈmæt.ɪk/',
    partOfSpeech: 'adjective',
    meaningVi: 'Thực dụng, mang tính thực tế giải quyết vấn đề',
    meaningEn: 'Dealing with things sensibly and realistically',
  },
  resilience: {
    phonetic: '/rɪˈzɪl.jəns/',
    partOfSpeech: 'noun',
    meaningVi: 'Khả năng phục hồi, kiên cường vượt nghịch cảnh',
    meaningEn: 'The capacity to recover quickly from difficulties',
  },
  alleviate: {
    phonetic: '/əˈliː.vi.eɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Làm nhẹ bớt, giảm cơn đau hoặc gánh nặng',
    meaningEn: 'Make suffering or a deficiency less severe',
  },
  corroborate: {
    phonetic: '/kəˈrɒb.ə.reɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Chứng thực, củng cố thêm độ tin cậy',
    meaningEn: 'Confirm or give support to a statement or theory',
  },
  paramount: {
    phonetic: '/ˈpær.ə.maʊnt/ ',
    partOfSpeech: 'adjective',
    meaningVi: 'Tối quan trọng, có ý nghĩa tối cao',
    meaningEn: 'More important than anything else; supreme',
  },
  discrepancy: {
    phonetic: '/dɪˈskrep.ən.si/',
    partOfSpeech: 'noun',
    meaningVi: 'Sự sai khác, không nhất quán giữa các dữ liệu',
    meaningEn: 'A lack of compatibility or similarity between two facts',
  },
  indispensable: {
    phonetic: '/ˌɪn.dɪˈspen.sə.bəl/',
    partOfSpeech: 'adjective',
    meaningVi: 'Không thể thiếu được, tối cần thiết',
    meaningEn: 'Absolutely necessary',
  },
  pervasive: {
    phonetic: '/pəˈveɪ.sɪv/',
    partOfSpeech: 'adjective',
    meaningVi: 'Lan tỏa khắp nơi, thâm nhập sâu rộng',
    meaningEn: 'Spreading widely throughout an area or group of people',
  },
  viable: {
    phonetic: '/ˈvaɪ.ə.bəl/',
    partOfSpeech: 'adjective',
    meaningVi: 'Khả thi, có khả năng tồn tại và phát triển',
    meaningEn: 'Capable of working successfully; feasible',
  },
  exacerbate: {
    phonetic: '/ɪɡˈzæs.ə.beɪt/',
    partOfSpeech: 'verb',
    meaningVi: 'Làm trầm trọng thêm (tình hình, vấn đề)',
    meaningEn: 'Make a problem or negative feeling worse',
  },
}

/** Infers a fallback part of speech and phonetic for unfamiliar words */
function inferWordDetails(rawWord: string): DictionaryEntry {
  const clean = rawWord.toLowerCase().trim()
  const directMatch = ACADEMIC_DICTIONARY[clean]
  if (directMatch) {
    return directMatch
  }

  // Determine likely part of speech by suffix
  let partOfSpeech: WordPartOfSpeech = 'noun'
  if (/(\b(?:take|make|get|put|run|come|bring|set)\s+\w+)/i.test(clean)) {
    partOfSpeech = 'phrasal_verb'
  } else if (clean.split(/\s+/).length > 1) {
    partOfSpeech = 'idiom'
  } else if (/(tion|sion|ment|ance|ence|ity|ism|ness|ship|age)$/i.test(clean)) {
    partOfSpeech = 'noun'
  } else if (/(ize|ise|ate|ify|en)$/i.test(clean)) {
    partOfSpeech = 'verb'
  } else if (/(able|ible|al|ive|ic|ous|ful|less|ish)$/i.test(clean)) {
    partOfSpeech = 'adjective'
  } else if (/(ly)$/i.test(clean)) {
    partOfSpeech = 'adverb'
  }

  return {
    phonetic: `/${clean}/`,
    partOfSpeech,
    meaningVi: `Thuật ngữ học thuật trọng tâm trong ngữ cảnh bài đọc`,
    meaningEn: `Academic term selected in contextual reading material`,
  }
}

/**
 * VocabFloatingTooltip — Floating micro-card positioned near user-highlighted text.
 * Provides instant phonetic breakdown, audio pronunciation, definition,
 * and 1-click persistence to Personal Vocabulary Notebook (/vocabulary).
 */
export const VocabFloatingTooltip: React.FC<VocabFloatingTooltipProps> = ({
  selectedText,
  contextSentence,
  rect,
  isOpen,
  onClose,
  sourceTitle = 'IELTS Academic Reading Material',
  sourceSkill = 'reading',
  onSave,
  className = '',
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const cleanWord = useMemo(() => selectedText.trim(), [selectedText])
  const details = useMemo(() => inferWordDetails(cleanWord), [cleanWord])

  // Reset saved status when selected word changes
  useEffect(() => {
    setIsSaved(false)
    setIsSaving(false)
  }, [cleanWord])

  // Audio Speech Synthesis
  const handleSpeak = useCallback(() => {
    if (!cleanWord) return
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.info('Trình duyệt chưa hỗ trợ bộ phát âm trực tiếp.')
      return
    }

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(cleanWord)
      utterance.lang = 'en-US'
      utterance.rate = 0.88
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    } catch {
      setIsSpeaking(false)
    }
  }, [cleanWord])

  // Save Word Handler
  const handleSave = useCallback(async () => {
    if (!cleanWord || isSaving || isSaved) return

    setIsSaving(true)
    const payload: CollectedWordPayload = {
      word: cleanWord,
      phonetic: details.phonetic,
      partOfSpeech: details.partOfSpeech,
      meaning: details.meaningVi,
      meaningVi: details.meaningVi,
      contextSentence: contextSentence || cleanWord,
      sourceTitle,
      createdAt: new Date().toISOString(),
    }

    try {
      await personalVocabService.addWord({
        word: payload.word,
        phonetic: payload.phonetic,
        partOfSpeech: payload.partOfSpeech,
        meaningVi: payload.meaningVi,
        contextSentence: payload.contextSentence,
        sourceSkill,
        sourceReference: payload.sourceTitle,
      })

      onSave?.(payload)
      setIsSaved(true)
      toast.success('Đã lưu vào Sổ từ vựng của tôi!', { duration: 2500 })

      // Auto-dismiss smoothly after brief acknowledgement
      setTimeout(() => {
        onClose?.()
      }, 1200)
    } catch {
      toast.error('Không thể lưu từ vựng. Vui lòng thử lại!')
    } finally {
      setIsSaving(false)
    }
  }, [
    cleanWord,
    contextSentence,
    details,
    isSaved,
    isSaving,
    onClose,
    onSave,
    sourceSkill,
    sourceTitle,
  ])

  if (!isOpen || !cleanWord || !rect) {
    return null
  }

  // Calculate dynamic floating placement
  const tooltipWidth = 330
  const tooltipHeight = 210
  const gap = 10

  // Center horizontally relative to text selection
  let left = rect.left + rect.width / 2 - tooltipWidth / 2

  // Clamp horizontally within viewport
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
  if (left < 12) {
    left = 12
  } else if (left + tooltipWidth > viewportWidth - 12) {
    left = viewportWidth - tooltipWidth - 12
  }

  // Choose top or bottom placement based on available vertical room
  let top = rect.top - tooltipHeight - gap
  let isPlacedAbove = true

  if (top < 16) {
    top = rect.bottom + gap
    isPlacedAbove = false
  }

  // Highlight selected word inside context sentence
  const renderHighlightedContext = () => {
    if (!contextSentence) return null

    const regex = new RegExp(`(${cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = contextSentence.split(regex)

    return (
      <p className="mt-2 rounded-lg border border-slate-200 bg-slate-50/70 p-2 text-[12px] leading-relaxed text-slate-600 italic">
        <span className="font-semibold not-italic text-slate-800 text-[11px] block uppercase tracking-wider mb-0.5">
          Ngữ cảnh trong bài:
        </span>
        &ldquo;
        {parts.map((part, index) =>
          part.toLowerCase() === cleanWord.toLowerCase() ? (
            <span
              key={index}
              className="not-italic font-semibold text-slate-900 bg-slate-200 px-1 py-0.5 rounded-sm border-b border-slate-400 text-[12px]"
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
        &rdquo;
      </p>
    )
  }

  return (
    <aside
      data-vocab-collector="true"
      aria-label="Thu thập từ vựng học thuật"
      className={`animate-pop-in font-sans antialiased fixed z-50 w-[330px] rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xl shadow-slate-900/10 text-slate-800 ${className}`}
      style={{
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      {/* ── Caret Indicator ────────────────────────────────────────── */}
      <div
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 h-2.5 w-2.5 rotate-45 border border-slate-200/90 bg-white ${
          isPlacedAbove ? 'bottom-[-6px] border-t-0 border-l-0' : 'top-[-6px] border-b-0 border-r-0'
        }`}
      />

      {/* ── Card Header ──────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-baseline gap-2 flex-wrap min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate capitalize">{cleanWord}</h4>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 border border-slate-200">
            {details.partOfSpeech}
          </span>
          <span className="font-mono text-xs text-slate-500">{details.phonetic}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Audio Speaker Button */}
          <button
            type="button"
            title="Phát âm chuẩn (Web Speech API)"
            onClick={handleSpeak}
            className={`btn-interactive flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200/80 transition-colors ${
              isSpeaking
                ? 'bg-slate-900 text-white animate-pulse'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Volume2 className="h-4 w-4" strokeWidth={1.75} />
          </button>

          {/* Close Button */}
          {onClose && (
            <button
              type="button"
              title="Đóng bảng từ"
              onClick={onClose}
              className="btn-interactive flex h-7 w-7 items-center justify-center rounded-lg border border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {/* ── Quick Definition ─────────────────────────────────────── */}
      <div className="mt-2 text-xs text-slate-800 font-medium leading-snug">
        {details.meaningVi}
      </div>

      {/* ── Context Sentence Extract ─────────────────────────────── */}
      {renderHighlightedContext()}

      {/* ── Footer CTA ───────────────────────────────────────────── */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || isSaved}
          className={`btn-interactive flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
            isSaved
              ? 'bg-slate-100 text-slate-800 border-slate-300 shadow-2xs'
              : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-xs'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="h-4 w-4 text-slate-700" strokeWidth={2.2} />
              <span>Đã lưu vào Sổ từ vựng của tôi</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="h-4 w-4 text-amber-400" strokeWidth={1.75} />
              <span>+ Lưu vào Sổ từ vựng của tôi</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

/**
 * VocabCollector — Drop-in compound component that connects useTextSelection
 * with VocabFloatingTooltip.
 *
 * Usage:
 * ```tsx
 * <VocabCollector sourceTitle="Cambridge 18 Reading Passage 1" />
 * ```
 */
export const VocabCollector: React.FC<VocabCollectorProps> = ({
  containerRef,
  sourceTitle = 'IELTS Academic Reading Material',
  sourceSkill = 'reading',
  enabled = true,
  onSave,
}) => {
  const { selectedText, contextSentence, rect, x, y, isOpen, clearSelection } = useTextSelection({
    containerRef,
    enabled,
    minLength: 2,
    maxLength: 150,
    maxWords: 8,
  })

  return (
    <VocabFloatingTooltip
      selectedText={selectedText}
      contextSentence={contextSentence}
      rect={rect}
      x={x}
      y={y}
      isOpen={isOpen}
      onClose={clearSelection}
      sourceTitle={sourceTitle}
      sourceSkill={sourceSkill}
      onSave={onSave}
    />
  )
}

export default VocabCollector
