// src/ui/ResultSheet.tsx
import { useGameStore } from '../game/state'
import type { Grade } from '../game/scoring'

const BARS: Array<{ key: 'occasion' | 'coherence' | 'vibe' | 'flair' | 'tempo'; label: string; max: number }> = [
  { key: 'occasion', label: 'Occasion', max: 300 },
  { key: 'coherence', label: 'Coherence', max: 250 },
  { key: 'vibe', label: 'Mood', max: 250 },
  { key: 'flair', label: 'Flair', max: 100 },
  { key: 'tempo', label: 'Tempo', max: 100 },
]

const GRADE_COLOR: Record<Grade, string> = {
  Impeccable: 'var(--good)',
  Refined: 'var(--good)',
  Considered: 'var(--gold)',
  Passable: 'var(--muted)',
  'Faux Pas': 'var(--bad)',
}

export function ResultSheet() {
  const { lastResult, mode, briefIndex, briefQueue, nextRound } = useGameStore()
  if (!lastResult) return null
  const { score, critiqueLine } = lastResult
  const isFinalRound = mode === 'daily' && briefIndex + 1 >= briefQueue.length

  return (
    <div role="dialog" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="screen-enter" style={{ background: 'var(--panel)', padding: '2rem', maxWidth: 480, boxShadow: 'var(--shadow)' }}>
        <h2 className="display" style={{ color: GRADE_COLOR[score.grade] }}>{score.grade}</h2>
        <p style={{ fontStyle: 'italic' }}>— Camille: "{critiqueLine}"</p>
        {BARS.map(({ key, label, max }) => (
          <div key={key} style={{ marginBottom: '0.5rem' }}>
            <div className="micro-label">{label}</div>
            <div style={{ height: 6, background: 'var(--panel2)', borderRadius: 3 }}>
              <div style={{ width: `${(score[key] / max) * 100}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.6s ease' }} />
            </div>
          </div>
        ))}
        <p className="display">Round score: {score.roundScore}</p>
        <button onClick={nextRound}>{isFinalRound ? 'See Results' : 'Next Look →'}</button>
      </div>
    </div>
  )
}
