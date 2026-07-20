export type ColorKey =
  | 'ivory' | 'cream' | 'black' | 'charcoal' | 'grey' | 'taupe'
  | 'navy' | 'indigo' | 'camel' | 'burgundy' | 'emerald' | 'blush'
  | 'silver' | 'gold'

export type WarmCool = 'warm' | 'cool' | 'neutral'

export type ColorFamily = {
  key: ColorKey
  hex: string
  neutral: boolean
  warmCool: WarmCool
}

export const PALETTE: Record<ColorKey, ColorFamily> = {
  ivory:    { key: 'ivory',    hex: '#EAE1CF', neutral: true,  warmCool: 'neutral' },
  cream:    { key: 'cream',    hex: '#F3EEE2', neutral: true,  warmCool: 'neutral' },
  black:    { key: 'black',    hex: '#1D1B18', neutral: true,  warmCool: 'neutral' },
  charcoal: { key: 'charcoal', hex: '#3C3B3C', neutral: true,  warmCool: 'neutral' },
  grey:     { key: 'grey',     hex: '#98979A', neutral: true,  warmCool: 'neutral' },
  taupe:    { key: 'taupe',    hex: '#A08E78', neutral: true,  warmCool: 'neutral' },
  navy:     { key: 'navy',     hex: '#2A3450', neutral: true,  warmCool: 'cool' },
  indigo:   { key: 'indigo',   hex: '#3B4664', neutral: false, warmCool: 'cool' },
  camel:    { key: 'camel',    hex: '#B98B5E', neutral: false, warmCool: 'warm' },
  burgundy: { key: 'burgundy', hex: '#6E2436', neutral: false, warmCool: 'warm' },
  emerald:  { key: 'emerald',  hex: '#1F4C3C', neutral: false, warmCool: 'cool' },
  blush:    { key: 'blush',    hex: '#E4C1BB', neutral: false, warmCool: 'warm' },
  silver:   { key: 'silver',   hex: '#C6CAD0', neutral: false, warmCool: 'cool' },
  gold:     { key: 'gold',     hex: '#C9A24B', neutral: false, warmCool: 'warm' },
}
