import { describe, it, expect } from 'vitest'
import { ITEMS, itemsBySlot } from './items'

describe('ITEMS', () => {
  it('has exactly 40 pieces per SPEC.md §6.3', () => {
    expect(ITEMS).toHaveLength(40)
  })

  it('has unique ids', () => {
    const ids = new Set(ITEMS.map(i => i.id))
    expect(ids.size).toBe(ITEMS.length)
  })

  it('splits into the 7 slots with the documented counts', () => {
    expect(itemsBySlot('dress')).toHaveLength(8)
    expect(itemsBySlot('top')).toHaveLength(6)
    expect(itemsBySlot('bottom')).toHaveLength(6)
    expect(itemsBySlot('outerwear')).toHaveLength(5)
    expect(itemsBySlot('shoes')).toHaveLength(6)
    expect(itemsBySlot('bag')).toHaveLength(5)
    expect(itemsBySlot('jewelry')).toHaveLength(4)
  })

  it('flags exactly the 8 statement pieces marked ★ in SPEC.md §6.3', () => {
    const statementNames = ITEMS.filter(i => i.statement).map(i => i.name).sort()
    expect(statementNames).toEqual([
      'Diamond Drops',
      'Emerald Slip',
      'Gold Minaudière',
      'Opera Cape',
      'Satin Trousers',
      'Silver Sandal',
      'Statement Collar',
      'Velvet Blazer',
    ].sort())
  })

  it('gives the Midnight Gown the exact attributes from SPEC.md', () => {
    const gown = ITEMS.find(i => i.name === 'Midnight Gown')!
    expect(gown).toMatchObject({
      slot: 'dress', tmpl: 'gown', color: 'black', formality: 5, arche: 'glam', statement: false,
    })
  })
})
