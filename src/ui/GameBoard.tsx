// src/ui/GameBoard.tsx
import { useEffect } from 'react'
import { useGameStore } from '../game/state'
import { multiplierFor } from '../game/scoring'
import { Figure } from '../render/Figure'
import { BriefCard } from './BriefCard'
import { Closet, coverageHint } from './Closet'
import { Masthead } from './Masthead'

export function GameBoard() {
  const {
    equipped, briefQueue, briefIndex, timeLeft, maxTime,
    totalScore, streak, mode, lives, equip, unequip, tick, presentLook, exitToStart,
  } = useGameStore()

  const brief = briefQueue[briefIndex]

  useEffect(() => {
    const id = setInterval(() => tick(), 1000)
    return () => clearInterval(id)
  }, [tick])

  if (!brief) return null

  const roundLabel = mode === 'daily' ? `Look ${briefIndex + 1}/${briefQueue.length}` : undefined
  const livesOrLook = mode === 'atelier' ? '◆'.repeat(lives) : undefined
  const incomplete = coverageHint(equipped) !== null

  return (
    <div className="game-screen">
      <Masthead score={totalScore} streak={streak} roundLabel={roundLabel} livesOrLook={livesOrLook} onExit={exitToStart} />
      <div className="game-content">
        <BriefCard brief={brief} timeLeft={timeLeft} maxTime={maxTime} />
        <div className="figure-wrap">
          <Figure equipped={equipped} />
          <p className="styling-label">Styling {brief.name}</p>
          {streak > 0 && <div key={streak} className="streak-flourish">×{multiplierFor(streak).toFixed(2)}</div>}
        </div>
        <div className="closet-drawer">
          <Closet equipped={equipped} onEquip={equip} onUnequip={unequip} />
          <button className="present-button" onClick={presentLook} disabled={incomplete}>Present the Look <span>→</span></button>
        </div>
      </div>
    </div>
  )
}
