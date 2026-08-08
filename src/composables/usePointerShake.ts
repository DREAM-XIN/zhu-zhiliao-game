import { ref } from 'vue'
import { advanceShakeDetector, initialShakeDetectorState } from '../game/shake'
import type { ShakeDetectorState } from '../game/types'

export function usePointerShake(onShake: (atMs: number) => void, now: () => number = () => performance.now()) {
  const activePointerId = ref<number | null>(null)
  const offsetX = ref(0)
  const offsetY = ref(0)
  let originX = 0
  let originY = 0
  let detector: ShakeDetectorState = initialShakeDetectorState()

  const onPointerDown = (event: PointerEvent) => {
    if (activePointerId.value !== null) return
    activePointerId.value = event.pointerId
    originX = event.clientX
    originY = event.clientY
    detector = initialShakeDetectorState()
    detector = advanceShakeDetector(detector, { x: event.clientX, y: event.clientY, atMs: now() }).state
    ;(event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (activePointerId.value !== event.pointerId) return
    offsetX.value = Math.max(-42, Math.min(42, event.clientX - originX))
    offsetY.value = Math.max(-42, Math.min(42, event.clientY - originY))
    const atMs = now()
    const result = advanceShakeDetector(detector, { x: event.clientX, y: event.clientY, atMs })
    detector = result.state
    if (result.shakeDetected) onShake(atMs)
  }

  const finishPointer = (event: PointerEvent) => {
    if (activePointerId.value !== event.pointerId) return
    ;(event.currentTarget as HTMLElement | null)?.releasePointerCapture?.(event.pointerId)
    activePointerId.value = null
    offsetX.value = 0
    offsetY.value = 0
    detector = initialShakeDetectorState()
  }

  return {
    activePointerId,
    offsetX,
    offsetY,
    onPointerDown,
    onPointerMove,
    onPointerUp: finishPointer,
    onPointerCancel: finishPointer,
  }
}
