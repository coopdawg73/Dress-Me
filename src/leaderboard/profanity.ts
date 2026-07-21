const MAX_LENGTH = 20

// Minimal starter block-list. Extend as needed — this is a light filter
// appropriate to a marketing toy, not a moderation system (SPEC §9.3).
const BLOCKED_WORDS = ['fuck', 'shit', 'bitch', 'cunt', 'nigger', 'faggot', 'retard']

export type SanitizeResult = { ok: true; name: string } | { ok: false; reason: string }

export function sanitizeName(raw: string): SanitizeResult {
  const name = raw.trim()
  if (name.length === 0) return { ok: false, reason: 'Name cannot be empty.' }
  if (name.length > MAX_LENGTH) return { ok: false, reason: `Name must be ${MAX_LENGTH} characters or fewer.` }
  const lower = name.toLowerCase()
  if (BLOCKED_WORDS.some(word => lower.includes(word))) {
    return { ok: false, reason: 'Please choose a different name.' }
  }
  return { ok: true, name }
}
