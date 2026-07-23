// src/ui/Closet.tsx
import { useState } from 'react'
import type { Item, Slot } from '../game/data/items'
import { itemsBySlot } from '../game/data/items'
import { Thumb } from '../render/Thumb'

const SLOTS: Slot[] = ['dress', 'top', 'bottom', 'shoes', 'bag', 'jewelry']
const SLOT_LABELS: Record<Slot, string> = {
  dress: 'Dresses',
  top: 'Tops',
  bottom: 'Bottoms',
  shoes: 'Shoes',
  bag: 'Bags',
  jewelry: 'Jewelry',
}

type ClosetProps = {
  equipped: Partial<Record<Slot, Item>>
  onEquip: (item: Item) => void
  onUnequip: (slot: Slot) => void
}

export function coverageHint(equipped: Partial<Record<Slot, Item>>): string | null {
  const hasDress = Boolean(equipped.dress)
  const hasTopBottom = Boolean(equipped.top) && Boolean(equipped.bottom)
  const missing: string[] = []
  if (!equipped.shoes) missing.push('shoes')
  if (!hasDress && !hasTopBottom) missing.push('a dress, or a top and bottom')
  if (missing.length === 0) return null
  return `Still needs: ${missing.join(' and ')}`
}

export function Closet({ equipped, onEquip, onUnequip }: ClosetProps) {
  const [activeSlot, setActiveSlot] = useState<Slot>('dress')
  const hint = coverageHint(equipped)

  return (
    <section className="closet">
      <div className="closet-tabs">
        {SLOTS.map((slot) => (
          <button
            key={slot}
            aria-pressed={activeSlot === slot}
            onClick={() => setActiveSlot(slot)}
            className={activeSlot === slot ? 'active' : ''}
          >
            {SLOT_LABELS[slot]}
            {equipped[slot] && <span className="equipped-dot" />}
          </button>
        ))}
      </div>

      <div className="closet-grid">
        {itemsBySlot(activeSlot).map((it) => {
          const isEquipped = equipped[activeSlot]?.id === it.id
          return (
            <button
              key={it.id}
              onClick={() => isEquipped ? onUnequip(it.slot) : onEquip(it)}
              className={`closet-card ${isEquipped ? 'equipped' : ''}`}
            >
              <div className="closet-thumb"><Thumb item={it} /></div>
              <div className="closet-name">{it.name}{isEquipped ? ' ✓' : ''}</div>
            </button>
          )
        })}
      </div>

      {hint && <p className="coverage-hint">{hint}</p>}
    </section>
  )
}
