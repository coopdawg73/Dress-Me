import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from './state'
import { ITEMS } from './data/items'

const gown = ITEMS.find(i => i.name === 'Midnight Gown')!
const top = ITEMS.find(i => i.name === 'White Tee')!
const bottom = ITEMS.find(i => i.name === 'Straight Jeans')!

beforeEach(() => {
  useGameStore.getState().exitToStart()
})

describe('equip / unequip', () => {
  it('equipping a dress clears top and bottom', () => {
    useGameStore.getState().equip(top)
    useGameStore.getState().equip(bottom)
    useGameStore.getState().equip(gown)
    const { equipped } = useGameStore.getState()
    expect(equipped.dress).toEqual(gown)
    expect(equipped.top).toBeUndefined()
    expect(equipped.bottom).toBeUndefined()
  })

  it('equipping a top clears a previously equipped dress', () => {
    useGameStore.getState().equip(gown)
    useGameStore.getState().equip(top)
    const { equipped } = useGameStore.getState()
    expect(equipped.dress).toBeUndefined()
    expect(equipped.top).toEqual(top)
  })

  it('unequip removes only the given slot', () => {
    useGameStore.getState().equip(top)
    useGameStore.getState().equip(bottom)
    useGameStore.getState().unequip('top')
    const { equipped } = useGameStore.getState()
    expect(equipped.top).toBeUndefined()
    expect(equipped.bottom).toEqual(bottom)
  })
})

describe('startDaily', () => {
  it('seeds exactly 5 briefs and resets round state', () => {
    useGameStore.getState().equip(top)
    useGameStore.getState().startDaily()
    const s = useGameStore.getState()
    expect(s.screen).toBe('playing')
    expect(s.mode).toBe('daily')
    expect(s.briefQueue).toHaveLength(5)
    expect(s.briefIndex).toBe(0)
    expect(s.equipped).toEqual({})
    expect(s.totalScore).toBe(0)
    expect(s.streak).toBe(0)
    expect(s.timeLeft).toBe(40)
    expect(s.maxTime).toBe(40)
  })
})

describe('startAtelier', () => {
  it('starts with 3 lives and a 46s timer', () => {
    useGameStore.getState().startAtelier()
    const s = useGameStore.getState()
    expect(s.screen).toBe('playing')
    expect(s.mode).toBe('atelier')
    expect(s.lives).toBe(3)
    expect(s.timeLeft).toBe(46)
    expect(s.maxTime).toBe(46)
  })
})
