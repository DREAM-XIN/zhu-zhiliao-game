import { describe, expect, it } from 'vitest'
import { inactiveModifier, maybeTriggerModifier, modifierMultiplier, normalizeModifier } from '../src/game/modifier'

describe('modifier', () => {
  it('triggers with deterministic low roll', () => {
    const active = maybeTriggerModifier(inactiveModifier(), 1000, () => 0.01)
    expect(active).toEqual({ active: true, endsAtMs: 4000 })
    expect(modifierMultiplier(active, 3999)).toBe(2)
  })

  it('does not trigger with deterministic high roll', () => {
    expect(maybeTriggerModifier(inactiveModifier(), 1000, () => 0.5)).toEqual(inactiveModifier())
  })

  it('expires exactly at the duration boundary', () => {
    const state = { active: true, endsAtMs: 4000 }
    expect(normalizeModifier(state, 3999).active).toBe(true)
    expect(normalizeModifier(state, 4000)).toEqual(inactiveModifier())
  })
})
