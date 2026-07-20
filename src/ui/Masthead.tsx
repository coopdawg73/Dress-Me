// src/ui/Masthead.tsx
type MastheadProps = {
  score?: number
  streak?: number
  roundLabel?: string
  livesOrLook?: string
  onExit?: () => void
}

export function Masthead({ score, streak, roundLabel, livesOrLook, onExit }: MastheadProps) {
  return (
    <header style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '1rem 2rem', borderBottom: '1px solid var(--line)',
    }}>
      <div className="display" style={{ fontSize: '1.5rem' }}>
        THE <span style={{ color: 'var(--gold)' }}>EDIT</span>
        <div className="micro-label">Dress the Moment.</div>
      </div>
      {score !== undefined && (
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="micro-label">
          <span>Score {score}</span>
          {streak !== undefined && streak > 0 && <span style={{ color: 'var(--gold)' }}>×{(1 + 0.25 * streak).toFixed(2)}</span>}
          {roundLabel && <span>{roundLabel}</span>}
          {livesOrLook && <span>{livesOrLook}</span>}
          {onExit && <button onClick={onExit}>Exit</button>}
        </div>
      )}
    </header>
  )
}
