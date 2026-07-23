import type { Archetype, Formality } from './items'

export type Brief = {
  id: string
  name: string
  event: string
  target: Formality
  vibes: Archetype[]
  vibeWords: string
  hint?: 'warm' | 'cool'
  flair?: boolean
}

export const BRIEFS: Brief[] = [
  { id: 'mara', name: 'Mara', event: 'Gallery Opening', target: 4, vibes: ['minimal', 'edgy'], vibeWords: 'confident, understated' },
  { id: 'celine', name: 'Céline', event: 'Black-Tie Gala', target: 5, vibes: ['glam', 'classic'], vibeWords: 'timeless drama', flair: true },
  { id: 'ines', name: 'Inès', event: 'Garden Party', target: 3, vibes: ['romantic', 'relaxed'], vibeWords: 'soft, sunlit' },
  { id: 'noor', name: 'Noor', event: 'Boardroom Pitch', target: 4, vibes: ['classic', 'minimal'], vibeWords: 'sharp and polished' },
  { id: 'lena', name: 'Lena', event: 'Weekend Brunch', target: 2, vibes: ['relaxed', 'minimal'], vibeWords: 'easy elegance' },
  { id: 'vivienne', name: 'Vivienne', event: 'Opera Premiere', target: 5, vibes: ['glam', 'romantic'], vibeWords: 'opulent, romantic', flair: true },
  { id: 'sofia', name: 'Sofia', event: 'Cocktail Reception', target: 4, vibes: ['glam', 'classic'], vibeWords: 'lively but refined' },
  { id: 'astrid', name: 'Astrid', event: 'Winter City Stroll', target: 3, vibes: ['minimal', 'classic'], vibeWords: 'chic against the cold' },
  { id: 'juno', name: 'Juno', event: 'Creative Awards', target: 4, vibes: ['edgy', 'glam'], vibeWords: 'bold, directional', flair: true },
  { id: 'amelie', name: 'Amélie', event: 'Countryside Wedding', target: 4, vibes: ['romantic', 'classic'], vibeWords: 'graceful, guest-appropriate' },
  { id: 'delphine', name: 'Delphine', event: 'Fashion Week Front Row', target: 4, vibes: ['edgy', 'minimal'], vibeWords: 'sculptural, considered', flair: true },
  { id: 'rania', name: 'Rania', event: 'Dinner Date', target: 3, vibes: ['romantic', 'minimal'], vibeWords: 'intimate, a little alluring' },
]
