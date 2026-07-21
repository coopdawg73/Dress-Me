// src/ui/Leaderboard.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../leaderboard/client', () => ({
  getScores: vi.fn(async () => [{ name: 'Ana', score: 900, ts: 0 }]),
  postScore: vi.fn(async () => {}),
}))

import { Leaderboard } from './Leaderboard'
import * as client from '../leaderboard/client'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Leaderboard', () => {
  it('loads and displays the top scores for the given board', async () => {
    render(<Leaderboard board="endless" currentScore={500} />)
    expect(await screen.findByText('Ana')).toBeInTheDocument()
    expect(screen.getByText('900')).toBeInTheDocument()
  })

  it('submits a name and re-fetches the board', async () => {
    render(<Leaderboard board="endless" currentScore={500} />)
    await screen.findByText('Ana')
    await userEvent.type(screen.getByPlaceholderText(/your name/i), 'Cooper')
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(client.postScore).toHaveBeenCalledWith('endless', { name: 'Cooper', score: 500 })
    expect(client.getScores).toHaveBeenCalledTimes(2)
  })
})
