// src/ui/GameOverScreen.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GameOverScreen } from './GameOverScreen'
import { useGameStore } from '../game/state'

beforeEach(() => {
  useGameStore.getState().startDaily()
  useGameStore.setState({ totalScore: 1234, screen: 'gameover' })
})

describe('GameOverScreen', () => {
  it('shows the final score', () => {
    render(<GameOverScreen />)
    expect(screen.getByText(/1234/)).toBeInTheDocument()
  })

  it('Play Again restarts the same mode', async () => {
    render(<GameOverScreen />)
    await userEvent.click(screen.getByRole('button', { name: /play again/i }))
    expect(useGameStore.getState().screen).toBe('playing')
    expect(useGameStore.getState().totalScore).toBe(0)
  })

  it('Home returns to the start screen', async () => {
    render(<GameOverScreen />)
    await userEvent.click(screen.getByRole('button', { name: /home/i }))
    expect(useGameStore.getState().screen).toBe('start')
  })
})
