import React from 'react'
import type { IeltsQuestionItem } from '../../types/fullExam.types'
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion'
import { CompletionQuestion } from './CompletionQuestion'
import { TableCompletionQuestion } from './TableCompletionQuestion'
import { MatchingQuestion } from './MatchingQuestion'

interface UniversalQuestionRendererProps {
  question: IeltsQuestionItem
  value: string
  onChange: (val: string) => void
  isSubmitted?: boolean
  sectionInstruction?: string
}

export const UniversalQuestionRenderer: React.FC<UniversalQuestionRendererProps> = ({
  question,
  value,
  onChange,
  isSubmitted = false,
  sectionInstruction = '',
}) => {
  switch (question.type) {
    case 'MULTIPLE_CHOICE':
      return (
        <MultipleChoiceQuestion
          question={question}
          value={value}
          onChange={onChange}
          isSubmitted={isSubmitted}
          sectionInstruction={sectionInstruction}
        />
      )

    case 'TABLE_COMPLETION':
      return (
        <TableCompletionQuestion
          question={question}
          value={value}
          onChange={onChange}
          isSubmitted={isSubmitted}
          sectionInstruction={sectionInstruction}
        />
      )

    case 'MATCHING_HEADINGS':
    case 'MATCHING_INFORMATION':
    case 'MATCHING_FEATURES':
    case 'MAP_DIAGRAM_LABELING':
      return (
        <MatchingQuestion
          question={question}
          value={value}
          onChange={onChange}
          isSubmitted={isSubmitted}
          sectionInstruction={sectionInstruction}
        />
      )

    case 'FORM_COMPLETION':
    case 'NOTE_COMPLETION':
    case 'SENTENCE_COMPLETION':
    case 'SUMMARY_COMPLETION':
    default:
      return (
        <CompletionQuestion
          question={question}
          value={value}
          onChange={onChange}
          isSubmitted={isSubmitted}
          sectionInstruction={sectionInstruction}
        />
      )
  }
}
