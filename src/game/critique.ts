// src/game/critique.ts
import type { Item, Slot } from './data/items'
import type { Brief } from './data/briefs'
import type { ScoreBreakdown } from './scoring'
import { OCCASION_MAX, COHERENCE_MAX, VIBE_MAX } from './scoring'

export const PRAISE_LINES = [
  "It's exactly right — nothing to add, nothing to take away.",
  "This is the kind of look people remember.",
  'Effortless, and entirely correct.',
]

export function critique(
  equipped: Partial<Record<Slot, Item>>,
  brief: Brief,
  score: ScoreBreakdown,
): string {
  const hasDress = Boolean(equipped.dress)
  const hasTopBottom = Boolean(equipped.top) && Boolean(equipped.bottom)

  if (!hasDress && !hasTopBottom) {
    return `She can't walk out half-dressed — ${brief.name} needs a dress, or a top and bottom.`
  }
  if (!equipped.shoes) {
    return `${brief.name} isn't leaving barefoot — she'll need shoes to leave the house.`
  }
  if (score.percent >= 90) {
    return PRAISE_LINES[Math.floor(Math.random() * PRAISE_LINES.length)]
  }
  if (score.percent >= 75) {
    return `${brief.name} will love this — it's exactly the kind of taste she trusts.`
  }

  const normalized: Record<'occasion' | 'coherence' | 'vibe', number> = {
    occasion: score.occasion / OCCASION_MAX,
    coherence: score.coherence / COHERENCE_MAX,
    vibe: score.vibe / VIBE_MAX,
  }
  const weakest = (Object.keys(normalized) as Array<keyof typeof normalized>)
    .reduce((a, b) => (normalized[a] <= normalized[b] ? a : b))

  if (weakest === 'occasion') {
    const looksUnderdressed = score.occasion < 150
    return looksUnderdressed
      ? `A touch too casual for ${brief.event.toLowerCase()} — ${brief.name} was dressed for a bigger moment.`
      : `A little overdressed for the room — ${brief.name} wanted this pitched lighter.`
  }
  if (weakest === 'coherence') {
    return 'The palette is fighting itself — pick one story and let it carry the look.'
  }
  return `It misses the '${brief.vibeWords}' mood ${brief.name} asked for.`
}
