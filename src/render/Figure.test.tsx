import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Figure } from './Figure'
import { ITEMS } from '../game/data/items'

const gown = ITEMS.find(i => i.name === 'Midnight Gown')!
const shoes = ITEMS.find(i => i.name === 'Black Stiletto')!
const top = ITEMS.find(i => i.name === 'White Tee')!
const bottom = ITEMS.find(i => i.name === 'Straight Jeans')!

describe('Figure', () => {
  it('always renders the base body svg', () => {
    const { container } = render(<Figure equipped={{}} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('renders a dress layer when a dress is equipped', () => {
    const { container } = render(<Figure equipped={{ dress: gown, shoes }} />)
    expect(container.innerHTML).toContain('#1D1B18')
  })

  it('renders top+bottom layers when both are equipped instead of a dress', () => {
    const { container } = render(<Figure equipped={{ top, bottom, shoes }} />)
    expect(container.innerHTML).toContain('#F3EEE2') // White Tee cream
    expect(container.innerHTML).toContain('#3B4664') // Straight Jeans indigo
  })

  it('does not render top/bottom colors when a dress is equipped instead', () => {
    const { container } = render(<Figure equipped={{ dress: gown, top, bottom, shoes }} />)
    expect(container.innerHTML).not.toContain('#F3EEE2') // White Tee cream
    expect(container.innerHTML).not.toContain('#3B4664') // Straight Jeans indigo
  })
})
