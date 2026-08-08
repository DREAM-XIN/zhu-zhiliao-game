import { describe, expect, it } from 'vitest'
import { comboMultiplier, nextCombo } from '../src/game/combo'

describe('combo', () => {
  it('starts, grows inside the window and resets outside it', () => {
    expect(nextCombo(null, 0, 100)).toBe(1)
    expect(nextCombo(100, 1, 750)).toBe(2)
    expect(nextCombo(100, 7, 751)).toBe(1)
  })

  it('maps multiplier boundaries', () => {
    expect(comboMultiplier(1)).toBe(1)
    expect(comboMultiplier(4)).toBe(1)
    expect(comboMultiplier(5)).toBe(1.5)
    expect(comboMultiplier(9)).toBe(1.5)
    expect(comboMultiplier(10)).toBe(2)
    expect(comboMultiplier(19)).toBe(2)
    expect(comboMultiplier(20)).toBe(3)
  })
})
