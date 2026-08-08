import { describe, expect, it } from 'vitest'
import { applySessionShake, startSession } from '../src/game/session'
import { isRoundExpired, remainingMs } from '../src/game/timer'

describe('timer', () => {
  it('handles 0, 29,999, 30,000 and later milliseconds', () => {
    const start = 1000
    expect(remainingMs(start, start)).toBe(30000)
    expect(remainingMs(start, start + 29999)).toBe(1)
    expect(remainingMs(start, start + 30000)).toBe(0)
    expect(remainingMs(start, start + 31000)).toBe(0)
    expect(isRoundExpired(start, start + 29999)).toBe(false)
    expect(isRoundExpired(start, start + 30000)).toBe(true)
  })

  it('rejects scoring at and after round expiry', () => {
    const atEnd = applySessionShake(startSession(1000), 31000, () => 0.5)
    expect(atEnd.phase).toBe('finished')
    expect(atEnd.score).toBe(0)
    expect(atEnd.combo).toBe(0)
  })
})
