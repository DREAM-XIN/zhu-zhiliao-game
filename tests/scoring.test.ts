import { describe, expect, it } from 'vitest'
import { scoreShake } from '../src/game/scoring'

describe('scoring', () => {
  it('applies combo and modifier multipliers', () => {
    expect(scoreShake(1, 1)).toBe(10)
    expect(scoreShake(1.5, 1)).toBe(15)
    expect(scoreShake(2, 2)).toBe(40)
    expect(scoreShake(3, 2)).toBe(60)
  })

  it('never produces a negative score', () => {
    expect(scoreShake(-1, 2)).toBe(0)
    expect(scoreShake(2, -1)).toBe(0)
  })
})
