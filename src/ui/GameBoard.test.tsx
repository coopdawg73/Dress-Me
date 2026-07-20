// src/ui/GameBoard.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameBoard } from './GameBoard'
import { useGameStore } from '../game/state'

beforeEach(() => {
  useGameStore.getState().startDaily()
})

describe('GameBoard', () => {
  it('shows the current brief client name and event', () => {
    render(<GameBoard />)
    const brief = useGameStore.getState().briefQueue[0]
    expect(screen.getByText(brief.name)).toBeInTheDocument()
    expect(screen.getByText(brief.event)).toBeInTheDocument()
  })

  it('equipping an item from the closet updates the figure and store', async () => {
    render(<GameBoard />)
    await userEvent.click(screen.getByRole('button', { name: /Midnight Gown/i }))
    expect(useGameStore.getState().equipped.dress?.name).toBe('Midnight Gown')
  })
})
