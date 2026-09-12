import React from 'react'
import {
  Volume2,
  Star,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  BookOpen,
  Headphones,
  Film,
  PenTool,
  BookmarkPlus,
} from 'lucide-react'
import type { PersonalWordEntry, WordMastery, VocabSourceSkill } from '@/types/personalVocab.types'

interface Props {
  item: PersonalWordEntry
  onSpeak: (word: string) => void
  onToggleStar: (id: string) => void
  onToggleMastery: (id: string, current: WordMastery) => void
  onDelete: (id: string) => void
}

export const PersonalWordCard: React.FC<Props> = ({
  item,
  onSpeak,
  onToggleStar,
  onToggleMastery,
  onDelete,
}) => {
  const getSkillIcon = (skill: VocabSourceSkill) => {
    switch (skill) {
      case 'reading':
        return <BookOpen className="h-3.5 w-3.5 text-primary" />
      case 'listening':
        return <Headphones className="h-3.5 w-3.5 text-secondary" />
      case 'dictation':
        return <Film className="h-3.5 w-3.5 text-amber-500" />
      case 'writing':
        return <PenTool className="h-3.5 w-3.5 text-tertiary" />
      default:
        return <BookmarkPlus className="h-3.5 w-3.5 text-secondary" />
    }
  }

  const getSkillLabel = (skill: VocabSourceSkill) => {
    switch (skill) {
      case 'reading':
        return 'Reading'
      case 'listening':
        return 'Listening'
      case 'dictation':
        return 'Dictation'
      case 'writing':
        return 'Writing'
      default:
        return 'Tự thêm'
    }
  }

  return (
    <div className="card-interactive group flex flex-col justify-between rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-xs hover:border-primary/40 transition-all">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-title-lg font-bold text-on-surface">{item.word}</h4>
              <span className="rounded bg-surface-container px-2 py-0.5 text-[11px] font-semibold text-secondary uppercase">
                {item.partOfSpeech}
              </span>
            </div>
            {item.phonetic && (
              <p className="text-[12px] font-mono text-secondary mt-0.5">{item.phonetic}</p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSpeak(item.word)}
              title="Nghe phát âm"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
            >
              <Volume2 className="h-4 w-4" strokeWidth={2} />
            </button>

            <button
              type="button"
              onClick={() => onToggleStar(item.id)}
              title={item.isStarred ? 'Bỏ gắn sao' : 'Gắn sao lưu ý'}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-secondary hover:bg-surface-container transition-colors cursor-pointer"
            >
              <Star
                className={`h-4 w-4 ${item.isStarred ? 'fill-amber-400 text-amber-400' : 'text-secondary/60'}`}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-surface-container-low p-2.5 text-body-sm font-semibold text-primary">
          {item.meaningVi}
        </div>

        <div className="mt-3 space-y-1">
          <div className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
            Ngữ cảnh bắt gặp từ:
          </div>
          <p className="text-body-sm text-on-surface italic leading-relaxed border-l-2 border-primary/50 pl-2.5">
            "{item.contextSentence}"
          </p>
        </div>

        {item.collocations && item.collocations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.collocations.map((col, idx) => (
              <span
                key={idx}
                className="rounded-md bg-secondary-container/40 px-2 py-0.5 text-[11px] font-medium text-on-secondary-container"
              >
                {col}
              </span>
            ))}
          </div>
        )}

        {item.personalNote && (
          <div className="mt-3 text-[11px] text-secondary bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-2">
            💡 <span className="font-medium text-on-surface">Ghi chú:</span> {item.personalNote}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-outline-variant flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-secondary">
          {getSkillIcon(item.sourceSkill)}
          <span
            className="truncate max-w-[120px]"
            title={item.sourceReference || getSkillLabel(item.sourceSkill)}
          >
            {item.sourceReference || getSkillLabel(item.sourceSkill)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggleMastery(item.id, item.masteryStatus)}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer border ${
              item.masteryStatus === 'mastered'
                ? 'border-tertiary/30 bg-tertiary-container/30 text-tertiary'
                : item.masteryStatus === 'learning'
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-500'
                  : 'border-error/30 bg-error-container/40 text-error'
            }`}
          >
            {item.masteryStatus === 'mastered' ? (
              <>
                <CheckCircle2 className="h-3 w-3" /> Đã thuộc
              </>
            ) : item.masteryStatus === 'learning' ? (
              <>
                <Clock className="h-3 w-3" /> Đang nhớ
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3" /> Cần ôn
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onDelete(item.id)}
            title="Xóa từ"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-secondary/60 hover:bg-error-container/40 hover:text-error transition-colors cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
