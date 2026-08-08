import { MAX_SAMPLE_GAP_MS, MIN_SHAKE_DISTANCE_PX } from './constants'
import type { DominantAxis, DirectionSign, PointerSample, ShakeDetectorState } from './types'

export const initialShakeDetectorState = (): ShakeDetectorState => ({
  lastAcceptedSample: null,
  lastAxis: null,
  lastSign: null,
})

function direction(delta: number): DirectionSign {
  return delta < 0 ? -1 : 1
}

export function advanceShakeDetector(
  state: ShakeDetectorState,
  sample: PointerSample,
): { state: ShakeDetectorState; shakeDetected: boolean } {
  const previous = state.lastAcceptedSample
  if (previous === null) {
    return { state: { ...state, lastAcceptedSample: sample }, shakeDetected: false }
  }

  const gap = sample.atMs - previous.atMs
  if (gap < 0 || gap > MAX_SAMPLE_GAP_MS) {
    return {
      state: { lastAcceptedSample: sample, lastAxis: null, lastSign: null },
      shakeDetected: false,
    }
  }

  const dx = sample.x - previous.x
  const dy = sample.y - previous.y
  const magnitude = Math.hypot(dx, dy)
  if (magnitude < MIN_SHAKE_DISTANCE_PX) return { state, shakeDetected: false }

  const axis: DominantAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y'
  const sign = direction(axis === 'x' ? dx : dy)
  const shakeDetected = state.lastAxis === axis && state.lastSign !== null && state.lastSign !== sign

  return {
    state: { lastAcceptedSample: sample, lastAxis: axis, lastSign: sign },
    shakeDetected,
  }
}
