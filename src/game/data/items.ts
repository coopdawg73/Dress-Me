import type { ColorKey } from './palette'

export type Slot = 'dress' | 'top' | 'bottom' | 'outerwear' | 'shoes' | 'bag' | 'jewelry'
export type Archetype = 'classic' | 'minimal' | 'romantic' | 'glam' | 'edgy' | 'relaxed'
export type Formality = 1 | 2 | 3 | 4 | 5

export type Item = {
  slot: Slot
  id: string
  name: string
  tmpl: string
  color: ColorKey
  formality: Formality
  arche: Archetype
  statement: boolean
}

function item(
  slot: Slot, id: string, name: string, tmpl: string, color: ColorKey,
  formality: Formality, arche: Archetype, statement = false,
): Item {
  return { slot, id, name, tmpl, color, formality, arche, statement }
}

export const ITEMS: Item[] = [
  // Dresses
  item('dress', 'midnight-gown', 'Midnight Gown', 'gown', 'black', 5, 'glam'),
  item('dress', 'ivory-column', 'Ivory Column', 'gown', 'ivory', 5, 'classic'),
  item('dress', 'emerald-slip', 'Emerald Slip', 'slip', 'emerald', 4, 'romantic', true),
  item('dress', 'rouge-cocktail', 'Rouge Cocktail', 'cocktail', 'burgundy', 4, 'glam'),
  item('dress', 'camel-knit-midi', 'Camel Knit Midi', 'midi', 'camel', 2, 'minimal'),
  item('dress', 'blush-slip-dress', 'Blush Slip Dress', 'slip', 'blush', 3, 'romantic'),
  item('dress', 'navy-midi', 'Navy Midi', 'midi', 'navy', 3, 'classic'),
  item('dress', 'noir-cocktail', 'Noir Cocktail', 'cocktail', 'black', 4, 'classic'),

  // Tops
  item('top', 'silk-blouse', 'Silk Blouse', 'blouse', 'ivory', 3, 'classic'),
  item('top', 'cashmere-knit', 'Cashmere Knit', 'knit', 'grey', 2, 'minimal'),
  item('top', 'tuxedo-blazer', 'Tuxedo Blazer', 'blazer', 'black', 4, 'edgy'),
  item('top', 'white-tee', 'White Tee', 'tee', 'cream', 1, 'relaxed'),
  item('top', 'silk-cami', 'Silk Cami', 'cami', 'burgundy', 3, 'romantic'),
  item('top', 'fine-turtleneck', 'Fine Turtleneck', 'knit', 'navy', 2, 'minimal'),

  // Bottoms
  item('bottom', 'tailored-trousers', 'Tailored Trousers', 'trousers', 'black', 4, 'classic'),
  item('bottom', 'wide-leg-trousers', 'Wide-Leg Trousers', 'wide', 'camel', 3, 'minimal'),
  item('bottom', 'straight-jeans', 'Straight Jeans', 'jeans', 'indigo', 1, 'relaxed'),
  item('bottom', 'pleated-skirt', 'Pleated Skirt', 'skirt', 'ivory', 3, 'romantic'),
  item('bottom', 'pencil-skirt', 'Pencil Skirt', 'pencil', 'charcoal', 4, 'classic'),
  item('bottom', 'satin-trousers', 'Satin Trousers', 'trousers', 'emerald', 4, 'glam', true),

  // Outerwear
  item('outerwear', 'wool-coat', 'Wool Coat', 'coat', 'camel', 3, 'classic'),
  item('outerwear', 'leather-trench', 'Leather Trench', 'trench', 'black', 3, 'edgy'),
  item('outerwear', 'opera-cape', 'Opera Cape', 'cape', 'ivory', 4, 'glam', true),
  item('outerwear', 'tailored-blazer-outer', 'Tailored Blazer', 'jacket', 'grey', 3, 'minimal'),
  item('outerwear', 'velvet-blazer', 'Velvet Blazer', 'jacket', 'burgundy', 4, 'glam', true),

  // Shoes
  item('shoes', 'black-stiletto', 'Black Stiletto', 'heel', 'black', 4, 'glam'),
  item('shoes', 'nude-pump', 'Nude Pump', 'heel', 'blush', 3, 'classic'),
  item('shoes', 'silver-sandal', 'Silver Sandal', 'sandal', 'silver', 4, 'glam', true),
  item('shoes', 'white-sneaker', 'White Sneaker', 'sneaker', 'cream', 1, 'relaxed'),
  item('shoes', 'ankle-boot', 'Ankle Boot', 'boot', 'black', 2, 'edgy'),
  item('shoes', 'ballet-flat', 'Ballet Flat', 'flat', 'ivory', 2, 'minimal'),

  // Bags
  item('bag', 'satin-clutch', 'Satin Clutch', 'clutch', 'black', 4, 'glam'),
  item('bag', 'gold-minaudiere', 'Gold Minaudière', 'minaudiere', 'gold', 5, 'glam', true),
  item('bag', 'leather-tote', 'Leather Tote', 'tote', 'camel', 2, 'minimal'),
  item('bag', 'quilted-shoulder', 'Quilted Shoulder', 'shoulder', 'black', 3, 'classic'),
  item('bag', 'woven-basket', 'Woven Basket', 'tote', 'taupe', 1, 'relaxed'),

  // Jewelry
  item('jewelry', 'diamond-drops', 'Diamond Drops', 'necklace', 'silver', 4, 'glam', true),
  item('jewelry', 'gold-chain', 'Gold Chain', 'necklace', 'gold', 3, 'classic'),
  item('jewelry', 'pearl-strand', 'Pearl Strand', 'pearl', 'ivory', 3, 'romantic'),
  item('jewelry', 'statement-collar', 'Statement Collar', 'collar', 'gold', 4, 'edgy', true),
]

export function itemsBySlot(slot: Slot): Item[] {
  return ITEMS.filter(i => i.slot === slot)
}
