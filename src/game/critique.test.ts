// src/game/critique.test.ts
import { describe, it, expect } from 'vitest'
import { critique, PRAISE_LINES } from './critique'
import { ITEMS } from './data/items'
import { BRIEFS } from './data/briefs'
import { computeScore } from './scoring'

const byName = (name: string) => ITEMS.find(i => i.name === name)!
const celine = BRIEFS.find(b => b.id === 'celine')!

describe('critique', () => {
  it('flags missing coverage before anything else', () => {
    const equipped = { shoes: byName('Black Stiletto') }
    const score = computeScore(equipped, celine, 40, 40, 0)
    const line = critique(equipped, celine, score)
    expect(line).toMatch(/half-dressed/i)
  })

  it('flags missing shoes when coverage is otherwise fine', () => {
    const equipped = { dress: byName('Midnight Gown') }
    const score = computeScore(equipped, celine, 40, 40, 0)
    const line = critique(equipped, celine, score)
    expect(line).toMatch(/shoes to leave the house/i)
  })

  it('gives a praise line for Impeccable looks', () => {
    const equipped = {
      dress: byName('Midnight Gown'), shoes: byName('Black Stiletto'),
      bag: byName('Satin Clutch'), jewelry: byName('Diamond Drops'),
    }
    const score = computeScore(equipped, celine, 40, 40, 0)
    const line = critique(equipped, celine, score)
    expect(PRAISE_LINES).toContain(line)
  })

  it('names the client for a Refined look', () => {
    const equipped = {
      dress: byName('Rouge Cocktail'), shoes: byName('Black Stiletto'),
    }
    const score = computeScore(equipped, celine, 40, 40, 0)
    const line = critique(equipped, celine, score)
    if (score.grade === 'Refined') {
      expect(line).toContain('Céline')
    }
  })

  it('names the weakest dimension for a mediocre look', () => {
    const equipped = {
      top: byName('White Tee'), bottom: byName('Straight Jeans'), shoes: byName('White Sneaker'),
    }
    const score = computeScore(equipped, celine, 40, 40, 0)
    const line = critique(equipped, celine, score)
    expect(line.length).toBeGreaterThan(0)
    expect(line).not.toMatch(/half-dressed/i)
    expect(line).not.toMatch(/shoes to leave the house/i)
  })
})
