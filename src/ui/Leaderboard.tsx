// src/ui/Leaderboard.tsx
import { useEffect, useState } from 'react'
import { getScores, postScore, type Entry } from '../leaderboard/client'

type LeaderboardProps = {
  board: string
  currentScore?: number
  onSubmitted?: () => void
}

export function Leaderboard({ board, currentScore, onSubmitted }: LeaderboardProps) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    getScores(board).then(setEntries).catch(() => setEntries([]))
  }, [board])

  async function handleSubmit() {
    if (currentScore === undefined) return
    try {
      await postScore(board, { name, score: currentScore })
      setSubmitted(true)
      setError(null)
      const fresh = await getScores(board)
      setEntries(fresh)
      onSubmitted?.()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not submit score.')
    }
  }

  return (
    <div>
      <p className="micro-label">Leaderboard</p>
      <ol>
        {entries.map((e, i) => (
          <li key={i}><span>{e.name}</span> — <span>{e.score}</span></li>
        ))}
      </ol>
      {currentScore !== undefined && !submitted && (
        <div>
          <input
            placeholder="Your name"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
          {error && <p style={{ color: 'var(--bad)' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}
