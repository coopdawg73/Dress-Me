// src/ui/GameOverScreen.tsx
import { useGameStore } from '../game/state'
import { Leaderboard } from './Leaderboard'
import { buildChallengeLink } from '../leaderboard/share'

export function GameOverScreen() {
  const { totalScore, mode, startDaily, startAtelier, exitToStart } = useGameStore()
  const today = new Date()
  const board = mode === 'daily'
    ? `daily:${today.getUTCFullYear()}${String(today.getUTCMonth() + 1).padStart(2, '0')}${String(today.getUTCDate()).padStart(2, '0')}`
    : 'endless'

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}>
      <p className="micro-label">Final Score</p>
      <h1 className="display" style={{ fontSize: '3rem' }}>{totalScore}</h1>
      <Leaderboard board={board} currentScore={totalScore} />
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button onClick={() => (mode === 'daily' ? startDaily() : startAtelier())}>Play Again</button>
        <button onClick={exitToStart}>Home</button>
        <button onClick={() => navigator.clipboard.writeText(buildChallengeLink(totalScore))}>Challenge a friend</button>
      </div>
    </div>
  )
}
