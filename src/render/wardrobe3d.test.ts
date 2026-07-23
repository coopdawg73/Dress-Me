import { describe, expect, it } from 'vitest'
import { ITEMS } from '../game/data/items'
import { fabricPhysicsFor } from './wardrobe3d'

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
