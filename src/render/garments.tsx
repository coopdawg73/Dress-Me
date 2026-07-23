import type { ReactElement } from 'react'
import type { Item, Slot } from '../game/data/items'
import { PALETTE } from '../game/data/palette'

// All shapes are drawn in figure coordinates: viewBox 0 0 240 500.
// A garment is a small function of (template shape params, color hex).

const OUTLINE = 'rgba(0,0,0,.30)'

type DressShape = { hemY: number; hipFlare: number; waist: number }
const DRESS_SHAPES: Record<string, DressShape> = {
  gown: { hemY: 480, hipFlare: 46, waist: 92 },
  cocktail: { hemY: 330, hipFlare: 30, waist: 92 },
  slip: { hemY: 400, hipFlare: 20, waist: 92 },
  midi: { hemY: 370, hipFlare: 26, waist: 92 },
}

function drawDress(item: Item) {
  const shape = DRESS_SHAPES[item.tmpl] ?? DRESS_SHAPES.midi
  const hex = PALETTE[item.color].hex
  const top = 150
  const hipY = 230
  return (
    <g key={item.id}>
      <path
        d={`M ${120 - shape.waist / 2} ${top}
            L ${120 - shape.waist / 2 - 6} ${hipY}
            L ${120 - shape.hipFlare} ${shape.hemY}
            L ${120 + shape.hipFlare} ${shape.hemY}
            L ${120 + shape.waist / 2 + 6} ${hipY}
            L ${120 + shape.waist / 2} ${top}
            Z`}
        fill={hex}
        stroke={OUTLINE}
        strokeWidth={1.5}
      />
      <path d={`M ${120 - shape.waist / 2} ${top} L ${120 + shape.waist / 2} ${top}`} stroke="rgba(255,255,255,.18)" strokeWidth={4} />
    </g>
  )
}

type TopShape = { hemY: number; sleeve: 'none' | 'short' | 'long' }
const TOP_SHAPES: Record<string, TopShape> = {
  blouse: { hemY: 250, sleeve: 'long' },
  knit: { hemY: 255, sleeve: 'long' },
  blazer: { hemY: 260, sleeve: 'long' },
  tee: { hemY: 240, sleeve: 'short' },
  cami: { hemY: 235, sleeve: 'none' },
}

function drawTop(item: Item) {
  const shape = TOP_SHAPES[item.tmpl] ?? TOP_SHAPES.blouse
  const hex = PALETTE[item.color].hex
  const top = 150
  return (
    <g key={item.id}>
      <path
        d={`M 76 ${top} L 74 ${shape.hemY} L 166 ${shape.hemY} L 164 ${top} Z`}
        fill={hex}
        stroke={OUTLINE}
        strokeWidth={1.5}
      />
      {shape.sleeve !== 'none' && (
        <>
          <rect x={58} y={top} width={18} height={shape.sleeve === 'long' ? 90 : 40} fill={hex} stroke={OUTLINE} strokeWidth={1.2} />
          <rect x={164} y={top} width={18} height={shape.sleeve === 'long' ? 90 : 40} fill={hex} stroke={OUTLINE} strokeWidth={1.2} />
        </>
      )}
    </g>
  )
}

type BottomShape = { hemY: number; legWidth: number }
const BOTTOM_SHAPES: Record<string, BottomShape> = {
  trousers: { hemY: 460, legWidth: 20 },
  wide: { hemY: 460, legWidth: 34 },
  jeans: { hemY: 460, legWidth: 18 },
  skirt: { hemY: 340, legWidth: 40 },
  pencil: { hemY: 350, legWidth: 24 },
}

function drawBottom(item: Item) {
  const shape = BOTTOM_SHAPES[item.tmpl] ?? BOTTOM_SHAPES.trousers
  const hex = PALETTE[item.color].hex
  const waistY = 248
  const isSkirtLike = item.tmpl === 'skirt' || item.tmpl === 'pencil'
  return (
    <g key={item.id}>
      {isSkirtLike ? (
        <path
          d={`M ${120 - 44} ${waistY} L ${120 - shape.legWidth} ${shape.hemY} L ${120 + shape.legWidth} ${shape.hemY} L ${120 + 44} ${waistY} Z`}
          fill={hex} stroke={OUTLINE} strokeWidth={1.5}
        />
      ) : (
        <>
          <rect x={120 - 44} y={waistY} width={44 - shape.legWidth / 2} height={shape.hemY - waistY} fill={hex} stroke={OUTLINE} strokeWidth={1.2} />
          <rect x={120 + shape.legWidth / 2} y={waistY} width={44 - shape.legWidth / 2} height={shape.hemY - waistY} fill={hex} stroke={OUTLINE} strokeWidth={1.2} />
        </>
      )}
    </g>
  )
}

type OuterShape = { hemY: number }
const OUTER_SHAPES: Record<string, OuterShape> = {
  coat: { hemY: 440 },
  trench: { hemY: 430 },
  cape: { hemY: 400 },
  jacket: { hemY: 280 },
}

function drawOuter(item: Item) {
  const shape = OUTER_SHAPES[item.tmpl] ?? OUTER_SHAPES.jacket
  const hex = PALETTE[item.color].hex
  const top = 145
  return (
    <g key={item.id} opacity={0.96}>
      <path d={`M 62 ${top} L 55 ${shape.hemY} L 108 ${shape.hemY} L 112 ${top + 20} Z`} fill={hex} stroke={OUTLINE} strokeWidth={1.5} />
      <path d={`M 178 ${top} L 185 ${shape.hemY} L 132 ${shape.hemY} L 128 ${top + 20} Z`} fill={hex} stroke={OUTLINE} strokeWidth={1.5} />
      <path d={`M 96 ${top} L 120 ${top + 18} L 144 ${top} L 120 ${top - 8} Z`} fill={hex} stroke={OUTLINE} strokeWidth={1} />
    </g>
  )
}

type ShoeShape = { heelHeight: number }
const SHOE_SHAPES: Record<string, ShoeShape> = {
  heel: { heelHeight: 14 },
  sandal: { heelHeight: 12 },
  boot: { heelHeight: 8 },
  sneaker: { heelHeight: 2 },
  flat: { heelHeight: 1 },
}

function drawShoes(item: Item) {
  const shape = SHOE_SHAPES[item.tmpl] ?? SHOE_SHAPES.flat
  const hex = PALETTE[item.color].hex
  const y = 480
  return (
    <g key={item.id}>
      <path d={`M 94 ${y} L 94 ${y + 12 - shape.heelHeight} L 88 ${y + 16} L 116 ${y + 16} L 116 ${y} Z`} fill={hex} stroke={OUTLINE} strokeWidth={1} />
      <path d={`M 124 ${y} L 124 ${y + 12 - shape.heelHeight} L 118 ${y + 16} L 146 ${y + 16} L 146 ${y} Z`} fill={hex} stroke={OUTLINE} strokeWidth={1} />
    </g>
  )
}

type BagShape = { w: number; h: number; y: number }
const BAG_SHAPES: Record<string, BagShape> = {
  clutch: { w: 26, h: 16, y: 300 },
  minaudiere: { w: 20, h: 14, y: 300 },
  tote: { w: 30, h: 28, y: 290 },
  shoulder: { w: 24, h: 22, y: 300 },
}

function drawBag(item: Item) {
  const shape = BAG_SHAPES[item.tmpl] ?? BAG_SHAPES.clutch
  const hex = PALETTE[item.color].hex
  return (
    <g key={item.id}>
      <rect x={176} y={shape.y} width={shape.w} height={shape.h} rx={3} fill={hex} stroke={OUTLINE} strokeWidth={1.2} />
    </g>
  )
}

type JewelryShape = { r: number; dropY: number }
const JEWELRY_SHAPES: Record<string, JewelryShape> = {
  necklace: { r: 3, dropY: 156 },
  pearl: { r: 3, dropY: 150 },
  collar: { r: 2.5, dropY: 140 },
}

function drawJewelry(item: Item) {
  const shape = JEWELRY_SHAPES[item.tmpl] ?? JEWELRY_SHAPES.necklace
  const hex = PALETTE[item.color].hex
  return (
    <g key={item.id}>
      <path d={`M 104 138 Q 120 ${shape.dropY} 136 138`} fill="none" stroke={hex} strokeWidth={3} />
      <circle cx={120} cy={shape.dropY - 4} r={shape.r} fill={hex} />
    </g>
  )
}

const DRAW_BY_SLOT: Record<Slot, (item: Item) => ReactElement> = {
  dress: drawDress,
  top: drawTop,
  bottom: drawBottom,
  outerwear: drawOuter,
  shoes: drawShoes,
  bag: drawBag,
  jewelry: drawJewelry,
}

export function drawGarment(item: Item): ReactElement {
  return DRAW_BY_SLOT[item.slot](item)
}
