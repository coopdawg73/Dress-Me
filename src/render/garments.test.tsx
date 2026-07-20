import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { drawGarment } from './garments'
import { ITEMS } from '../game/data/items'

describe('drawGarment', () => {
  it('renders a non-empty <g> for every item in the catalogue without throwing', () => {
    for (const item of ITEMS) {
      const { container } = render(<svg>{drawGarment(item)}</svg>)
      const g = container.querySelector('g')
      expect(g, `no <g> rendered for ${item.name} (tmpl ${item.tmpl})`).toBeTruthy()
      expect(g!.children.length, `empty <g> for ${item.name}`).toBeGreaterThan(0)
    }
  })

  it('applies the item color hex to at least one shape', () => {
    const gown = ITEMS.find(i => i.name === 'Midnight Gown')!
    const { container } = render(<svg>{drawGarment(gown)}</svg>)
    expect(container.innerHTML).toContain('#1D1B18')
  })
})
