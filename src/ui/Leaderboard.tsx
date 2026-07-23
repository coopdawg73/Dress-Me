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
    <div className="leaderboard">
      <p className="micro-label">The leaderboard</p>
      <ol>
        {entries.map((e, i) => (
          <li key={i}><span className="rank">{i + 1}</span><span>{e.name}</span><strong>{e.score.toLocaleString()}</strong></li>
        ))}
      </ol>
      {currentScore !== undefined && !submitted && (
        <div className="score-submit">
          <input
            placeholder="Your name"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="secondary-button" onClick={handleSubmit}>Submit</button>
          {error && <p style={{ color: 'var(--bad)' }}>{error}</p>}
        </div>
      )}
    </div>
  )
}
