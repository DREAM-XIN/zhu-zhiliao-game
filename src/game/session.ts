import { COMBO_WINDOW_MS, ROUND_DURATION_MS } from './constants'
import { comboMultiplier, nextCombo } from './combo'
import { inactiveModifier, maybeTriggerModifier, modifierMultiplier, normalizeModifier } from './modifier'
import { scoreShake } from './scoring'
import { isRoundExpired } from './timer'
import type { GameSession, RandomSource } from './types'

export function createSession(): GameSession {
  return {
    phase: 'idle',
    startedAtMs: null,
    endedAtMs: null,
    score: 0,
    combo: 0,
    bestCombo: 0,
    lastShakeAtMs: null,
    modifier: inactiveModifier(),
  }
}

export function startSession(atMs: number): GameSession {
  return { ...createSession(), phase: 'playing', startedAtMs: atMs }
}

export function advanceSessionTime(session: GameSession, nowMs: number): GameSession {
  if (session.phase !== 'playing' || session.startedAtMs === null) return session
  if (isRoundExpired(session.startedAtMs, nowMs)) {
    return {
      ...session,
      phase: 'finished',
      endedAtMs: session.startedAtMs + ROUND_DURATION_MS,
      combo: 0,
      lastShakeAtMs: null,
      modifier: inactiveModifier(),
    }
  }

  const comboExpired = session.lastShakeAtMs !== null && nowMs - session.lastShakeAtMs > COMBO_WINDOW_MS
  return {
    ...session,
    combo: comboExpired ? 0 : session.combo,
    lastShakeAtMs: comboExpired ? null : session.lastShakeAtMs,
    modifier: normalizeModifier(session.modifier, nowMs),
  }
}

export function applySessionShake(
  session: GameSession,
  atMs: number,
  random: RandomSource,
): GameSession {
  const timed = advanceSessionTime(session, atMs)
  if (timed.phase !== 'playing') return timed

  const combo = nextCombo(timed.lastShakeAtMs, timed.combo, atMs)
  const points = scoreShake(comboMultiplier(combo), modifierMultiplier(timed.modifier, atMs))
  const modifier = maybeTriggerModifier(timed.modifier, atMs, random)

  return {
    ...timed,
    score: timed.score + points,
    combo,
    bestCombo: Math.max(timed.bestCombo, combo),
    lastShakeAtMs: atMs,
    modifier,
  }
}
