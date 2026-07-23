import type { Item, Slot } from '../game/data/items'
import { drawGarment } from './garments'

const CROP: Record<Slot, string> = {
  dress: '70 116 100 364',
  top: '55 100 130 160',
  bottom: '70 240 100 230',
  shoes: '80 456 84 42',
  bag: '170 285 44 50',
  jewelry: '95 128 50 40',
}

export function Thumb({ item }: { item: Item }) {
  return (
    <svg viewBox={CROP[item.slot]} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {drawGarment(item)}
    </svg>
  )
}
