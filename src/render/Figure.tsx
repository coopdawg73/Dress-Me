import type { Item, Slot } from '../game/data/items'
import { drawGarment } from './garments'

type FigureProps = {
  equipped: Partial<Record<Slot, Item>>
}

export function Figure({ equipped }: FigureProps) {
  return (
    <svg viewBox="0 0 240 500" width="100%" height="100%" role="img" aria-label="Styled figure">
      {/* base body */}
      <g>
        <circle cx={120} cy={70} r={30} fill="#E7D0B4" stroke="rgba(0,0,0,.2)" />
        <path d="M 96 50 Q 120 30 144 50 L 144 70 Q 120 60 96 70 Z" fill="#5A4632" />
        <rect x={112} y={98} width={16} height={20} fill="#D8C4AB" />
        <path d="M 90 118 Q 120 108 150 118 L 150 260 Q 120 270 90 260 Z" fill="#D8C4AB" />
        <rect x={60} y={120} width={16} height={140} fill="#D8C4AB" />
        <rect x={164} y={120} width={16} height={140} fill="#D8C4AB" />
        <rect x={104} y={250} width={16} height={220} fill="#D8C4AB" />
        <rect x={120} y={250} width={16} height={220} fill="#D8C4AB" />
      </g>

      {equipped.dress ? (
        drawGarment(equipped.dress)
      ) : (
        <>
          {equipped.bottom && drawGarment(equipped.bottom)}
          {equipped.top && drawGarment(equipped.top)}
        </>
      )}
      {equipped.shoes && drawGarment(equipped.shoes)}
      {equipped.outerwear && drawGarment(equipped.outerwear)}
      {equipped.bag && drawGarment(equipped.bag)}
      {equipped.jewelry && drawGarment(equipped.jewelry)}
    </svg>
  )
}
