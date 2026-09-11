import React from 'react'
import { X, Volume2, Bookmark, Check } from 'lucide-react'
import type { DictionaryEntry } from '../types'
import { LOCAL_DICTIONARY } from '../constants/dictionaryData'

interface DictionaryModalProps {
  isOpen: boolean
  word: string
  onClose: () => void
  onSaveToNotebook: (entry: DictionaryEntry, word: string) => void
  isAlreadySaved: boolean
}

export const DictionaryModal: React.FC<DictionaryModalProps> = ({
  isOpen,
  word,
  onClose,
  onSaveToNotebook,
  isAlreadySaved,
}) => {
  if (!isOpen || !word) return null

  const clean = word.toLowerCase().replace(/[^a-z]/g, '')
  const data: DictionaryEntry = LOCAL_DICTIONARY[clean] || {
    pos: 'vocabulary',
    ipa: `/${clean}/`,
    vi: `Vocabulary: "${clean}"`,
    en: `English definition of "${clean}".`,
    ex: `Example sentence for "${clean}".`,
  }

  const speak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(clean)
      utter.lang = 'en-US'
      utter.rate = 0.85
      window.speechSynthesis.speak(utter)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="animate-pop-in relative w-full max-w-md rounded-2xl border border-outline-variant/80 bg-surface-container-lowest p-5 sm:p-6 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dictionary"
          className="btn-interactive absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-low text-secondary hover:text-on-surface"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        {/* Word Title & Part of Speech */}
        <div className="flex items-start justify-between pr-8">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-headline-md font-bold capitalize text-on-surface">{clean}</h3>
              <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-[10px] font-bold uppercase text-on-secondary-container">
                {data.pos}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-body-sm text-secondary">{data.ipa}</p>
          </div>

          <button
            type="button"
            onClick={speak}
            className="btn-interactive flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container shadow-xs"
            title="Listen to pronunciation"
          >
            <Volume2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Vietnamese Meaning */}
        <div className="mt-4 rounded-xl border border-outline-variant/70 bg-surface-container-low/50 p-3.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
            Vietnamese Translation
          </span>
          <p className="mt-0.5 text-body-md font-bold text-on-surface">{data.vi}</p>
        </div>

        {/* English Definition & Example */}
        <div className="mt-3 space-y-2 text-body-sm text-secondary">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
              English Definition
            </span>
            <p className="mt-0.5 text-on-surface leading-relaxed">{data.en}</p>
          </div>
          {data.ex && (
            <div className="rounded-lg border-l-4 border-primary/40 bg-surface-container-low/60 p-2.5 text-xs italic text-on-surface">
              &ldquo;{data.ex}&rdquo;
            </div>
          )}
        </div>

        {/* Save to Notebook Button */}
        <div className="mt-5 border-t border-outline-variant/70 pt-3">
          <button
            type="button"
            onClick={() => onSaveToNotebook(data, clean)}
            className={`btn-interactive flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold shadow-xs transition-colors ${
              isAlreadySaved
                ? 'border border-tertiary/40 bg-tertiary-container/40 text-on-tertiary-container'
                : 'bg-primary text-on-primary hover:bg-primary-hover'
            }`}
          >
            {isAlreadySaved ? (
              <>
                <Check className="h-4 w-4 text-tertiary" strokeWidth={2.5} />
                <span>Saved in Notebook</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" strokeWidth={2} />
                <span>Save to Notebook</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
