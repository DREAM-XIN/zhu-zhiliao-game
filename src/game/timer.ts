import { ROUND_DURATION_MS } from './constants'

export function remainingMs(startedAtMs: number, nowMs: number): number {
  const elapsed = Math.max(0, nowMs - startedAtMs)
  return Math.max(0, Math.min(ROUND_DURATION_MS, ROUND_DURATION_MS - elapsed))
}

export function isRoundExpired(startedAtMs: number, nowMs: number): boolean {
  return nowMs - startedAtMs >= ROUND_DURATION_MS
}
