import { COMBO_WINDOW_MS, MAX_COMBO_MULTIPLIER } from './constants'

export function nextCombo(lastShakeAtMs: number | null, combo: number, atMs: number): number {
  if (lastShakeAtMs === null || atMs - lastShakeAtMs > COMBO_WINDOW_MS) return 1
  return Math.max(1, combo + 1)
}

export function comboMultiplier(combo: number): number {
  if (combo >= 20) return MAX_COMBO_MULTIPLIER
  if (combo >= 10) return 2
  if (combo >= 5) return 1.5
  return 1
}
