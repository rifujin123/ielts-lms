export type DictationMode = 'easy' | 'normal' | 'hard'

export interface DictationSentence {
  id: number
  start: number
  end: number
  text: string
  vi: string
  ipa?: string
}

export interface DictationLesson {
  id: string
  title: string
  category?: string
  thumbnailUrl?: string
  duration?: string
  level?: string
  description?: string
  youtubeId: string
  sentences: DictationSentence[]
}

export interface DictionaryEntry {
  pos: string
  ipa: string
  vi: string
  en: string
  ex?: string
}

export interface SavedVocabWord {
  word: string
  pos: string
  ipa: string
  vi: string
  date: string
}

export interface UserSentenceAttempt {
  correct: boolean
  userInput: string
}

export interface TokenizedWord {
  raw: string
  clean: string
  lower: string
  punctuation: string
  isHidden: boolean
  index: number
}
