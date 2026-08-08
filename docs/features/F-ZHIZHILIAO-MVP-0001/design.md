# F-ZHIZHILIAO-MVP-0001 — Technical Design

## 1. Design Summary

Implement the MVP as a single-page Vue 3 application with a small deterministic game core separated from browser interaction and rendering.

```text
Vue UI / Components
        |
        v
Pointer Gesture Adapter
        |
        v
Deterministic Game Core
  - timer
  - shake detection
  - scoring
  - combo
  - modifier
  - title mapping
```

The browser layer translates Pointer Events and animation-frame timestamps into plain data. Core modules never need DOM APIs and can be tested with explicit timestamps and injected RNG.

## 2. Proposed Source Layout

```text
src/
  App.vue
  main.ts
  style.css
  game/
    constants.ts
    types.ts
    timer.ts
    shake.ts
    scoring.ts
    combo.ts
    modifier.ts
    titles.ts
    session.ts
  composables/
    useGameSession.ts
    usePointerShake.ts
  components/
    GameStart.vue
    GameHud.vue
    GameBoard.vue
    GameResult.vue

tests/
  timer.test.ts
  shake.test.ts
  scoring.test.ts
  combo.test.ts
  modifier.test.ts
  titles.test.ts
```

## 3. State Model

Application phase:

```ts
type GamePhase = 'idle' | 'playing' | 'finished'
```

Core session state:

```ts
interface GameSession {
  phase: GamePhase
  startedAtMs: number | null
  endedAtMs: number | null
  score: number
  combo: number
  bestCombo: number
  lastShakeAtMs: number | null
  modifier: ModifierState
}
```

UI state such as active pointer id, rendered drag offset and transient feedback text stays outside the core session where possible.

## 4. Timing

Constants:

```ts
ROUND_DURATION_MS = 30_000
```

Pure API:

```ts
remainingMs(startedAtMs: number, nowMs: number): number
isRoundExpired(startedAtMs: number, nowMs: number): boolean
```

Rules:

- `remainingMs` clamps to `[0, 30000]`.
- Round is expired when `nowMs - startedAtMs >= 30000`.
- `applyShake` must reject score mutation when the round is expired.
- Tests pass synthetic numbers; no test sleeps.

The UI may use `requestAnimationFrame` for display updates, but receives its time as input to the core helpers.

## 5. Pointer / Shake Detection

Use Pointer Events with pointer capture so touch, mouse and pen share the same path.

Browser adapter extracts samples:

```ts
interface PointerSample {
  x: number
  y: number
  atMs: number
}
```

MVP shake algorithm:

1. While pointer is active, compute movement delta from the previous accepted sample.
2. Ignore samples whose movement magnitude is below `MIN_SHAKE_DISTANCE_PX`.
3. Determine dominant axis (`x` or `y`) and movement sign.
4. A shake event is emitted when an accepted movement reverses sign on the dominant axis and exceeds the threshold.
5. Record the latest accepted direction and sample.

Initial constants to validate in implementation/tests:

```ts
MIN_SHAKE_DISTANCE_PX = 18
MAX_SAMPLE_GAP_MS = 220
```

A sample after `MAX_SAMPLE_GAP_MS` resets direction history rather than creating a stale reversal.

The shake detector is a pure state transition:

```ts
advanceShakeDetector(state, sample) -> {
  state,
  shakeDetected
}
```

## 6. Scoring and Combo

Constants:

```ts
BASE_SHAKE_SCORE = 10
COMBO_WINDOW_MS = 650
MAX_COMBO_MULTIPLIER = 3
```

Combo:

- First valid shake starts combo at 1.
- If next valid shake occurs within `COMBO_WINDOW_MS`, combo increments by 1.
- Otherwise combo resets to 1.
- `bestCombo = max(bestCombo, combo)`.

Multiplier:

```text
combo 1-4   => 1.0x
combo 5-9   => 1.5x
combo 10-19 => 2.0x
combo 20+   => 3.0x
```

Score per accepted shake:

```text
floor(BASE_SHAKE_SCORE * comboMultiplier * modifierMultiplier)
```

The scoring function receives all inputs explicitly and returns an integer >= 0.

## 7. Random Modifier

MVP modifier: **竹鸣加倍**.

Behavior:

- Eligible trigger checks occur after accepted shake events while no modifier is active.
- Trigger probability: 8% per eligible shake.
- Duration: 3,000 ms.
- Score multiplier while active: 2x.
- Modifier does not extend or pause the 30-second round.

Randomness is injected:

```ts
type RandomSource = () => number // [0, 1)
```

Production passes `Math.random`; tests pass fixed sequences such as `() => 0.01` or `() => 0.5`.

Pure helpers decide trigger and active state from explicit values.

## 8. Result Titles

Initial score title mapping:

```text
0-299     初醒竹鸣
300-699   竹林小将
700-1199  连鸣高手
1200+     竹海鸣王
```

Mapping is implemented as a pure function and boundary-tested.

## 9. Vue Composition

### `useGameSession`

Responsibilities:

- own reactive `GameSession`;
- start/restart round;
- expose remaining time;
- accept normalized shake events;
- apply combo, modifier and scoring transitions;
- transition to `finished` at round expiration.

It delegates calculations to `src/game/*` pure functions.

### `usePointerShake`

Responsibilities:

- pointer down/move/up/cancel;
- pointer capture;
- produce `PointerSample` data;
- maintain visual drag offset;
- call pure shake detector;
- emit normalized shake event to session composable.

No score logic belongs here.

## 10. Components

### `GameStart.vue`

- title and concise instructions;
- Start button;
- accessible instructional copy.

### `GameHud.vue`

- remaining seconds;
- score;
- current combo;
- modifier text state.

### `GameBoard.vue`

- large central bamboo-cicada interaction target;
- pointer interaction surface;
- visual shake/combo feedback;
- no dependency on real-world brands or likenesses.

### `GameResult.vue`

- final score;
- best combo;
- title;
- replay button.

`App.vue` switches between start, play and result views based on session phase.

## 11. Visual / Interaction Direction

Use a stylized fictional bamboo-grove card/arcade aesthetic built with CSS shapes, text and simple decorative elements. No external branded imagery is required for MVP.

Mobile-first layout:

- minimum supported viewport width remains 320 px;
- primary board occupies most vertical space;
- interaction target should be at least 160 px in its smallest dimension on common phones;
- prevent browser text selection and touch scrolling only on the active interaction surface (`touch-action: none`), not globally.

## 12. Reduced Motion / Accessibility

Normal mode may use short transform/scale pulses and limited floating feedback.

With `prefers-reduced-motion: reduce`:

- remove continuous swaying and large translations;
- shorten or disable non-essential transitions;
- retain score/combo/modifier feedback using text and subtle opacity/border changes;
- do not alter shake thresholds, timer, scoring, combo or modifier rules.

Controls use semantic buttons. The game target has an accessible label/instruction. Important state is available as visible text; modifier state is never color-only.

Avoid high-frequency flashing.

## 13. Testing Strategy

Vitest unit tests cover pure modules.

Required cases:

- timer: 0, 29,999, 30,000 and >30,000 ms;
- shake: under-threshold movement, valid reversal, stale sample reset;
- combo: first event, inside window, outside window, multiplier boundaries;
- scoring: base, combo multipliers, modifier multiplier, non-negative integer output;
- modifier: forced trigger/non-trigger and expiry with deterministic RNG;
- titles: all score thresholds.

UI integration tests are optional for MVP unless implementation complexity demands them; core acceptance does not depend on browser-event simulation for scoring/timing correctness.

## 14. Engineering / Verification Contract

The implementation must preserve the repository commands declared by `.ai-sdlc/project.yaml`:

```text
npm run typecheck
npm run test
npm run build
```

All three must pass before Verification can pass.

## 15. Design Risks and Mitigations

### Gesture sensitivity varies by device

Mitigation: use pointer-coordinate thresholds in a pure detector, keep constants centralized, and test noise/reversal behavior. Implementation may tune constants without changing the requirement contract.

### Random event makes tests flaky

Mitigation: injected random source and deterministic trigger helper.

### UI timer drifts from logical timer

Mitigation: derive displayed remaining time from `startedAtMs` + current timestamp instead of decrementing an independent counter.

### Animation conflicts with reduced motion

Mitigation: isolate presentation motion in CSS/media query and keep core mechanics independent.

## 16. Explicit Non-Decisions

- No backend/API/storage architecture.
- No persistence of scores in MVP.
- No device accelerometer/gyroscope requirement.
- No audio dependency for successful play.
- No canvas/WebGL requirement; normal Vue DOM/CSS is sufficient.
