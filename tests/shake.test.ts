import { describe, expect, it } from 'vitest'
import { advanceShakeDetector, initialShakeDetectorState } from '../src/game/shake'

describe('shake detector', () => {
  it('ignores under-threshold noise', () => {
    const first = advanceShakeDetector(initialShakeDetectorState(), { x: 0, y: 0, atMs: 0 })
    const next = advanceShakeDetector(first.state, { x: 5, y: 5, atMs: 50 })
    expect(next.shakeDetected).toBe(false)
    expect(next.state.lastAxis).toBeNull()
  })

  it('detects a dominant-axis reversal', () => {
    const a = advanceShakeDetector(initialShakeDetectorState(), { x: 0, y: 0, atMs: 0 })
    const b = advanceShakeDetector(a.state, { x: 24, y: 1, atMs: 50 })
    const c = advanceShakeDetector(b.state, { x: 2, y: 1, atMs: 100 })
    expect(b.shakeDetected).toBe(false)
    expect(c.shakeDetected).toBe(true)
  })

  it('resets stale direction history', () => {
    const a = advanceShakeDetector(initialShakeDetectorState(), { x: 0, y: 0, atMs: 0 })
    const b = advanceShakeDetector(a.state, { x: 24, y: 0, atMs: 50 })
    const stale = advanceShakeDetector(b.state, { x: 0, y: 0, atMs: 300 })
    expect(stale.shakeDetected).toBe(false)
    expect(stale.state.lastSign).toBeNull()
  })
})
