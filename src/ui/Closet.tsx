// src/ui/Closet.tsx
import { useState } from 'react'
import type { Item, Slot } from '../game/data/items'
import { itemsBySlot } from '../game/data/items'
import { Thumb } from '../render/Thumb'

const SLOTS: Slot[] = ['dress', 'top', 'bottom', 'outerwear', 'shoes', 'bag', 'jewelry']

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
    <div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {SLOTS.map((slot) => (
          <button
            key={slot}
            aria-pressed={activeSlot === slot}
            onClick={() => setActiveSlot(slot)}
            style={{ fontWeight: equipped[slot] ? 'bold' : 'normal' }}
          >
            {slot}{equipped[slot] ? ' •' : ''}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
        {itemsBySlot(activeSlot).map((it) => {
          const isEquipped = equipped[activeSlot]?.id === it.id
          return (
            <button
              key={it.id}
              onClick={() => isEquipped ? onUnequip(it.slot) : onEquip(it)}
              style={{ border: isEquipped ? '1px solid var(--gold)' : '1px solid var(--line)', padding: '0.5rem', background: 'var(--panel)' }}
            >
              <div style={{ height: 70 }}><Thumb item={it} /></div>
              <div className="micro-label">{it.name}{isEquipped ? ' ✓' : ''}</div>
            </button>
          )
        })}
      </div>

      {hint && <p className="micro-label" style={{ color: 'var(--bad)' }}>{hint}</p>}
    </div>
  )
}
