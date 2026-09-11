import { describe, it, expect } from 'vitest'
import { calcProgressPercent, getInitials } from '@/lib/utils'

describe('utils', () => {
  it('calcProgressPercent calculates correct percentage', () => {
    expect(calcProgressPercent(12, 36)).toBe(33)
    expect(calcProgressPercent(0, 10)).toBe(0)
    expect(calcProgressPercent(10, 10)).toBe(100)
  })

  it('getInitials extracts two initials correctly', () => {
    expect(getInitials('Trần Thảo')).toBe('TT')
    expect(getInitials('Nguyễn Lê Trúc Linh')).toBe('NL')
  })
})
