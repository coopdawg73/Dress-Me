// src/ui/StartScreen.tsx
type StartScreenProps = {
  onStartDaily: () => void
  onStartAtelier: () => void
  bestScoresLine?: string
}

export function StartScreen({ onStartDaily, onStartAtelier, bestScoresLine }: StartScreenProps) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}>
      <h1 className="display" style={{ fontSize: '3rem' }}>
        Style the <em>moment</em>.
      </h1>

      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem' }}>
        <section style={{ border: '1px solid var(--line)', padding: '1.5rem', borderRadius: 8, flex: 1 }}>
          <h2 className="display">The Daily Muse</h2>
          <p className="micro-label">5 seeded briefs, same for everyone today</p>
          <button onClick={onStartDaily}>Play the Daily Muse</button>
        </section>
        <section style={{ border: '1px solid var(--line)', padding: '1.5rem', borderRadius: 8, flex: 1 }}>
          <h2 className="display">The Atelier</h2>
          <p className="micro-label">Endless briefs, 3 lives, the clock tightens</p>
          <button onClick={onStartAtelier}>Play the Atelier</button>
        </section>
      </div>

      <hr className="hairline" />

      <ol style={{ textAlign: 'left', maxWidth: 480, margin: '0 auto' }}>
        <li>Read the brief — client, occasion, mood.</li>
        <li>Pull pieces from the closet to dress the figure.</li>
        <li>Present the look before the timer runs out.</li>
      </ol>

      {bestScoresLine && <p className="micro-label">{bestScoresLine}</p>}
    </div>
  )
}
