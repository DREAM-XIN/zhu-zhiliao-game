import { describe, expect, it } from 'vitest'
import { titleForScore } from '../src/game/titles'

describe('titles', () => {
  it('maps all approved score boundaries', () => {
    expect(titleForScore(0)).toBe('初醒竹鸣')
    expect(titleForScore(299)).toBe('初醒竹鸣')
    expect(titleForScore(300)).toBe('竹林小将')
    expect(titleForScore(699)).toBe('竹林小将')
    expect(titleForScore(700)).toBe('连鸣高手')
    expect(titleForScore(1199)).toBe('连鸣高手')
    expect(titleForScore(1200)).toBe('竹海鸣王')
  })
})
