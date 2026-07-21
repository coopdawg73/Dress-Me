import { supabase } from './supabaseClient'
import { sanitizeName } from './profanity'

export type Entry = { name: string; score: number; ts: number }

const STORAGE_PREFIX = 'theEdit.lb.v1'
const TOP_KEPT = 25
const TOP_SHOWN = 10
const SANITY_CAP = 20000 // generous ceiling well above a plausible max run (SPEC §9.3)

function localKey(board: string): string {
  return `${STORAGE_PREFIX}.${board}`
}

function readLocal(board: string): Entry[] {
  const raw = localStorage.getItem(localKey(board))
  if (!raw) return []
  try {
    return JSON.parse(raw) as Entry[]
  } catch {
    return []
  }
}

function writeLocal(board: string, entries: Entry[]): void {
  const sorted = [...entries].sort((a, b) => b.score - a.score).slice(0, TOP_KEPT)
  localStorage.setItem(localKey(board), JSON.stringify(sorted))
}

export async function postScore(board: string, entry: { name: string; score: number }): Promise<void> {
  if (entry.score > SANITY_CAP || entry.score < 0) {
    throw new Error('Score rejected: outside plausible range.')
  }
  const sanitized = sanitizeName(entry.name)
  if (!sanitized.ok) {
    throw new Error(sanitized.reason)
  }
  const record: Entry = { name: sanitized.name, score: entry.score, ts: Date.now() }

  if (supabase) {
    const { error } = await supabase.from('scores').insert({ board, name: record.name, score: record.score })
    if (error) throw error
    return
  }

  const existing = readLocal(board)
  writeLocal(board, [...existing, record])
}

export async function getScores(board: string): Promise<Entry[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('scores')
      .select('name, score, created_at')
      .eq('board', board)
      .order('score', { ascending: false })
      .limit(TOP_SHOWN)
    if (error) throw error
    return (data ?? []).map(row => ({ name: row.name, score: row.score, ts: new Date(row.created_at).getTime() }))
  }

  return readLocal(board).slice(0, TOP_SHOWN)
}
