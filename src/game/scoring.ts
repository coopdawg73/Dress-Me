// src/game/scoring.ts
import type { Item, Slot, Archetype } from './data/items'
import type { Brief } from './data/briefs'
import { PALETTE } from './data/palette'

export type Grade = 'Impeccable' | 'Refined' | 'Considered' | 'Passable' | 'Faux Pas'

export type ScoreBreakdown = {
  occasion: number
  coherence: number
  vibe: number
  flair: number
  tempo: number
  percent: number
  roundScore: number
  grade: Grade
}

const SLOT_WEIGHTS: Record<Slot, number> = {
  dress: 2.2, top: 1.3, bottom: 1.3, shoes: 1.3, outerwear: 1.2, bag: 0.8, jewelry: 0.7,
}

const ADJACENCY: Record<Archetype, Archetype[]> = {
  classic: ['minimal', 'romantic'],
  minimal: ['classic', 'relaxed', 'edgy'],
  romantic: ['classic', 'glam'],
  glam: ['romantic', 'edgy'],
  edgy: ['glam', 'minimal'],
  relaxed: ['minimal'],
}

export function matchVal(a: Archetype, vibes: Archetype[]): number {
  if (vibes.includes(a)) return 1
  if (vibes.some(v => ADJACENCY[a].includes(v))) return 0.5
  return 0
}

function computeOccasion(items: Item[], target: number): number {
  let weightedSum = 0
  let weightTotal = 0
  for (const it of items) {
    const w = SLOT_WEIGHTS[it.slot]
    weightedSum += w * it.formality
    weightTotal += w
  }
  if (weightTotal === 0) return 0
  const lookF = weightedSum / weightTotal
  return 300 * Math.max(0, 1 - Math.abs(lookF - target) / 2.2)
}

function computeVibe(items: Item[], vibes: Archetype[]): number {
  if (items.length === 0) return 0
  const sum = items.reduce((acc, it) => acc + matchVal(it.arche, vibes), 0)
  return 250 * (sum / items.length)
}

function computeCoherence(items: Item[]): number {
  let score = 250
  const nonNeutral = items.filter(it => !PALETTE[it.color].neutral)
  const hasWarm = nonNeutral.some(it => PALETTE[it.color].warmCool === 'warm')
  const hasCool = nonNeutral.some(it => PALETTE[it.color].warmCool === 'cool')
  if (hasWarm && hasCool) score -= 90

  const families = new Set(nonNeutral.map(it => it.color))
  if (families.size >= 3) score -= 60
  else if (families.size === 2) score -= 20

  const statementCount = items.filter(it => it.statement).length
  if (statementCount > 2) score -= 50

  if (families.size <= 1 && nonNeutral.length >= 2) score += 25

  return Math.min(250, Math.max(0, score))
}

function computeFlair(items: Item[], brief: Brief): number {
  const statements = items.filter(it => it.statement)
  const matched = statements.filter(it => matchVal(it.arche, brief.vibes) >= 1)

  if (statements.length === 0) return (brief.target >= 5 || Boolean(brief.flair)) ? 42 : 58
  if (statements.length === 1) return matched.length > 0 ? 100 : 70
  if (statements.length === 2) return matched.length > 0 ? 76 : 52
  return 30
}

function gradeFor(percent: number): Grade {
  if (percent >= 90) return 'Impeccable'
  if (percent >= 75) return 'Refined'
  if (percent >= 55) return 'Considered'
  if (percent >= 35) return 'Passable'
  return 'Faux Pas'
}

export function computeScore(
  equipped: Partial<Record<Slot, Item>>,
  brief: Brief,
  timeLeft: number,
  maxTime: number,
  streak: number,
): ScoreBreakdown {
  const items = Object.values(equipped).filter((it): it is Item => Boolean(it))

  let occasion = computeOccasion(items, brief.target)
  let coherence = computeCoherence(items)
  const vibe = computeVibe(items, brief.vibes)
  const flair = computeFlair(items, brief)

  const hasOuter = Boolean(equipped.outerwear)
  if (brief.requireOuter && !hasOuter) coherence *= 0.80
  if (brief.forbidOuter && hasOuter) {
    coherence *= 0.82
    occasion *= 0.90
  }

  let subtotal = occasion + coherence + vibe + flair

  const hasDress = Boolean(equipped.dress)
  const hasTopBottom = Boolean(equipped.top) && Boolean(equipped.bottom)
  if (!hasDress && !hasTopBottom) subtotal *= 0.40
  if (!equipped.shoes) subtotal *= 0.72

  const percent = Math.round((subtotal / 900) * 100)
  const tempo = Math.round((Math.max(0, timeLeft) / maxTime) * 100)
  const multiplier = Math.min(3, 1 + 0.25 * streak)
  const roundScore = Math.round((subtotal + tempo) * multiplier)

  return { occasion, coherence, vibe, flair, tempo, percent, roundScore, grade: gradeFor(percent) }
}
