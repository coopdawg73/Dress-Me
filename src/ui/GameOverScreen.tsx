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
    <div className="game-over screen-enter">
      <div className="remark-mark">remark<span>.</span></div>
      <p className="micro-label">Final Score</p>
      <h1 className="display final-score">{totalScore}</h1>
      <p className="final-line">{totalScore >= 3500 ? 'A season to remember.' : totalScore >= 2000 ? 'Nicely done — the room noticed.' : 'Every stylist starts somewhere.'}</p>
      <Leaderboard board={board} currentScore={totalScore} />
      <div className="game-over-actions">
        <button className="primary-button" onClick={() => (mode === 'daily' ? startDaily() : startAtelier())}>Play Again</button>
        <button className="secondary-button" onClick={exitToStart}>Home</button>
        <button className="text-button" onClick={() => navigator.clipboard.writeText(buildChallengeLink(totalScore))}>Challenge a friend ↗</button>
      </div>
    </div>
  )
}
