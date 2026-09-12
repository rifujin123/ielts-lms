import { describe, it, expect } from 'vitest'
import { extractContextSentence } from '@/shared/hooks/useTextSelection'

describe('extractContextSentence', () => {
  it('extracts single sentence accurately from paragraph text', () => {
    const container = document.createElement('div')
    container.textContent =
      'Climate change is accelerating. The indiscriminate use of chemical fertilizers has led to severe soil degradation across the delta. Many farmers are struggling.'
    document.body.appendChild(container)

    const range = document.createRange()
    const textNode = container.firstChild as Text
    const startIndex = container.textContent.indexOf('indiscriminate')
    range.setStart(textNode, startIndex)
    range.setEnd(textNode, startIndex + 'indiscriminate'.length)

    const result = extractContextSentence(range, 'indiscriminate', container)

    expect(result).toBe(
      'The indiscriminate use of chemical fertilizers has led to severe soil degradation across the delta.',
    )

    document.body.removeChild(container)
  })

  it('falls back to selected text if container text is empty', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const range = document.createRange()
    range.selectNodeContents(container)

    const result = extractContextSentence(range, 'mitigate', container)
    expect(result).toBe('mitigate')

    document.body.removeChild(container)
  })
})
