// src/ui/Closet.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Closet } from './Closet'
import { itemsBySlot } from '../game/data/items'

describe('Closet', () => {
  it('shows the dress tab by default with all 8 dresses', () => {
    render(<Closet equipped={{}} onEquip={() => {}} onUnequip={() => {}} />)
    for (const dress of itemsBySlot('dress')) {
      expect(screen.getByText(dress.name)).toBeInTheDocument()
    }
  })

  it('switches slots on tab click', async () => {
    render(<Closet equipped={{}} onEquip={() => {}} onUnequip={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: /shoes/i }))
    expect(screen.getByText('Black Stiletto')).toBeInTheDocument()
  })

  it('calls onEquip when a tile is clicked', async () => {
    const onEquip = vi.fn()
    render(<Closet equipped={{}} onEquip={onEquip} onUnequip={() => {}} />)
    await userEvent.click(screen.getByText('Midnight Gown'))
    expect(onEquip).toHaveBeenCalledWith(itemsBySlot('dress').find(i => i.name === 'Midnight Gown'))
  })

  it('shows a coverage hint when shoes are missing', () => {
    render(<Closet equipped={{}} onEquip={() => {}} onUnequip={() => {}} />)
    expect(screen.getByText(/still needs: shoes/i)).toBeInTheDocument()
  })
})
