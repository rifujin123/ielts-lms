import React, { useState } from 'react'
import { X, SlidersHorizontal, Check } from 'lucide-react'
import type { DictationLesson } from '../types'
import { LESSON_DATABASE } from '../constants/mockLessons'

interface CustomLessonModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveLesson: (lesson: DictationLesson) => void
}

export const CustomLessonModal: React.FC<CustomLessonModalProps> = ({
  isOpen,
  onClose,
  onSaveLesson,
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [jsonTranscript, setJsonTranscript] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleFillSample = () => {
    setYoutubeUrl('4bG17OYs-GA')
    setTitle("Kiki's Delivery Service Custom Test")
    setJsonTranscript(JSON.stringify(LESSON_DATABASE.kiki.sentences, null, 2))
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    let vidId = youtubeUrl.trim()
    if (vidId.includes('v=')) {
      vidId = vidId.split('v=')[1].split('&')[0]
    } else if (vidId.includes('youtu.be/')) {
      vidId = vidId.split('youtu.be/')[1].split('?')[0]
    }

    if (!vidId) {
      setError('Please enter a valid YouTube URL or Video ID!')
      return
    }

    try {
      const parsed = JSON.parse(jsonTranscript)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setError('JSON Transcript must be an array of sentence objects!')
        return
      }

      const newLesson: DictationLesson = {
        id: `custom_${Date.now()}`,
        title: title.trim() || 'Custom Lesson',
        youtubeId: vidId,
        sentences: parsed.map((s, idx) => ({
          id: idx,
          start: parseFloat(s.start || 0),
          end: parseFloat(s.end || 5),
          text: s.text || 'Sample text',
          vi: s.vi || 'Sample translation',
          ipa: s.ipa || '',
        })),
      }

      onSaveLesson(newLesson)
      onClose()
    } catch (err) {
      setError(`JSON syntax error: ${(err as Error).message}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="animate-pop-in relative flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" strokeWidth={2} />
            <div>
              <h3 className="text-label-lg font-bold text-on-surface">Custom YouTube Lesson</h3>
              <p className="text-[11px] text-secondary">
                Paste YouTube URL and timestamped sentence transcript
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="btn-interactive flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-secondary hover:text-on-surface"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="custom-scrollbar flex-1 space-y-3 overflow-y-auto py-3"
        >
          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-2.5 text-xs font-semibold text-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-label-sm font-bold text-on-surface">
              YouTube URL or Video ID:
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="e.g., 4bG17OYs-GA or https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 font-mono text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-label-sm font-bold text-on-surface">
              Lesson Title:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., IELTS Listening Practice Test 1"
              className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2 text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-label-sm font-bold text-on-surface">
                JSON Transcript (start, end, text):
              </label>
              <button
                type="button"
                onClick={handleFillSample}
                className="btn-interactive text-xs font-bold text-primary hover:underline"
              >
                Fill Sample Data
              </button>
            </div>
            <textarea
              rows={8}
              value={jsonTranscript}
              onChange={(e) => setJsonTranscript(e.target.value)}
              placeholder={`[\n  {\n    "start": 1.2,\n    "end": 4.5,\n    "text": "Welcome to IELTS LMS."\n  }\n]`}
              className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-2.5 font-mono text-xs text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-outline-variant pt-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-interactive rounded-xl border border-outline-variant px-4 py-2 text-label-sm font-bold text-secondary hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-interactive flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2 text-label-sm font-bold text-on-primary shadow-xs hover:bg-primary-hover"
            >
              <Check className="h-4 w-4" />
              <span>Import & Start Practice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
