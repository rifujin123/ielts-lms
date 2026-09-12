import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X } from 'lucide-react'
import type {
  CreatePersonalWordPayload,
  WordPartOfSpeech,
  VocabSourceSkill,
} from '@/types/personalVocab.types'
import { toast } from '@/shared/components/Toast/toastStore'

interface Props {
  isOpen: boolean
  onClose: () => void
  onAdd: (payload: CreatePersonalWordPayload) => Promise<void>
}

export const AddPersonalWordModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [word, setWord] = useState('')
  const [phonetic, setPhonetic] = useState('')
  const [partOfSpeech, setPartOfSpeech] = useState<WordPartOfSpeech>('adjective')
  const [meaningVi, setMeaningVi] = useState('')
  const [contextSentence, setContextSentence] = useState('')
  const [sourceSkill, setSourceSkill] = useState<VocabSourceSkill>('reading')
  const [sourceReference, setSourceReference] = useState('')
  const [collocations, setCollocations] = useState('')
  const [personalNote, setPersonalNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!word.trim() || !meaningVi.trim() || !contextSentence.trim()) {
      toast.error('Thiếu thông tin bắt buộc', {
        description: 'Vui lòng nhập từ vựng, nghĩa tiếng Việt và câu ngữ cảnh.',
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd({
        word: word.trim(),
        phonetic: phonetic.trim() || undefined,
        partOfSpeech,
        meaningVi: meaningVi.trim(),
        contextSentence: contextSentence.trim(),
        sourceSkill,
        sourceReference: sourceReference.trim() || undefined,
        collocations: collocations
          ? collocations
              .split(',')
              .map((c) => c.trim())
              .filter(Boolean)
          : undefined,
        personalNote: personalNote.trim() || undefined,
      })
      onClose()
      // reset
      setWord('')
      setPhonetic('')
      setMeaningVi('')
      setContextSentence('')
      setSourceReference('')
      setCollocations('')
      setPersonalNote('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="animate-pop-in relative w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-2xl my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-container text-primary">
              <Plus className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <div>
              <h3 className="text-title-md font-bold text-on-surface">Thêm từ vựng vào sổ</h3>
              <p className="text-body-xs text-secondary">
                Tích lũy từ vựng cá nhân từ đề thi hoặc bài học
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-1.5 text-secondary hover:bg-surface-container transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-label-xs font-semibold text-on-surface">
                Từ vựng / Cụm từ <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="VD: ubiquitous"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                required
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <label className="text-label-xs font-semibold text-on-surface">Loại từ</label>
              <select
                value={partOfSpeech}
                onChange={(e) => setPartOfSpeech(e.target.value as WordPartOfSpeech)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="adjective">Adj (Tính từ)</option>
                <option value="noun">Noun (Danh từ)</option>
                <option value="verb">Verb (Động từ)</option>
                <option value="adverb">Adverb (Trạng từ)</option>
                <option value="idiom">Idiom (Thành ngữ)</option>
                <option value="phrasal_verb">Phrasal verb</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-label-xs font-semibold text-on-surface">Phiên âm IPA</label>
            <input
              type="text"
              value={phonetic}
              onChange={(e) => setPhonetic(e.target.value)}
              placeholder="VD: /juːˈbɪk.wɪ.təs/"
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-label-xs font-semibold text-on-surface">
              Nghĩa tiếng Việt <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={meaningVi}
              onChange={(e) => setMeaningVi(e.target.value)}
              placeholder="VD: Phổ biến khắp nơi, có mặt ở mọi nơi"
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-label-xs font-semibold text-on-surface">
              Câu ngữ cảnh bắt gặp từ <span className="text-error">*</span>
            </label>
            <textarea
              value={contextSentence}
              onChange={(e) => setContextSentence(e.target.value)}
              placeholder="VD: Smartphones have become ubiquitous across all modern demographics."
              rows={2}
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-label-xs font-semibold text-on-surface">Kỹ năng gặp từ</label>
              <select
                value={sourceSkill}
                onChange={(e) => setSourceSkill(e.target.value as VocabSourceSkill)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none"
              >
                <option value="reading">Reading Exam</option>
                <option value="listening">Listening</option>
                <option value="dictation">Video Dictation</option>
                <option value="writing">Giáo viên sửa Writing</option>
                <option value="manual">Tự ghi chép</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-label-xs font-semibold text-on-surface">
                Bài học / Đề thi cụ thể
              </label>
              <input
                type="text"
                value={sourceReference}
                onChange={(e) => setSourceReference(e.target.value)}
                placeholder="VD: Cam 18 - Reading Test 1"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-label-xs font-semibold text-on-surface">
              Collocation / Cụm từ hay (cách nhau bằng dấu phẩy)
            </label>
            <input
              type="text"
              value={collocations}
              onChange={(e) => setCollocations(e.target.value)}
              placeholder="VD: ubiquitous presence, ubiquitous influence"
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-label-xs font-semibold text-on-surface">Ghi chú cá nhân</label>
            <input
              type="text"
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="VD: Dùng thay cho very common trong Writing Task 2"
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3.5 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-outline-variant px-4 py-2 text-label-sm font-semibold text-secondary hover:bg-surface-container transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-5 py-2 text-label-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu vào sổ từ vựng'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
