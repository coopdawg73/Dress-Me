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
    expect(celine.requireOuter).toBeUndefined()
    expect(celine.forbidOuter).toBeUndefined()
  })

  it('gives Inès the forbidOuter flag and Astrid the requireOuter flag', () => {
    expect(BRIEFS.find(b => b.name === 'Inès')!.forbidOuter).toBe(true)
    expect(BRIEFS.find(b => b.name === 'Astrid')!.requireOuter).toBe(true)
  })
})
