import { describe, it, expect } from 'vitest'
import { PALETTE } from './palette'

describe('PALETTE', () => {
  it('has all 14 color families from SPEC.md §6.1', () => {
    expect(Object.keys(PALETTE)).toHaveLength(14)
  })

  it('marks navy as neutral but cool-leaning', () => {
    expect(PALETTE.navy.neutral).toBe(true)
    expect(PALETTE.navy.warmCool).toBe('cool')
  })

  it('marks gold as a non-neutral warm color with the correct hex', () => {
    expect(PALETTE.gold.neutral).toBe(false)
    expect(PALETTE.gold.warmCool).toBe('warm')
    expect(PALETTE.gold.hex).toBe('#C9A24B')
  })

  it('marks emerald as non-neutral and cool', () => {
    expect(PALETTE.emerald.neutral).toBe(false)
    expect(PALETTE.emerald.warmCool).toBe('cool')
  })
})
