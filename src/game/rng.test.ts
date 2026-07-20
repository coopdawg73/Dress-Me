import { describe, it, expect } from 'vitest'
import { mulberry32, dateSeed, pickDailyBriefs } from './rng'
import { BRIEFS } from './data/briefs'

describe('mulberry32', () => {
  it('is deterministic for a given seed', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    expect(a()).toBe(b())
    expect(a()).toBe(b())
  })

  it('produces values in [0, 1)', () => {
    const rand = mulberry32(7)
    for (let i = 0; i < 20; i++) {
      const v = rand()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('dateSeed', () => {
  it('gives different dates different seeds', () => {
    const d1 = dateSeed(new Date('2026-07-20T00:00:00Z'))
    const d2 = dateSeed(new Date('2026-07-21T00:00:00Z'))
    expect(d1).not.toBe(d2)
  })

  it('gives the same date the same seed regardless of time-of-day', () => {
    const d1 = dateSeed(new Date('2026-07-20T01:00:00Z'))
    const d2 = dateSeed(new Date('2026-07-20T23:00:00Z'))
    expect(d1).toBe(d2)
  })
})

describe('pickDailyBriefs', () => {
  it('picks 5 unique briefs deterministically for a given date', () => {
    const date = new Date('2026-07-20T12:00:00Z')
    const a = pickDailyBriefs(BRIEFS, date, 5)
    const b = pickDailyBriefs(BRIEFS, date, 5)
    expect(a).toHaveLength(5)
    expect(a.map(x => x.id)).toEqual(b.map(x => x.id))
    expect(new Set(a.map(x => x.id)).size).toBe(5)
  })

  it('picks a different set for a different date (with high probability)', () => {
    const a = pickDailyBriefs(BRIEFS, new Date('2026-07-20T00:00:00Z'), 5)
    const b = pickDailyBriefs(BRIEFS, new Date('2026-11-03T00:00:00Z'), 5)
    expect(a.map(x => x.id)).not.toEqual(b.map(x => x.id))
  })
})
