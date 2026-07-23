// src/ui/Masthead.tsx
import { multiplierFor } from '../game/scoring'

type MastheadProps = {
  score?: number
  streak?: number
  roundLabel?: string
  livesOrLook?: string
  onExit?: () => void
}

export function Masthead({ score, streak, roundLabel, livesOrLook, onExit }: MastheadProps) {
  return (
    <header className="masthead">
      <div className="masthead-brand">
        <div className="masthead-title">DRESS <em>ME</em></div>
        <div className="masthead-by">by Remark</div>
      </div>
      {score !== undefined && (
        <div className="masthead-meta">
          <span className="score-chip">{score.toLocaleString()}</span>
          {streak !== undefined && streak > 0 && <span className="streak-chip">×{multiplierFor(streak).toFixed(2)}</span>}
          {roundLabel && <span>{roundLabel}</span>}
          {livesOrLook && <span className="lives-chip">{livesOrLook}</span>}
          {onExit && <button className="text-button" onClick={onExit}>Exit</button>}
        </div>
      )}
    </header>
  )
}
