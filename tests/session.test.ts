import { describe, expect, it } from 'vitest'
import { advanceSessionTime, applySessionShake, startSession } from '../src/game/session'

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

  it('drops the visible combo after the combo window without a new shake', () => {
    const first = applySessionShake(startSession(0), 100, () => 0.5)
    expect(advanceSessionTime(first, 750).combo).toBe(1)
    const expired = advanceSessionTime(first, 751)
    expect(expired.combo).toBe(0)
    expect(expired.lastShakeAtMs).toBeNull()
  })
})
