import { describe, it, expect } from 'vitest'
import { BRIEFS } from './briefs'

describe('BRIEFS', () => {
  it('has exactly 12 briefs per SPEC.md §6.4', () => {
    expect(BRIEFS).toHaveLength(12)
  })

  it('has unique ids', () => {
    expect(new Set(BRIEFS.map(b => b.id)).size).toBe(12)
  })

  it('matches the Céline gala brief exactly, including the flair flag', () => {
    const celine = BRIEFS.find(b => b.name === 'Céline')!
    expect(celine).toMatchObject({
      event: 'Black-Tie Gala',
      target: 5,
      vibes: ['glam', 'classic'],
      flair: true,
    })
  })

  it('does not require a removed wardrobe category', () => {
    expect(BRIEFS.every(brief => !('requireOuter' in brief) && !('forbidOuter' in brief))).toBe(true)
  })
})
