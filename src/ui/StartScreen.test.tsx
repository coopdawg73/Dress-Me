// src/ui/StartScreen.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StartScreen } from './StartScreen'
import { getScores } from '../leaderboard/client'

vi.mock('../leaderboard/client', () => ({
  getScores: vi.fn(async () => []),
}))

describe('StartScreen', () => {
  it('renders both mode cards and calls the right handler on click', async () => {
    const onDaily = vi.fn()
    const onAtelier = vi.fn()
    render(<StartScreen onStartDaily={onDaily} onStartAtelier={onAtelier} />)

    expect(screen.getByRole('heading', { name: /The Daily Muse/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /The Atelier/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Daily Muse/i }))
    expect(onDaily).toHaveBeenCalledOnce()

    await userEvent.click(screen.getByRole('button', { name: /Atelier/i }))
    expect(onAtelier).toHaveBeenCalledOnce()
  })

  it('shows the 3-step how-to', () => {
    render(<StartScreen onStartDaily={() => {}} onStartAtelier={() => {}} />)
    expect(screen.getByText(/read the brief/i)).toBeInTheDocument()
  })
})

it('shows the top all-time endless score once loaded', async () => {
  vi.mocked(getScores).mockResolvedValueOnce([{ name: 'Ana', score: 4200, ts: 0 }])
  render(<StartScreen onStartDaily={() => {}} onStartAtelier={() => {}} />)
  expect(await screen.findByText(/Ana.*4200|4200.*Ana/i)).toBeInTheDocument()
})
