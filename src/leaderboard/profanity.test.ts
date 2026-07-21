import { describe, it, expect } from 'vitest'
import { sanitizeName } from './profanity'

describe('sanitizeName', () => {
  it('accepts a normal name, trimmed', () => {
    expect(sanitizeName('  Cooper  ')).toEqual({ ok: true, name: 'Cooper' })
  })

  it('rejects an empty name', () => {
    expect(sanitizeName('   ').ok).toBe(false)
  })

  it('rejects a name over 20 characters', () => {
    const result = sanitizeName('a'.repeat(21))
    expect(result.ok).toBe(false)
  })

  it('rejects a name containing a blocked word, case-insensitively', () => {
    expect(sanitizeName('fuckyou').ok).toBe(false)
    expect(sanitizeName('FuckYou').ok).toBe(false)
  })

  it('accepts a 20-character name exactly', () => {
    expect(sanitizeName('a'.repeat(20)).ok).toBe(true)
  })
})
