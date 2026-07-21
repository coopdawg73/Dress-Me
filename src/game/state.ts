import { create } from 'zustand'
import type { Item, Slot } from './data/items'
import type { Brief } from './data/briefs'
import { BRIEFS } from './data/briefs'
import { pickDailyBriefs } from './rng'
import { computeScore, type ScoreBreakdown } from './scoring'
import { critique } from './critique'

export type Mode = 'daily' | 'atelier'
export type Screen = 'start' | 'playing' | 'result' | 'gameover'

const DAILY_TIME = 40
const ATELIER_START_TIME = 46
const ATELIER_FLOOR_TIME = 24

export function timeForAtelierRound(roundNumber: number): number {
  const decrements = Math.floor((roundNumber - 1) / 2) * 2
  return Math.max(ATELIER_FLOOR_TIME, ATELIER_START_TIME - decrements)
}

function shuffledBriefPool(): Brief[] {
  const pool = [...BRIEFS]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

type GameState = {
  screen: Screen
  mode: Mode
  briefQueue: Brief[]
  briefIndex: number
  equipped: Partial<Record<Slot, Item>>
  totalScore: number
  streak: number
  lives: number
  timeLeft: number
  maxTime: number
  lastResult: { score: ScoreBreakdown; critiqueLine: string } | null

  startDaily: () => void
  startAtelier: () => void
  equip: (item: Item) => void
  unequip: (slot: Slot) => void
  tick: () => void
  presentLook: () => void
  nextRound: () => void
  exitToStart: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'start',
  mode: 'daily',
  briefQueue: [],
  briefIndex: 0,
  equipped: {},
  totalScore: 0,
  streak: 0,
  lives: 3,
  timeLeft: DAILY_TIME,
  maxTime: DAILY_TIME,
  lastResult: null,

  startDaily: () => set({
    screen: 'playing',
    mode: 'daily',
    briefQueue: pickDailyBriefs(BRIEFS, new Date(), 5),
    briefIndex: 0,
    equipped: {},
    totalScore: 0,
    streak: 0,
    lives: 3,
    timeLeft: DAILY_TIME,
    maxTime: DAILY_TIME,
    lastResult: null,
  }),

  startAtelier: () => set({
    screen: 'playing',
    mode: 'atelier',
    briefQueue: shuffledBriefPool(),
    briefIndex: 0,
    equipped: {},
    totalScore: 0,
    streak: 0,
    lives: 3,
    timeLeft: ATELIER_START_TIME,
    maxTime: ATELIER_START_TIME,
    lastResult: null,
  }),

  equip: (item) => set((state) => {
    const next = { ...state.equipped }
    if (item.slot === 'dress') { delete next.top; delete next.bottom }
    if (item.slot === 'top' || item.slot === 'bottom') { delete next.dress }
    next[item.slot] = item
    return { equipped: next }
  }),

  unequip: (slot) => set((state) => {
    const next = { ...state.equipped }
    delete next[slot]
    return { equipped: next }
  }),

  tick: () => {
    const state = get()
    const timeLeft = Math.max(0, state.timeLeft - 1)
    set({ timeLeft })
    if (timeLeft === 0 && state.screen === 'playing') {
      get().presentLook()
    }
  },

  presentLook: () => set((state) => {
    const brief = state.briefQueue[state.briefIndex]
    const score = computeScore(state.equipped, brief, state.timeLeft, state.maxTime, state.streak)
    const critiqueLine = critique(state.equipped, brief, score)
    const streak = score.percent >= 75 ? state.streak + 1 : 0
    const lives = (score.grade === 'Faux Pas' && state.mode === 'atelier') ? state.lives - 1 : state.lives
    return {
      screen: 'result',
      lastResult: { score, critiqueLine },
      totalScore: state.totalScore + score.roundScore,
      streak,
      lives,
    }
  }),

  nextRound: () => set((state) => {
    const isLastDailyRound = state.mode === 'daily' && state.briefIndex + 1 >= state.briefQueue.length
    const isDead = state.mode === 'atelier' && state.lives <= 0
    if (isLastDailyRound || isDead) {
      return { screen: 'gameover' }
    }
    const nextIndex = state.briefIndex + 1
    const briefQueue = state.mode === 'atelier' && nextIndex >= state.briefQueue.length
      ? [...state.briefQueue, ...shuffledBriefPool()]
      : state.briefQueue
    const maxTime = state.mode === 'atelier' ? timeForAtelierRound(nextIndex + 1) : DAILY_TIME
    return {
      briefIndex: nextIndex,
      briefQueue,
      equipped: {},
      timeLeft: maxTime,
      maxTime,
      screen: 'playing',
    }
  }),

  exitToStart: () => set({
    screen: 'start', equipped: {}, briefQueue: [], briefIndex: 0,
    totalScore: 0, streak: 0, lives: 3, lastResult: null,
  }),
}))
