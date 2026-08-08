# F-ZHIZHILIAO-MVP-0001 — Implementation Plan

## Goal

Implement the approved mobile-first bamboo-cicada game MVP from `requirement-v1` and `design-v1` without changing the approved product or technical contract.

## Implementation order

### P1 — Deterministic game core

Create the pure TypeScript modules under `src/game/`:

- `constants.ts`
- `types.ts`
- `timer.ts`
- `shake.ts`
- `combo.ts`
- `scoring.ts`
- `modifier.ts`
- `titles.ts`
- `session.ts`

Definition of done:

- 30-second timing logic is based on explicit timestamps.
- Shake detection is a pure state transition.
- Combo/scoring logic is deterministic.
- Random modifier accepts an injected RNG.
- Result-title mapping is a pure function.
- No DOM/browser dependencies exist in these modules.

### P2 — Deterministic unit tests

Create Vitest coverage under `tests/` for:

- timer boundaries: 0, 29,999, 30,000 and >30,000 ms;
- shake threshold, valid reversal and stale sample reset;
- combo window and multiplier boundaries;
- scoring with combo and modifier multipliers;
- modifier forced trigger/non-trigger/expiry with deterministic RNG;
- title threshold boundaries.

Definition of done:

- Tests do not sleep or depend on real clock time.
- Tests do not depend on uncontrolled `Math.random()`.

### P3 — Session composable

Implement `useGameSession.ts`.

Definition of done:

- Supports idle → playing → finished transitions.
- Starts/restarts a 30-second round.
- Delegates scoring/timing/combo/modifier calculations to pure game modules.
- Rejects score changes after round expiry.

### P4 — Pointer gesture adapter

Implement `usePointerShake.ts` using Pointer Events.

Definition of done:

- Touch, mouse and pen share one input path.
- Uses pointer capture where appropriate.
- Converts pointer movement into `PointerSample` values for the pure shake detector.
- Keeps browser interaction logic separate from scoring logic.
- Uses `touch-action: none` only on the active game surface.

### P5 — Game UI

Implement:

- `GameStart.vue`
- `GameHud.vue`
- `GameBoard.vue`
- `GameResult.vue`
- update `App.vue`
- update global styles as needed

Definition of done:

- Mobile-first layout works at 320px viewport width.
- Gameplay surface is large enough for touch interaction.
- HUD exposes time, score, combo and modifier as visible text.
- Result screen shows final score, best combo, title and replay action.
- Theme remains fictional and unbranded.

### P6 — Accessibility and reduced motion

Definition of done:

- Controls are semantic and keyboard-focusable where applicable.
- Interaction target has accessible instructional labeling.
- Modifier feedback is not color-only.
- `prefers-reduced-motion: reduce` disables or reduces non-essential motion without changing gameplay mechanics.
- No high-frequency flashing is introduced.

### P7 — Verification readiness

Run the repository-required commands:

```text
npm run typecheck
npm run test
npm run build
```

Definition of done:

- All three commands pass.
- Any implementation-time tuning of gesture constants remains within the approved Design contract.
- No backend, persistence, gyroscope/accelerometer, canvas/WebGL or branded assets are added.

## Dependencies

- P1 precedes P3 and provides the core contract for P2.
- P2 can progress alongside later UI work once P1 APIs stabilize.
- P3 precedes final P5 integration.
- P4 precedes final GameBoard integration.
- P6 is integrated during P5, then explicitly checked before completion.
- P7 is the final developer check before Code Review.

## Developer scope

Allowed primary scope:

- `src/**`
- `tests/**`
- project configuration only when required for the approved implementation/tests
- implementation evidence/artifacts and Feature Events

Forbidden:

- direct edits to `state/features/F-ZHIZHILIAO-MVP-0001.yaml`
- changes to approved requirement/design scope without returning through the lifecycle
- implementation directly on `main`

## Handoff

The next lifecycle role after Planning is `developer` in the `implementation` stage. The Developer should implement this plan on `feature/F-ZHIZHILIAO-MVP-0001`, run the required checks, produce implementation evidence/Feature Event, and never modify the authoritative Feature Manifest directly.
