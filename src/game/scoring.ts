import { BASE_SHAKE_SCORE } from './constants'

export function scoreShake(comboMultiplier: number, modifierMultiplier: number): number {
  const safeCombo = Math.max(0, comboMultiplier)
  const safeModifier = Math.max(0, modifierMultiplier)
  return Math.max(0, Math.floor(BASE_SHAKE_SCORE * safeCombo * safeModifier))
}
