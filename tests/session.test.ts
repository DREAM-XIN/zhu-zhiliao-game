import { describe, expect, it } from 'vitest'
import { applySessionShake, startSession } from '../src/game/session'

describe('session determinism', () => {
  it('uses injected randomness for repeatable modifier behavior', () => {
    const started = startSession(0)
    const first = applySessionShake(started, 100, () => 0.01)
    expect(first.score).toBe(10)
    expect(first.modifier.active).toBe(true)

    const second = applySessionShake(first, 200, () => 0.5)
    expect(second.score).toBe(30)
    expect(second.combo).toBe(2)
  })
})
