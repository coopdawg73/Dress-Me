import { StartScreen } from './ui/StartScreen'
import { GameBoard } from './ui/GameBoard'
import { ResultSheet } from './ui/ResultSheet'
import { GameOverScreen } from './ui/GameOverScreen'
import { useGameStore } from './game/state'

export default function App() {
  const { screen, startDaily, startAtelier } = useGameStore()

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <main className="phone-shell">
        <div className="phone-status" aria-hidden="true">
          <span>9:41</span>
          <span className="phone-island" />
          <span>●●●</span>
        </div>
        <div className="phone-screen">
          {screen === 'start' && <StartScreen onStartDaily={startDaily} onStartAtelier={startAtelier} />}
          {(screen === 'playing' || screen === 'result') && <GameBoard />}
          {screen === 'result' && <ResultSheet />}
          {screen === 'gameover' && <GameOverScreen />}
        </div>
      </main>
      <footer className="app-footer">A styling game by <strong>Remark</strong></footer>
    </div>
  )
}
