// src/leaderboard/share.test.ts
import { describe, it, expect } from 'vitest'
import { buildChallengeLink } from './share'

describe('buildChallengeLink', () => {
  it('builds a link to the daily muse with the score in the query string', () => {
    const link = buildChallengeLink(2450, 'https://the-edit.example.com')
    expect(link).toBe('https://the-edit.example.com/?mode=daily&score=2450')
  })
})
