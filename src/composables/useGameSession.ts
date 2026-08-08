import { computed, onBeforeUnmount, ref } from 'vue'
import { advanceSessionTime, applySessionShake, createSession, startSession } from '../game/session'
import { remainingMs } from '../game/timer'
import { titleForScore } from '../game/titles'
import type { RandomSource } from '../game/types'

export function useGameSession(random: RandomSource = Math.random, now: () => number = () => performance.now()) {
  const session = ref(createSession())
  const nowMs = ref(0)
  let frameId: number | null = null

  const stopClock = () => {
    if (frameId !== null) cancelAnimationFrame(frameId)
    frameId = null
  }

  const frame = () => {
    if (session.value.phase !== 'playing') {
      stopClock()
      return
    }
    nowMs.value = now()
    session.value = advanceSessionTime(session.value, nowMs.value)
    frameId = requestAnimationFrame(frame)
  }

  const start = () => {
    stopClock()
    const startedAt = now()
    nowMs.value = startedAt
    session.value = startSession(startedAt)
    frameId = requestAnimationFrame(frame)
  }

  const registerShake = (atMs: number) => {
    session.value = applySessionShake(session.value, atMs, random)
  }

  const remaining = computed(() => {
    const startedAt = session.value.startedAtMs
    return startedAt === null ? 30_000 : remainingMs(startedAt, nowMs.value)
  })
  const remainingSeconds = computed(() => Math.ceil(remaining.value / 1000))
  const resultTitle = computed(() => titleForScore(session.value.score))

  onBeforeUnmount(stopClock)

  return { session, remaining, remainingSeconds, resultTitle, start, registerShake }
}
