import { describe, expect, it } from 'vitest'
import { ITEMS } from '../game/data/items'
import {
  dressSkirtRingsFor,
  fabricPhysicsFor,
  MODEL_GARMENT_FIT,
  trouserLegFitFor,
} from './wardrobe3d'

function item(id: string) {
  const found = ITEMS.find((entry) => entry.id === id)
  if (!found) throw new Error(`Missing test item: ${id}`)
  return found
}

describe('fabric physics', () => {
  it('lets silk drape more deeply than structured leather', () => {
    const silk = fabricPhysicsFor(item('emerald-slip'))
    const leather = fabricPhysicsFor(item('leather-trench'))

    expect(silk.foldDepth).toBeGreaterThan(leather.foldDepth)
    expect(silk.stiffness).toBeLessThan(leather.stiffness)
    expect(silk.weight).toBeGreaterThan(leather.weight)
  })

  it('gives knit more stretch than denim', () => {
    const knit = fabricPhysicsFor(item('camel-knit-midi'))
    const denim = fabricPhysicsFor(item('straight-jeans'))

    expect(knit.stretch).toBeGreaterThan(denim.stretch)
    expect(knit.stiffness).toBeLessThan(denim.stiffness)
  })
})

describe('model garment fit', () => {
  it('places the dress seam inside the source shirt and shorts overlap', () => {
    expect(MODEL_GARMENT_FIT.waistY).toBeGreaterThan(MODEL_GARMENT_FIT.shirtBottomY)
    expect(MODEL_GARMENT_FIT.waistY).toBeLessThan(MODEL_GARMENT_FIT.shortsTopY)

    ITEMS.filter((entry) => entry.slot === 'dress').forEach((dress) => {
      const highestRing = Math.max(...dressSkirtRingsFor(dress).map(([y]) => y))
      expect(highestRing).toBe(MODEL_GARMENT_FIT.waistY)
    })
  })

  it('starts trouser legs beneath the fitted source waistband', () => {
    ITEMS
      .filter((entry) => entry.slot === 'bottom' && entry.tmpl !== 'skirt' && entry.tmpl !== 'pencil')
      .forEach((bottom) => {
        const fit = trouserLegFitFor(bottom)
        expect(fit.startY).toBeLessThanOrEqual(MODEL_GARMENT_FIT.hipY)
        expect(fit.startY).toBeGreaterThan(MODEL_GARMENT_FIT.shortsHemY)
        expect(fit.endY).toBe(MODEL_GARMENT_FIT.ankleY)
      })
  })
})
