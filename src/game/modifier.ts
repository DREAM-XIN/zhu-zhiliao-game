import {
  MODIFIER_DURATION_MS,
  MODIFIER_SCORE_MULTIPLIER,
  MODIFIER_TRIGGER_PROBABILITY,
} from './constants'
import type { ModifierState, RandomSource } from './types'

export const inactiveModifier = (): ModifierState => ({ active: false, endsAtMs: null })

export function normalizeModifier(state: ModifierState, nowMs: number): ModifierState {
  if (!state.active || state.endsAtMs === null || nowMs < state.endsAtMs) return state
  return inactiveModifier()
}

export function modifierMultiplier(state: ModifierState, nowMs: number): number {
  return normalizeModifier(state, nowMs).active ? MODIFIER_SCORE_MULTIPLIER : 1
}

export function maybeTriggerModifier(
  state: ModifierState,
  nowMs: number,
  random: RandomSource,
): ModifierState {
  const normalized = normalizeModifier(state, nowMs)
  if (normalized.active) return normalized
  const roll = random()
  if (roll < 0 || roll >= 1) throw new RangeError('RandomSource must return a value in [0, 1)')
  return roll < MODIFIER_TRIGGER_PROBABILITY
    ? { active: true, endsAtMs: nowMs + MODIFIER_DURATION_MS }
    : normalized
}
