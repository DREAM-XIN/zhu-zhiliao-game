export type GamePhase = 'idle' | 'playing' | 'finished'
export type RandomSource = () => number

export interface ModifierState {
  active: boolean
  endsAtMs: number | null
}

export interface GameSession {
  phase: GamePhase
  startedAtMs: number | null
  endedAtMs: number | null
  score: number
  combo: number
  bestCombo: number
  lastShakeAtMs: number | null
  modifier: ModifierState
}

export interface PointerSample {
  x: number
  y: number
  atMs: number
}

export type DominantAxis = 'x' | 'y'
export type DirectionSign = -1 | 1

export interface ShakeDetectorState {
  lastAcceptedSample: PointerSample | null
  lastAxis: DominantAxis | null
  lastSign: DirectionSign | null
}
