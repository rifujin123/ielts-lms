export type GamifiedQuestionType = 'single_choice' | 'multiple_choice' | 'word_bank_gap_fill'

export interface BaseQuestion {
  id: string
  type: GamifiedQuestionType
  prompt: string
  context?: string
  instruction?: string
  explanation: {
    rule: string
    detail: string
  }
}

export interface SingleChoiceOption {
  id: string
  text: string
  hint?: string
}

export interface SingleChoiceQuestionData extends BaseQuestion {
  type: 'single_choice'
  options: SingleChoiceOption[]
  correctOptionId: string
}

export interface MultipleChoiceOption {
  id: string
  text: string
}

export interface MultipleChoiceQuestionData extends BaseQuestion {
  type: 'multiple_choice'
  requiredSelectCount?: number
  options: MultipleChoiceOption[]
  correctOptionIds: string[]
}

export interface WordBankBlank {
  blankId: string // e.g. "blank_1", "blank_2"
  correctWord: string
}

export interface WordBankItem {
  id: string
  word: string
}

export interface WordBankGapFillQuestionData extends BaseQuestion {
  type: 'word_bank_gap_fill'
  sentenceWithBlanks: string // e.g. "The researcher decided to [blank_1] the data before drawing any [blank_2]."
  blanks: WordBankBlank[]
  wordBank: WordBankItem[]
}

export type GamifiedQuestion =
  SingleChoiceQuestionData | MultipleChoiceQuestionData | WordBankGapFillQuestionData

export interface GamifiedExerciseLesson {
  id: string
  title: string
  skill: 'Reading' | 'Listening' | 'Writing' | 'Speaking'
  subCategory: string
  xpReward?: number
  questions: GamifiedQuestion[]
}
