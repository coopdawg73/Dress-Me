import { describe, it, expect } from 'vitest'
import { ITEMS, itemsBySlot } from './items'

describe('ITEMS', () => {
  it('has exactly 34 available pieces', () => {
    expect(ITEMS).toHaveLength(34)
  })

  it('has unique ids', () => {
    const ids = new Set(ITEMS.map(i => i.id))
    expect(ids.size).toBe(ITEMS.length)
  })

  it('splits into the 6 visible wardrobe slots', () => {
    expect(itemsBySlot('dress')).toHaveLength(8)
    expect(itemsBySlot('top')).toHaveLength(5)
    expect(itemsBySlot('bottom')).toHaveLength(6)
    expect(itemsBySlot('shoes')).toHaveLength(6)
    expect(itemsBySlot('bag')).toHaveLength(5)
    expect(itemsBySlot('jewelry')).toHaveLength(4)
  })

  it('flags the 6 remaining statement pieces', () => {
    const statementNames = ITEMS.filter(i => i.statement).map(i => i.name).sort()
    expect(statementNames).toEqual([
      'Diamond Drops',
      'Emerald Slip',
      'Gold Minaudière',
      'Satin Trousers',
      'Silver Sandal',
      'Statement Collar',
    ].sort())
  })

  it('gives the Midnight Gown the exact attributes from SPEC.md', () => {
    const gown = ITEMS.find(i => i.name === 'Midnight Gown')!
    expect(gown).toMatchObject({
      slot: 'dress', tmpl: 'gown', color: 'black', formality: 5, arche: 'glam', statement: false,
    })
  })
})
