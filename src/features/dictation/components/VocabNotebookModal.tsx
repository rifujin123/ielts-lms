import React from 'react'
import { X, Volume2, Trash2, BookMarked, Inbox } from 'lucide-react'
import type { SavedVocabWord } from '../types'

interface VocabNotebookModalProps {
  isOpen: boolean
  words: SavedVocabWord[]
  onClose: () => void
  onDeleteWord: (index: number) => void
  onClearAll: () => void
}

export const VocabNotebookModal: React.FC<VocabNotebookModalProps> = ({
  isOpen,
  words,
  onClose,
  onDeleteWord,
  onClearAll,
}) => {
  if (!isOpen) return null

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = 'en-US'
      utter.rate = 0.85
      window.speechSynthesis.speak(utter)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="animate-pop-in relative flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl border border-outline-variant/80 bg-surface-container-lowest p-5 sm:p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/70 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookMarked className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-body-lg font-bold text-on-surface">Vocabulary Notebook</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="btn-interactive flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-low text-secondary hover:text-on-surface"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Word List */}
        <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto py-3.5">
          {words.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-secondary">
              <Inbox className="h-10 w-10 stroke-1 text-secondary/40 mb-2" />
              <p className="text-body-sm font-medium">No vocabulary words saved yet</p>
              <p className="text-xs text-secondary/60 mt-0.5">
                Click any word in the lesson to look up definitions and save them here.
              </p>
            </div>
          ) : (
            words.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-outline-variant/70 bg-surface-container-low/40 p-3 transition-colors hover:border-outline-variant hover:bg-surface-container-low"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-body-md font-bold capitalize text-on-surface">
                      {item.word}
                    </span>
                    <span className="rounded-full bg-secondary-container px-2 py-0.2 text-[10px] font-bold uppercase text-on-secondary-container">
                      {item.pos}
                    </span>
                    <span className="font-mono text-xs text-secondary">{item.ipa}</span>
                  </div>
                  <p className="mt-1 text-body-sm text-on-surface font-medium">{item.vi}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => speak(item.word)}
                    className="btn-interactive flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-secondary hover:text-on-surface"
                    title="Listen to pronunciation"
                  >
                    <Volume2 className="h-3.5 w-3.5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteWord(idx)}
                    className="btn-interactive flex h-8 w-8 items-center justify-center rounded-full text-secondary hover:text-error hover:bg-error/10"
                    title="Delete word"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-outline-variant/70 pt-3 text-xs text-secondary">
          <span className="font-mono">{words.length} saved words</span>
          {words.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="btn-interactive font-semibold text-error hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
