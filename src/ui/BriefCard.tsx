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
    <section className="brief-card">
      <div className="brief-avatar">{brief.name.charAt(0)}</div>
      <div className="brief-copy">
        <p className="micro-label">The brief · <span className="brief-event">{brief.event}</span></p>
        <h2 className="display">{brief.name}</h2>
        <p className="brief-vibe">{brief.vibeWords}</p>
        <p className="brief-code">Dress code <span>{'●'.repeat(brief.target)}{'○'.repeat(5 - brief.target)}</span></p>
        {flags.length > 0 && <p className="brief-flags">{flags.join(' · ')}</p>}
      </div>
      <div className={`timer-badge ${warm ? 'timer-warm' : ''}`}>{timeLeft}</div>
      <div className="timer-track">
        <div style={{ width: `${pct}%` }} />
      </div>
    </section>
  )
}
