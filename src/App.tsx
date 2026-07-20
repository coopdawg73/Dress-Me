import { StartScreen } from './ui/StartScreen'
import { GameBoard } from './ui/GameBoard'
import { useGameStore } from './game/state'

export default function App() {
  const { screen, startDaily, startAtelier } = useGameStore()

  return (
    <div className="app-shell">
      <main style={{ flex: 1 }}>
        {screen === 'start' && <StartScreen onStartDaily={startDaily} onStartAtelier={startAtelier} />}
        {screen === 'playing' && <GameBoard />}
      </main>
      <footer className="app-footer">by Remark</footer>
    </div>
  )
}
