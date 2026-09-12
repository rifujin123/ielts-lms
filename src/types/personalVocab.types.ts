export type WordPartOfSpeech = 'noun' | 'verb' | 'adjective' | 'adverb' | 'idiom' | 'phrasal_verb'
export type WordMastery = 'needs_review' | 'learning' | 'mastered'
export type VocabSourceSkill = 'reading' | 'listening' | 'dictation' | 'writing' | 'manual'

export interface PersonalWordEntry {
  id: string
  word: string
  phonetic: string
  partOfSpeech: WordPartOfSpeech
  meaningVi: string
  contextSentence: string
  sourceSkill: VocabSourceSkill
  sourceReference?: string
  collocations?: string[]
  personalNote?: string
  masteryStatus: WordMastery
  isStarred?: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePersonalWordPayload {
  word: string
  phonetic?: string
  partOfSpeech: WordPartOfSpeech
  meaningVi: string
  contextSentence: string
  sourceSkill: VocabSourceSkill
  sourceReference?: string
  collocations?: string[]
  personalNote?: string
}
