import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./supabaseClient', () => ({ supabase: null }))

import { postScore, getScores } from './client'

beforeEach(() => {
  localStorage.clear()
})

describe('leaderboard client (localStorage fallback)', () => {
  it('stores and retrieves scores sorted descending', async () => {
    await postScore('endless', { name: 'Ana', score: 500 })
    await postScore('endless', { name: 'Bo', score: 900 })
    await postScore('endless', { name: 'Cy', score: 200 })
    const scores = await getScores('endless')
    expect(scores.map(s => s.name)).toEqual(['Bo', 'Ana', 'Cy'])
  })

  it('keeps boards separate', async () => {
    await postScore('endless', { name: 'Ana', score: 500 })
    await postScore('daily:20260720', { name: 'Bo', score: 900 })
    expect((await getScores('endless')).map(s => s.name)).toEqual(['Ana'])
    expect((await getScores('daily:20260720')).map(s => s.name)).toEqual(['Bo'])
  })

  it('rejects an implausibly high score (sanity cap)', async () => {
    await expect(postScore('endless', { name: 'Cheater', score: 999999999 })).rejects.toThrow()
  })

  it('keeps only the top 25 entries per board', async () => {
    for (let i = 0; i < 30; i++) {
      await postScore('endless', { name: `P${i}`, score: i })
    }
    const scores = await getScores('endless')
    expect(scores.length).toBeLessThanOrEqual(25)
  })
})
