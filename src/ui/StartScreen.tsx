// src/ui/StartScreen.tsx
import { useEffect, useState } from 'react'
import { getScores } from '../leaderboard/client'

type StartScreenProps = {
  onStartDaily: () => void
  onStartAtelier: () => void
}

export function StartScreen({ onStartDaily, onStartAtelier }: StartScreenProps) {
  const [bestLine, setBestLine] = useState<string | null>(null)

  useEffect(() => {
    getScores('endless').then((scores) => {
      if (scores.length > 0) setBestLine(`Best in the Atelier: ${scores[0].name} — ${scores[0].score}`)
    }).catch(() => {})
  }, [])

  return (
    <div className="start-screen screen-enter">
      <div className="remark-mark">remark<span>.</span></div>
      <p className="micro-label start-kicker">The personal styling challenge</p>
      <h1 className="display start-title">
        Dress <em>Me</em>
      </h1>
      <p className="start-deck">Read the room. Build the look. Let Camille deliver the verdict.</p>

      <div className="mode-cards">
        <section className="mode-card mode-card-featured">
          <span className="mode-number">01</span>
          <h2 className="display">The Daily Muse</h2>
          <p>Five briefs. One shared challenge. Make every look count.</p>
          <button className="primary-button" onClick={onStartDaily}>Play the Daily Muse <span>→</span></button>
        </section>
        <section className="mode-card">
          <span className="mode-number">02</span>
          <h2 className="display">The Atelier</h2>
          <p>Endless briefs. Three lives. A clock that keeps getting meaner.</p>
          <button className="secondary-button" onClick={onStartAtelier}>Enter the Atelier <span>→</span></button>
        </section>
      </div>

      <ol className="how-to">
        <li>Read the brief — client, occasion, mood.</li>
        <li>Pull pieces from the closet to dress the figure.</li>
        <li>Present the look before the timer runs out.</li>
      </ol>

      {bestLine && <p className="best-line">{bestLine}</p>}
    </div>
  )
}
