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
    <div role="dialog" className="result-overlay">
      <div className="result-sheet screen-enter">
        <p className="micro-label result-kicker">The verdict</p>
        <h2 className="display result-grade" style={{ color: GRADE_COLOR[score.grade] }}>{score.grade}</h2>
        <div className="camille-note">
          <span className="camille-avatar">C</span>
          <div>
            <strong>Camille · style advisor</strong>
            <p>“{critiqueLine}”</p>
          </div>
        </div>
        <div className="score-bars">
        {BARS.map(({ key, label, max }) => (
          <div key={key} className="score-bar">
            <div><span>{label}</span><span>{Math.round(score[key])}</span></div>
            <div className="score-track">
              <div style={{ width: `${(score[key] / max) * 100}%` }} />
            </div>
          </div>
        ))}
        </div>
        <div className="round-total">
          <span>Round score</span>
          <strong>+{score.roundScore.toLocaleString()}</strong>
        </div>
        <button className="primary-button result-next" onClick={nextRound}>{isFinalRound ? 'See Results →' : 'Next Look →'}</button>
      </div>
    </div>
  )
}
