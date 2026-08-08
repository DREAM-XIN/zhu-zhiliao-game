# F-ZHIZHILIAO-MVP-0001 — Implementation Notes

## Implemented

- Vue 3 + TypeScript + Vite front-end-only game flow: start → 30-second round → result → replay.
- Deterministic game core under `src/game/` for timing, shake detection, combo, scoring, modifier, titles and session transitions.
- Unified Pointer Events adapter with pointer capture for touch / mouse / pen.
- Direction-reversal shake detection with 18 px minimum movement and 220 ms stale-sample reset.
- Combo window of 650 ms with approved score multipliers and visible timeout reset.
- Injectable `RandomSource` for the 8% / 3,000 ms / 2x “竹鸣加倍” modifier.
- Result score, best combo, title mapping and replay.
- Mobile-first CSS including 320 px viewport handling.
- Accessible visible status text and focus treatment; modifier state is not color-only.
- `prefers-reduced-motion: reduce` suppresses non-essential target translation/transitions without changing game rules.
- Deterministic Vitest coverage for timer, shake, combo, scoring, modifier, titles and session behavior.

## Key files

- `src/game/constants.ts`
- `src/game/types.ts`
- `src/game/timer.ts`
- `src/game/shake.ts`
- `src/game/combo.ts`
- `src/game/scoring.ts`
- `src/game/modifier.ts`
- `src/game/titles.ts`
- `src/game/session.ts`
- `src/composables/useGameSession.ts`
- `src/composables/usePointerShake.ts`
- `src/components/GameStart.vue`
- `src/components/GameHud.vue`
- `src/components/GameBoard.vue`
- `src/components/GameResult.vue`
- `src/App.vue`
- `src/style.css`
- `tests/*.test.ts`

## Verification attempt

The required repository commands were invoked in the available execution environment:

- `npm run typecheck` → not executed to completion because `vue-tsc` is not installed in the runner (`exit 127`).
- `npm run test` → not executed to completion because `vitest` is not installed in the runner (`exit 127`).
- `npm run build` → not executed to completion because `vue-tsc` is not installed in the runner (`exit 127`).

An attempt to install the declared npm dependencies was also made, but the available npm registry path did not provide the Vue package / the direct registry attempt could not complete. This is an execution-environment dependency availability blocker, so no pass evidence is claimed.

As a narrower sanity check, the pure `src/game/**` TypeScript core was checked with the globally available TypeScript compiler in strict/no-unused mode and completed successfully. This is not a substitute for the three required repository commands.

## Lifecycle status

Implementation must remain `WORKING` until `npm run typecheck`, `npm run test`, and `npm run build` are all executed successfully in an environment with the project dependencies installed. `code-review` must not be moved to `READY` before that point.

## Known limitations

- No backend, persistence, leaderboard, device sensors or audio system were added, by design.
- Full repository verification remains pending solely because the current execution environment cannot install/use the declared npm toolchain.
