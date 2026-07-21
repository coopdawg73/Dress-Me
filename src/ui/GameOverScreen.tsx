// src/ui/GameOverScreen.tsx
import { useGameStore } from '../game/state'

export function GameOverScreen() {
  const { totalScore, mode, startDaily, startAtelier, exitToStart } = useGameStore()

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}>
      <p className="micro-label">Final Score</p>
      <h1 className="display" style={{ fontSize: '3rem' }}>{totalScore}</h1>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
        <button onClick={() => (mode === 'daily' ? startDaily() : startAtelier())}>Play Again</button>
        <button onClick={exitToStart}>Home</button>
      </div>
    </div>
  )
}
