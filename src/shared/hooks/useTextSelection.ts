import { useState, useEffect, useCallback, useRef } from 'react'

export interface TextSelectionCoordinates {
  x: number
  y: number
  top: number
  bottom: number
  left: number
  right: number
  width: number
  height: number
}

export interface TextSelectionState {
  selectedText: string
  contextSentence: string
  rect: DOMRect | null
  coords: TextSelectionCoordinates | null
  x: number
  y: number
  isOpen: boolean
}

export interface UseTextSelectionOptions {
  /** Optional container element or ref to constrain selection listening */
  containerRef?: React.RefObject<HTMLElement | null>
  /** Whether the listener is active (default: true) */
  enabled?: boolean
  /** Minimum character length of selected text (default: 2) */
  minLength?: number
  /** Maximum character length of selected text (default: 150) */
  maxLength?: number
  /** Maximum word count of selected phrase (default: 8) */
  maxWords?: number
}

export interface UseTextSelectionReturn extends TextSelectionState {
  clearSelection: () => void
}

const initialState: TextSelectionState = {
  selectedText: '',
  contextSentence: '',
  rect: null,
  coords: null,
  x: 0,
  y: 0,
  isOpen: false,
}

/**
 * Extracts the full sentence containing the selected text.
 * Scans backward to the nearest sentence beginning (delimiter: .!? or newline)
 * and forward to the sentence ending.
 */
export function extractContextSentence(
  range: Range,
  selectedText: string,
  containerEl?: HTMLElement | null,
): string {
  try {
    // 1. Locate the nearest block element (paragraph, article, heading, etc.)
    let blockEl = containerEl || null
    if (!blockEl) {
      let curr: Node | null =
        range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
          ? range.commonAncestorContainer
          : range.commonAncestorContainer.parentElement

      while (curr && curr !== document.body) {
        if (curr instanceof HTMLElement) {
          const tag = curr.tagName.toLowerCase()
          const display = window.getComputedStyle(curr).display
          if (
            [
              'p',
              'article',
              'section',
              'div',
              'li',
              'blockquote',
              'h1',
              'h2',
              'h3',
              'h4',
              'h5',
              'h6',
            ].includes(tag) ||
            display === 'block' ||
            display === 'flex'
          ) {
            blockEl = curr
            break
          }
        }
        curr = curr.parentNode
      }
    }

    if (!blockEl) {
      return selectedText
    }

    const fullText = blockEl.textContent || ''
    if (!fullText.trim()) return selectedText

    // 2. Determine accurate start offset of the range within blockEl
    let charStart = -1
    try {
      const preRange = document.createRange()
      preRange.selectNodeContents(blockEl)
      preRange.setEnd(range.startContainer, range.startOffset)
      charStart = preRange.toString().length
    } catch {
      charStart = fullText.toLowerCase().indexOf(selectedText.toLowerCase())
    }

    if (charStart === -1) {
      return selectedText
    }

    const charEnd = charStart + selectedText.length
    const beforeText = fullText.slice(0, charStart)
    const afterText = fullText.slice(charEnd)

    // 3. Find sentence start (last '.', '!', '?', newline, or start of block)
    const sentenceBoundaryRegex = /[.!?](\s+|$)|[\r\n]+/g
    let match: RegExpExecArray | null
    let sentenceStart = 0
    while ((match = sentenceBoundaryRegex.exec(beforeText)) !== null) {
      sentenceStart = match.index + match[0].length
    }

    // 4. Find sentence end (first '.', '!', '?', newline, or end of block)
    const endBoundaryRegex = /[.!?](\s+|$)|[\r\n]+/
    const endMatch = endBoundaryRegex.exec(afterText)
    const sentenceEnd = endMatch ? charEnd + endMatch.index + 1 : fullText.length

    const sentence = fullText.slice(sentenceStart, sentenceEnd).replace(/\s+/g, ' ').trim()
    return sentence || selectedText
  } catch {
    return selectedText
  }
}

/**
 * useTextSelection — Hook that monitors text selection within the document
 * or a designated container element.
 *
 * Automatically extracts:
 * - Clean selected text
 * - Surrounding context sentence
 * - Accurate client viewport coordinates (x, y) & DOMRect
 * - Proper cleanups, collapsed detection, and Escape key dismissal
 */
export function useTextSelection(options: UseTextSelectionOptions = {}): UseTextSelectionReturn {
  const { containerRef, enabled = true, minLength = 2, maxLength = 150, maxWords = 8 } = options

  const [state, setState] = useState<TextSelectionState>(initialState)
  const isMouseDownRef = useRef(false)

  const clearSelection = useCallback(() => {
    setState(initialState)
    try {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
      }
    } catch {
      // ignore
    }
  }, [])

  const processSelection = useCallback(() => {
    if (!enabled) return

    const selection = window.getSelection()
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      return
    }

    // Ignore selections inside form controls
    const activeEl = document.activeElement
    if (
      activeEl instanceof HTMLInputElement ||
      activeEl instanceof HTMLTextAreaElement ||
      activeEl instanceof HTMLSelectElement
    ) {
      return
    }

    // Ignore selections inside the collector UI itself
    const anchorNode = selection.anchorNode
    const focusNode = selection.focusNode
    const anchorEl = anchorNode instanceof HTMLElement ? anchorNode : anchorNode?.parentElement
    const focusEl = focusNode instanceof HTMLElement ? focusNode : focusNode?.parentElement

    if (anchorEl?.closest('[data-vocab-collector]') || focusEl?.closest('[data-vocab-collector]')) {
      return
    }

    // Check container constraint if containerRef is specified
    if (containerRef?.current) {
      if (!containerRef.current.contains(anchorNode) || !containerRef.current.contains(focusNode)) {
        return
      }
    }

    const rawText = selection.toString()
    const trimmedText = rawText.trim()

    // Validate length and word count
    if (trimmedText.length < minLength || trimmedText.length > maxLength) {
      return
    }

    const wordCount = trimmedText.split(/\s+/).filter(Boolean).length
    if (wordCount > maxWords) {
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    // Avoid displaying on empty or 0-dimension rects
    if (rect.width === 0 && rect.height === 0) {
      return
    }

    const coords: TextSelectionCoordinates = {
      x: rect.left + rect.width / 2,
      y: rect.top,
      top: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height,
    }

    const contextSentence = extractContextSentence(range, trimmedText, containerRef?.current)

    setState({
      selectedText: trimmedText,
      contextSentence,
      rect,
      coords,
      x: coords.x,
      y: coords.y,
      isOpen: true,
    })
  }, [containerRef, enabled, maxLength, maxWords, minLength])

  useEffect(() => {
    if (!enabled) return

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDownRef.current = true
      const target = e.target as HTMLElement | null
      // If clicking inside the collector UI, do NOT clear selection state
      if (target?.closest('[data-vocab-collector]')) {
        return
      }
      // If clicking outside, dismiss the floating tooltip
      setState(initialState)
    }

    const handleMouseUp = (e: MouseEvent) => {
      isMouseDownRef.current = false
      const target = e.target as HTMLElement | null
      if (target?.closest('[data-vocab-collector]')) {
        return
      }
      // Small timeout to allow the browser to settle the final selection range
      setTimeout(() => {
        processSelection()
      }, 15)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection()
      }
    }

    const handleSelectionChange = () => {
      // Don't auto-dismiss if the user is still dragging the mouse
      if (isMouseDownRef.current) return

      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        const activeEl = document.activeElement
        if (activeEl?.closest('[data-vocab-collector]')) {
          return
        }
        // Collapsed selection outside collector
        setState(initialState)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('selectionchange', handleSelectionChange)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [clearSelection, enabled, processSelection])

  return {
    ...state,
    clearSelection,
  }
}

export default useTextSelection
