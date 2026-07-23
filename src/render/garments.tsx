import type { ReactElement, ReactNode } from 'react'
import type { Item, Slot } from '../game/data/items'
import { PALETTE } from '../game/data/palette'

const OUTLINE = 'rgba(38,28,30,.42)'
const DETAIL = 'rgba(255,255,255,.32)'
const DARK_DETAIL = 'rgba(35,24,27,.25)'

function finishId(item: Item) {
  return `finish-${item.id}`
}

function Material({ item, children, texture = 'cloth' }: {
  item: Item
  children: ReactNode
  texture?: 'cloth' | 'silk' | 'knit' | 'denim' | 'leather' | 'velvet' | 'metal'
}) {
  const id = finishId(item)
  const hex = PALETTE[item.color].hex
  const shine = texture === 'silk' || texture === 'metal' ? '.72' : texture === 'leather' ? '.46' : '.25'
  return (
    <g key={item.id} data-garment={item.id} data-material={texture}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hex} />
          <stop offset=".28" stopColor={hex} />
          <stop offset=".5" stopColor="#FFFFFF" stopOpacity={shine} />
          <stop offset=".66" stopColor={hex} />
          <stop offset="1" stopColor="#161014" stopOpacity=".42" />
        </linearGradient>
        <pattern id={`${id}-weave`} width={texture === 'knit' ? 5 : 7} height={texture === 'denim' ? 6 : 7} patternUnits="userSpaceOnUse">
          <path
            d={texture === 'denim' ? 'M-2 6 L6 -2 M2 8 L8 2' : texture === 'knit' ? 'M1 0 Q4 2 1 5 M4 0 Q1 2 4 5' : 'M0 1 H7 M1 0 V7'}
            fill="none"
            stroke={texture === 'velvet' ? '#FFFFFF' : '#20181B'}
            strokeOpacity={texture === 'cloth' ? '.07' : '.11'}
            strokeWidth={texture === 'knit' ? '.6' : '.45'}
          />
        </pattern>
      </defs>
      <g filter={texture === 'metal' ? undefined : 'url(#fabric-grain)'}>
        {children}
      </g>
    </g>
  )
}

function fill(item: Item) {
  return `url(#${finishId(item)})`
}

function Weave({ item, d }: { item: Item; d: string }) {
  return <path d={d} fill={`url(#${finishId(item)}-weave)`} pointerEvents="none" />
}

type DressShape = { hemY: number; flare: number; texture: 'silk' | 'knit' | 'velvet' }
const DRESS_SHAPES: Record<string, DressShape> = {
  gown: { hemY: 477, flare: 54, texture: 'velvet' },
  cocktail: { hemY: 330, flare: 37, texture: 'silk' },
  slip: { hemY: 394, flare: 32, texture: 'silk' },
  midi: { hemY: 374, flare: 38, texture: 'knit' },
}

function dressPath(shape: DressShape) {
  return `M 98 137
    Q 104 146 120 147 Q 136 146 142 137
    L 148 210 Q 146 226 140 239
    Q ${120 + shape.flare * .54} 274 ${120 + shape.flare} ${shape.hemY}
    Q 120 ${shape.hemY + 8} ${120 - shape.flare} ${shape.hemY}
    Q ${120 - shape.flare * .54} 274 100 239
    Q 94 226 92 210 Z`
}

function drawDress(item: Item) {
  const shape = DRESS_SHAPES[item.tmpl] ?? DRESS_SHAPES.midi
  const d = dressPath(shape)
  const isSlip = item.tmpl === 'slip'
  return (
    <Material item={item} texture={shape.texture}>
      {isSlip && (
        <g fill="none" stroke={PALETTE[item.color].hex} strokeWidth="5" strokeLinecap="round">
          <path d="M99 153 L98 132" /><path d="M141 153 L142 132" />
        </g>
      )}
      <path d={d} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.35" />
      <Weave item={item} d={d} />
      {item.tmpl === 'gown' && (
        <>
          <path d="M101 149 Q120 163 139 149" fill="none" stroke={DETAIL} strokeWidth="1.2" />
          <path d="M120 164 C113 244 101 339 86 464" fill="none" stroke={DETAIL} strokeWidth="2.2" opacity=".46" />
          <path d="M120 164 C129 246 143 343 157 464" fill="none" stroke={DARK_DETAIL} strokeWidth="1.4" />
        </>
      )}
      {item.tmpl === 'cocktail' && (
        <>
          <path d="M96 222 Q120 231 144 222" fill="none" stroke={DETAIL} strokeWidth="1.2" />
          <path d="M105 238 L94 322 M120 240 L120 329 M135 238 L146 322" stroke={DARK_DETAIL} strokeWidth="1" opacity=".6" />
        </>
      )}
      {item.tmpl === 'midi' && (
        <g stroke={DARK_DETAIL} strokeWidth=".7" opacity=".7">
          <path d="M101 158 Q120 166 139 158" fill="none" />
          <path d="M104 175 Q120 181 136 175" fill="none" />
          <path d="M100 196 Q120 201 140 196" fill="none" />
          <path d="M99 218 Q120 222 141 218" fill="none" />
        </g>
      )}
      <path d="M101 238 Q120 244 139 238" fill="none" stroke={DETAIL} strokeWidth="1.25" />
      <path d="M94 210 Q120 220 146 210" fill="none" stroke={DARK_DETAIL} strokeWidth=".7" opacity=".55" />
    </Material>
  )
}

type TopShape = { hemY: number; sleeve: 'none' | 'short' | 'long'; texture: 'cloth' | 'silk' | 'knit' | 'velvet' }
const TOP_SHAPES: Record<string, TopShape> = {
  blouse: { hemY: 246, sleeve: 'long', texture: 'silk' },
  knit: { hemY: 250, sleeve: 'long', texture: 'knit' },
  blazer: { hemY: 254, sleeve: 'long', texture: 'velvet' },
  tee: { hemY: 238, sleeve: 'short', texture: 'cloth' },
  cami: { hemY: 234, sleeve: 'none', texture: 'silk' },
}

function topBodyPath(hemY: number) {
  return `M88 137 Q100 130 104 129 Q120 138 136 129 Q140 130 152 137
    L145 ${hemY} Q120 ${hemY + 7} 95 ${hemY} Z`
}

function sleevePath(side: 'left' | 'right', long: boolean) {
  if (side === 'left') {
    return long
      ? 'M91 137 Q78 137 72 151 L54 236 Q58 245 69 239 L82 180 L102 145 Z'
      : 'M91 137 Q77 137 72 151 L69 178 Q79 184 86 176 L102 145 Z'
  }
  return long
    ? 'M149 137 Q162 137 168 151 L186 236 Q182 245 171 239 L158 180 L138 145 Z'
    : 'M149 137 Q163 137 168 151 L171 178 Q161 184 154 176 L138 145 Z'
}

function drawTop(item: Item) {
  const shape = TOP_SHAPES[item.tmpl] ?? TOP_SHAPES.blouse
  const body = topBodyPath(shape.hemY)
  const isBlazer = item.tmpl === 'blazer'
  return (
    <Material item={item} texture={shape.texture}>
      {shape.sleeve !== 'none' && (
        <>
          <path d={sleevePath('left', shape.sleeve === 'long')} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.15" />
          <path d={sleevePath('right', shape.sleeve === 'long')} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.15" />
          {shape.sleeve === 'long' && (
            <g fill="none" stroke={DETAIL} strokeWidth=".8" opacity=".65">
              <path d="M58 226 Q64 231 71 228" /><path d="M169 228 Q176 231 182 226" />
            </g>
          )}
        </>
      )}
      {shape.sleeve === 'none' && (
        <g fill="none" stroke={PALETTE[item.color].hex} strokeWidth="5" strokeLinecap="round">
          <path d="M101 151 L102 131" /><path d="M139 151 L138 131" />
        </g>
      )}
      <path d={body} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.25" />
      <Weave item={item} d={body} />
      {item.tmpl === 'blouse' && (
        <>
          <path d="M100 135 Q109 148 120 154 Q131 148 140 135" fill="#F8F3E8" opacity=".42" stroke={OUTLINE} strokeWidth=".65" />
          <path d={`M120 153 L120 ${shape.hemY}`} stroke={DARK_DETAIL} strokeWidth=".8" />
          {[171, 190, 209, 228].map(y => <circle key={y} cx="120" cy={y} r="1.25" fill="#F5EFE3" stroke={OUTLINE} strokeWidth=".4" />)}
        </>
      )}
      {item.tmpl === 'knit' && (
        <>
          <path d="M103 130 Q120 138 137 130 L137 148 Q120 153 103 148 Z" fill={fill(item)} stroke={OUTLINE} strokeWidth=".8" />
          <g stroke={DETAIL} strokeWidth=".55" opacity=".42">
            {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${102 + i * 5} 154 L${100 + i * 5.5} ${shape.hemY - 3}`} />)}
          </g>
        </>
      )}
      {isBlazer && (
        <>
          <path d="M92 138 L112 186 L119 159 L104 133 Z" fill="#FFFFFF" opacity=".18" stroke={OUTLINE} strokeWidth=".85" />
          <path d="M148 138 L128 186 L121 159 L136 133 Z" fill="#000000" opacity=".14" stroke={OUTLINE} strokeWidth=".85" />
          <path d={`M120 159 L120 ${shape.hemY}`} stroke={DARK_DETAIL} strokeWidth="1" />
          <circle cx="116" cy="207" r="2" fill="#C9A24B" stroke={OUTLINE} strokeWidth=".6" />
        </>
      )}
      {item.tmpl === 'tee' && <path d="M103 133 Q120 146 137 133" fill="none" stroke={DETAIL} strokeWidth="2" opacity=".7" />}
      {item.tmpl === 'cami' && <path d="M100 151 Q120 160 140 151" fill="none" stroke={DETAIL} strokeWidth="1.2" />}
      <path d={`M96 ${shape.hemY - 3} Q120 ${shape.hemY + 3} 144 ${shape.hemY - 3}`} fill="none" stroke={DARK_DETAIL} strokeWidth=".75" />
    </Material>
  )
}

type BottomShape = { hemY: number; width: number; texture: 'cloth' | 'silk' | 'denim' }
const BOTTOM_SHAPES: Record<string, BottomShape> = {
  trousers: { hemY: 463, width: 18, texture: 'cloth' },
  wide: { hemY: 467, width: 29, texture: 'cloth' },
  jeans: { hemY: 461, width: 19, texture: 'denim' },
  skirt: { hemY: 340, width: 42, texture: 'cloth' },
  pencil: { hemY: 353, width: 27, texture: 'cloth' },
}

function trouserLeg(side: 'left' | 'right', shape: BottomShape) {
  const ankleInner = side === 'left' ? 118 : 122
  const ankleOuter = side === 'left' ? 120 - shape.width : 120 + shape.width
  return side === 'left'
    ? `M79 238 Q91 231 119 239 L118 277 L${ankleInner} ${shape.hemY} L${ankleOuter} ${shape.hemY} L92 298 Z`
    : `M161 238 Q149 231 121 239 L122 277 L${ankleInner} ${shape.hemY} L${ankleOuter} ${shape.hemY} L148 298 Z`
}

function drawBottom(item: Item) {
  const shape = BOTTOM_SHAPES[item.tmpl] ?? BOTTOM_SHAPES.trousers
  const isSkirt = item.tmpl === 'skirt' || item.tmpl === 'pencil'
  const skirtD = item.tmpl === 'pencil'
    ? `M81 238 Q120 230 159 238 L147 ${shape.hemY} Q120 ${shape.hemY + 5} 93 ${shape.hemY} Z`
    : `M81 238 Q120 230 159 238 L${120 + shape.width} ${shape.hemY} Q120 ${shape.hemY + 8} ${120 - shape.width} ${shape.hemY} Z`
  return (
    <Material item={item} texture={shape.texture}>
      {isSkirt ? (
        <>
          <path d={skirtD} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.25" />
          <Weave item={item} d={skirtD} />
          {item.tmpl === 'skirt' && (
            <g fill="none" stroke={DARK_DETAIL} strokeWidth=".9">
              <path d="M94 239 L86 334" /><path d="M107 237 L104 338" />
              <path d="M120 236 L120 340" /><path d="M133 237 L136 338" /><path d="M146 239 L154 334" />
            </g>
          )}
          {item.tmpl === 'pencil' && <path d="M120 242 L120 345" stroke={DETAIL} strokeWidth=".8" />}
        </>
      ) : (
        <>
          {(['left', 'right'] as const).map(side => {
            const d = trouserLeg(side, shape)
            return <path key={side} d={d} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.2" />
          })}
          <path d="M80 238 Q120 228 160 238 L157 255 Q120 249 83 255 Z" fill={fill(item)} stroke={OUTLINE} strokeWidth="1" />
          <path d="M120 250 L120 458" stroke={DARK_DETAIL} strokeWidth=".8" />
          <path d="M98 252 Q90 268 86 284" fill="none" stroke={DETAIL} strokeWidth=".9" />
          <path d="M142 252 Q150 268 154 284" fill="none" stroke={DETAIL} strokeWidth=".9" />
          {item.tmpl === 'jeans' && (
            <>
              <path d="M86 249 Q96 268 108 263 M154 249 Q144 268 132 263" fill="none" stroke="#D7A878" strokeWidth="1.1" strokeDasharray="2 2" />
              <path d="M92 296 L102 454 M148 296 L138 454" stroke="#D7A878" strokeWidth=".7" strokeDasharray="2 2" opacity=".75" />
              <circle cx="116" cy="242" r="1.7" fill="#C9A24B" />
            </>
          )}
          {item.tmpl !== 'wide' && (
            <g fill="none" stroke={DETAIL} strokeWidth=".8">
              <path d="M100 456 Q108 460 117 457" /><path d="M123 457 Q132 460 140 456" />
            </g>
          )}
        </>
      )}
      <path d="M81 239 Q120 231 159 239" fill="none" stroke={DETAIL} strokeWidth="1" />
    </Material>
  )
}

type OuterShape = { hemY: number; texture: 'cloth' | 'leather' | 'velvet' }
const OUTER_SHAPES: Record<string, OuterShape> = {
  coat: { hemY: 405, texture: 'cloth' },
  trench: { hemY: 392, texture: 'leather' },
  cape: { hemY: 350, texture: 'cloth' },
  jacket: { hemY: 264, texture: 'velvet' },
}

function drawOuter(item: Item) {
  const shape = OUTER_SHAPES[item.tmpl] ?? OUTER_SHAPES.jacket
  if (item.tmpl === 'cape') {
    const d = `M94 132 Q120 122 146 132 Q171 156 180 ${shape.hemY}
      Q150 ${shape.hemY + 14} 124 ${shape.hemY - 8} L116 ${shape.hemY - 8}
      Q90 ${shape.hemY + 14} 60 ${shape.hemY} Q69 156 94 132 Z`
    return (
      <Material item={item} texture={shape.texture}>
        <path d={d} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.4" opacity=".98" />
        <Weave item={item} d={d} />
        <path d="M98 134 Q120 148 142 134" fill="none" stroke={DETAIL} strokeWidth="1.4" />
        <path d={`M120 145 L120 ${shape.hemY - 9}`} stroke={DARK_DETAIL} strokeWidth=".8" />
        <circle cx="120" cy="150" r="3" fill="#C9A24B" />
      </Material>
    )
  }
  const left = `M93 132 Q77 137 70 153 L54 238 Q57 247 68 241 L80 188
    L71 ${shape.hemY} Q91 ${shape.hemY + 7} 115 ${shape.hemY - 3} L116 160 Z`
  const right = `M147 132 Q163 137 170 153 L186 238 Q183 247 172 241 L160 188
    L169 ${shape.hemY} Q149 ${shape.hemY + 7} 125 ${shape.hemY - 3} L124 160 Z`
  return (
    <Material item={item} texture={shape.texture}>
      <path d={left} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.25" opacity=".97" />
      <path d={right} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.25" opacity=".97" />
      <path d="M94 133 L115 181 L119 151 L104 128 Z" fill="#FFFFFF" opacity=".2" stroke={OUTLINE} strokeWidth=".75" />
      <path d="M146 133 L125 181 L121 151 L136 128 Z" fill="#000000" opacity=".13" stroke={OUTLINE} strokeWidth=".75" />
      {item.tmpl === 'trench' && (
        <>
          <path d="M75 226 Q120 239 165 226 L164 244 Q120 253 76 244 Z" fill={fill(item)} stroke={OUTLINE} strokeWidth=".9" />
          <circle cx="102" cy="203" r="2" fill="#22191B" /><circle cx="138" cy="203" r="2" fill="#22191B" />
          <circle cx="100" cy="260" r="2" fill="#22191B" /><circle cx="140" cy="260" r="2" fill="#22191B" />
        </>
      )}
      {item.tmpl === 'coat' && (
        <>
          <path d="M91 286 L111 282 L110 302 L88 304 Z M149 286 L129 282 L130 302 L152 304 Z" fill="#000" opacity=".12" stroke={DETAIL} strokeWidth=".7" />
          {[205, 244, 283].map(y => <circle key={y} cx="126" cy={y} r="2" fill="#3A2926" opacity=".72" />)}
        </>
      )}
      {item.tmpl === 'jacket' && <path d="M81 250 Q120 262 159 250" fill="none" stroke={DETAIL} strokeWidth="1.1" />}
    </Material>
  )
}

type ShoeShape = { kind: 'heel' | 'sandal' | 'boot' | 'sneaker' | 'flat' }
const SHOE_SHAPES: Record<string, ShoeShape> = {
  heel: { kind: 'heel' },
  sandal: { kind: 'sandal' },
  boot: { kind: 'boot' },
  sneaker: { kind: 'sneaker' },
  flat: { kind: 'flat' },
}

function shoePath(side: 'left' | 'right', kind: ShoeShape['kind']) {
  const dx = side === 'left' ? 0 : 24
  if (kind === 'boot') return `M${91 + dx} 438 L${116 + dx} 438 L${117 + dx} 476 Q${104 + dx} 484 ${87 + dx} 476 L${94 + dx} 464 Z`
  if (kind === 'sneaker') return `M${95 + dx} 454 L${115 + dx} 453 L${119 + dx} 476 Q${104 + dx} 484 ${88 + dx} 477 L${94 + dx} 468 Z`
  if (kind === 'heel') return `M${96 + dx} 458 L${116 + dx} 457 L${118 + dx} 475 L${111 + dx} 475 L${109 + dx} 466 Q${98 + dx} 474 ${89 + dx} 474 Q${91 + dx} 465 ${96 + dx} 458 Z`
  if (kind === 'sandal') return `M${96 + dx} 463 Q${106 + dx} 455 ${116 + dx} 463 L${119 + dx} 476 Q${105 + dx} 481 ${90 + dx} 476 Z`
  return `M${96 + dx} 461 Q${108 + dx} 455 ${117 + dx} 466 L${119 + dx} 477 Q${104 + dx} 482 ${89 + dx} 476 Z`
}

function drawShoes(item: Item) {
  const shape = SHOE_SHAPES[item.tmpl] ?? SHOE_SHAPES.flat
  const texture = item.tmpl === 'sandal' ? 'metal' : item.tmpl === 'sneaker' ? 'cloth' : 'leather'
  return (
    <Material item={item} texture={texture}>
      {(['left', 'right'] as const).map(side => {
        const d = shoePath(side, shape.kind)
        return <path key={side} d={d} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.1" />
      })}
      {item.tmpl === 'sneaker' && (
        <g fill="none" stroke={DETAIL} strokeWidth=".9">
          <path d="M95 462 L113 472 M98 458 L113 468 M119 462 L137 472 M122 458 L137 468" />
          <path d="M89 476 Q104 480 119 475 M113 476 Q128 480 143 475" strokeWidth="2" />
        </g>
      )}
      {item.tmpl === 'boot' && (
        <g fill="none" stroke={DETAIL} strokeWidth=".8">
          <path d="M96 445 L111 468 M99 441 L113 463 M120 445 L135 468 M123 441 L137 463" />
        </g>
      )}
      {item.tmpl === 'sandal' && <path d="M93 468 L115 462 M117 468 L139 462" stroke={DETAIL} strokeWidth="2" />}
    </Material>
  )
}

type BagShape = { w: number; h: number; y: number; texture: 'silk' | 'leather' | 'cloth' | 'metal' }
const BAG_SHAPES: Record<string, BagShape> = {
  clutch: { w: 30, h: 17, y: 278, texture: 'silk' },
  minaudiere: { w: 24, h: 16, y: 278, texture: 'metal' },
  tote: { w: 33, h: 31, y: 269, texture: 'leather' },
  shoulder: { w: 28, h: 24, y: 279, texture: 'leather' },
}

function drawBag(item: Item) {
  const shape = BAG_SHAPES[item.tmpl] ?? BAG_SHAPES.clutch
  const x = 178
  const isWoven = item.id === 'woven-basket'
  return (
    <Material item={item} texture={isWoven ? 'cloth' : shape.texture}>
      {item.tmpl !== 'clutch' && item.tmpl !== 'minaudiere' && (
        <path
          d={`M${x + 5} ${shape.y + 4} Q${x + shape.w / 2} ${shape.y - 29} ${x + shape.w - 5} ${shape.y + 4}`}
          fill="none"
          stroke={PALETTE[item.color].hex}
          strokeWidth="3"
        />
      )}
      <rect x={x} y={shape.y} width={shape.w} height={shape.h} rx={item.tmpl === 'minaudiere' ? 8 : 4} fill={fill(item)} stroke={OUTLINE} strokeWidth="1.2" />
      {item.tmpl === 'shoulder' && (
        <g stroke={DETAIL} strokeWidth=".65" opacity=".8">
          <path d={`M${x} ${shape.y} L${x + shape.w} ${shape.y + shape.h}`} />
          <path d={`M${x + shape.w} ${shape.y} L${x} ${shape.y + shape.h}`} />
          <path d={`M${x} ${shape.y + shape.h / 2} L${x + shape.w / 2} ${shape.y} L${x + shape.w} ${shape.y + shape.h / 2} L${x + shape.w / 2} ${shape.y + shape.h} Z`} fill="none" />
        </g>
      )}
      {isWoven && (
        <g stroke={DETAIL} strokeWidth=".7" opacity=".8">
          {[5, 11, 17, 23, 29].map(dx => <path key={dx} d={`M${x + dx} ${shape.y} L${x + dx - 4} ${shape.y + shape.h}`} />)}
          {[7, 14, 21].map(dy => <path key={dy} d={`M${x} ${shape.y + dy} H${x + shape.w}`} />)}
        </g>
      )}
      <circle cx={x + shape.w / 2} cy={shape.y + 5} r="1.6" fill="#C9A24B" />
    </Material>
  )
}

type JewelryShape = { r: number; dropY: number }
const JEWELRY_SHAPES: Record<string, JewelryShape> = {
  necklace: { r: 3, dropY: 158 },
  pearl: { r: 2.5, dropY: 151 },
  collar: { r: 3.2, dropY: 146 },
}

function drawJewelry(item: Item) {
  const shape = JEWELRY_SHAPES[item.tmpl] ?? JEWELRY_SHAPES.necklace
  const hex = PALETTE[item.color].hex
  return (
    <Material item={item} texture="metal">
      <path d={`M102 132 Q120 ${shape.dropY} 138 132`} fill="none" stroke={hex} strokeWidth={item.tmpl === 'collar' ? 4 : 2.2} />
      {item.tmpl === 'pearl' ? (
        Array.from({ length: 9 }, (_, i) => {
          const x = 104 + i * 4
          const y = 135 + Math.sin((i / 8) * Math.PI) * 10
          return <circle key={i} cx={x} cy={y} r="1.8" fill={fill(item)} stroke={OUTLINE} strokeWidth=".35" />
        })
      ) : (
        <>
          <path d={`M120 145 L120 ${shape.dropY}`} stroke={hex} strokeWidth="1.2" />
          <path d={`M120 ${shape.dropY - 2} l${shape.r} ${shape.r + 2} l-${shape.r} ${shape.r + 2} l-${shape.r} -${shape.r + 2} Z`} fill={fill(item)} stroke={OUTLINE} strokeWidth=".45" />
        </>
      )}
      {/* Earrings keep jewelry visible even under high necklines. */}
      <circle cx="87" cy="78" r="2.2" fill={fill(item)} stroke={OUTLINE} strokeWidth=".4" />
      <circle cx="153" cy="78" r="2.2" fill={fill(item)} stroke={OUTLINE} strokeWidth=".4" />
    </Material>
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
