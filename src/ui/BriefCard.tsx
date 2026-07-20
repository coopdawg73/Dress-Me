// src/ui/BriefCard.tsx
import type { Brief } from '../game/data/briefs'

type BriefCardProps = {
  brief: Brief
  timeLeft: number
  maxTime: number
}

export function BriefCard({ brief, timeLeft, maxTime }: BriefCardProps) {
  const pct = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100))
  const warm = pct < 30
  const flags: string[] = []
  if (brief.flair) flags.push('Make a statement')
  if (brief.requireOuter) flags.push('Outerwear expected')
  if (brief.forbidOuter) flags.push('No outerwear')

  return (
    <div style={{ border: '1px solid var(--line)', padding: '1rem' }}>
      <p className="micro-label">The Brief</p>
      <h2 className="display">{brief.name}</h2>
      <p>{brief.event}</p>
      <p style={{ fontStyle: 'italic' }}>{brief.vibeWords}</p>
      {flags.length > 0 && <p className="micro-label">{flags.join(' · ')}</p>}
      <p className="micro-label">Dress code: {'●'.repeat(brief.target)}{'○'.repeat(5 - brief.target)}</p>
      <div style={{ height: 6, background: 'var(--panel2)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: warm ? 'var(--bad)' : 'var(--gold)', transition: 'width 1s linear' }} />
      </div>
    </div>
  )
}
