export interface DiffToken {
  type: 'correct' | 'wrong' | 'omitted'
  word: string
  targetWord?: string
}

/**
 * Strips punctuation and returns a lowercase normalized token for comparison.
 */
export function cleanWord(w: string): string {
  return w
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'’]/g, '')
    .trim()
}

/**
 * Computes word-level diff using Longest Common Subsequence (LCS).
 */
export function computeWordDiff(studentText: string, targetText: string): DiffToken[] {
  const studentWords = studentText.trim().split(/\s+/).filter(Boolean)
  const targetWords = targetText.trim().split(/\s+/).filter(Boolean)

  if (targetWords.length === 0 && studentWords.length === 0) {
    return []
  }

  const m = targetWords.length
  const n = studentWords.length

  // Build DP table for LCS
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (cleanWord(targetWords[i - 1]) === cleanWord(studentWords[j - 1])) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to construct diff tokens
  let i = m
  let j = n
  const reversedDiff: DiffToken[] = []

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && cleanWord(targetWords[i - 1]) === cleanWord(studentWords[j - 1])) {
      reversedDiff.push({
        type: 'correct',
        word: studentWords[j - 1],
        targetWord: targetWords[i - 1],
      })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      // Word was typed by student but does not match target -> wrong
      reversedDiff.push({
        type: 'wrong',
        word: studentWords[j - 1],
      })
      j--
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      // Word was in target but omitted by student -> omitted
      reversedDiff.push({
        type: 'omitted',
        word: targetWords[i - 1],
      })
      i--
    }
  }

  return reversedDiff.reverse()
}
