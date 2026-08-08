# F-ZHIZHILIAO-MVP-0001 — Design Review

## Review metadata

- Role: independent Design Reviewer
- Feature: `F-ZHIZHILIAO-MVP-0001`
- Reviewed artifact: `design-v1`
- Reviewed URI: `docs/features/F-ZHIZHILIAO-MVP-0001/design.md`
- Requirement baseline: approved `requirement-v1`
- Manifest revision reviewed: `6`
- Conclusion: **PASS**

## Summary

`design-v1` is sufficiently complete, deterministic, and bounded for implementation of the approved MVP requirement. It preserves the required Vue 3 + TypeScript + Vite frontend-only architecture, separates browser/UI concerns from a deterministic game core, defines concrete gesture/scoring/combo/modifier rules, and provides a credible verification path through the repository-declared `typecheck`, `test`, and `build` commands.

No blocking design defect was found.

## Findings

### 1. Requirement coverage — PASS

The design covers the approved product flow and all material gameplay requirements:

- start, playing HUD, and result phases;
- fixed 30,000 ms round;
- pointer-driven shake/drag scoring;
- Combo/streak behavior and best Combo result;
- one random gameplay modifier;
- score title mapping;
- reduced-motion and accessibility behavior;
- deterministic unit testing of timing/scoring and boundary logic.

The Requirement's open design decisions are concretely resolved with thresholds, windows, multipliers, modifier behavior, title ranges, and component/module boundaries.

### 2. Architecture and scope — PASS

The design remains a Vue 3 + TypeScript + Vite single-page frontend-only application. It introduces no backend, database, account, persistence, device sensor, canvas/WebGL, or heavyweight physics dependency.

The split between Vue/composables and `src/game/*` pure logic is appropriate for the MVP and is not excessive. UI-only state such as active pointer id, drag offset, and transient feedback is kept outside the deterministic session state.

### 3. Deterministic 30-second timing — PASS

Timing is based on explicit `startedAtMs` / `nowMs` inputs and `ROUND_DURATION_MS = 30_000`. The design explicitly requires expiration at `elapsed >= 30000`, score rejection after expiry, clamped remaining time, and synthetic timestamps in tests with no sleeping.

Using `requestAnimationFrame` only as a UI refresh source does not make the game core depend on wall-clock waits.

### 4. Shake / drag input — PASS

The design uses Pointer Events and pointer capture for touch, mouse, and pen through one browser adapter. DOM events are normalized into plain `PointerSample` values before entering pure logic.

The proposed detector filters movement below `MIN_SHAKE_DISTANCE_PX = 18`, requires a dominant-axis direction reversal for a shake, and resets stale direction history after `MAX_SAMPLE_GAP_MS = 220`. This is a reasonable MVP algorithm that prevents trivial micro-jitter scoring while remaining deterministic and unit-testable.

### 5. Scoring / Combo — PASS

Scoring inputs are explicit and the formula is deterministic:

`floor(BASE_SHAKE_SCORE * comboMultiplier * modifierMultiplier)`

Combo behavior is fully specified: first shake => 1, continuation within `COMBO_WINDOW_MS = 650`, otherwise reset to 1, with deterministic multiplier bands capped at 3x. `bestCombo` is explicitly derived.

These rules are appropriate for pure functions and boundary-focused tests.

### 6. Random modifier — PASS

The `竹鸣加倍` modifier defines trigger eligibility, 8% trigger probability, 3,000 ms duration, and 2x multiplier. Randomness is injected as `RandomSource = () => number`, with production using `Math.random` and tests using fixed sequences.

This satisfies the requirement that identical random sequences and identical inputs can produce identical results. The modifier does not alter or pause round timing.

### 7. UI/core separation — PASS

`useGameSession` owns orchestration/reactive state but delegates mechanics to pure `src/game/*` helpers. `usePointerShake` owns pointer lifecycle, pointer capture, visual drag offset, and normalization, while score logic remains outside the input adapter.

This separation is sufficient to avoid coupling game correctness to DOM timing or Vue rendering.

### 8. Reduced motion / accessibility — PASS

Reduced motion is operationalized rather than merely mentioned: continuous sway and large translations are removed, non-essential transitions are reduced, text/subtle visual feedback remains, and core gameplay constants/results are unchanged.

Accessibility guidance includes semantic buttons, an accessible game-target label/instruction, visible text for important state, non-color-only modifier state, mobile-sized interaction target, scoped `touch-action: none`, and avoidance of high-frequency flashing.

These provisions are proportionate to the approved pointer-based MVP requirement.

### 9. Complexity / implementation risk — PASS

The design is small and modular without introducing unnecessary frameworks, services, rendering engines, persistence, or abstractions. The proposed module split is justified by deterministic test boundaries.

Device-dependent gesture sensitivity remains a tuning risk, but it is explicitly mitigated by centralized constants and a pure detector; it does not block implementation.

### 10. Verification contract — PASS

The repository's `.ai-sdlc/project.yaml` declares `typecheck`, `test`, and `build`, and the current `package.json` provides matching scripts:

- `npm run typecheck` -> `vue-tsc -b`
- `npm run test` -> `vitest run`
- `npm run build` -> `vue-tsc -b && vite build`

The design's Vitest plan covers the required deterministic timer, shake, combo, scoring, modifier, and title boundaries. The verification path is therefore structurally valid.

## Non-blocking implementation notes

These are implementation details to preserve, not reasons to fail the design:

1. Keep modifier activation/expiry ordering explicit when applying a shake so the implementation and tests agree on whether the trigger-producing shake receives the new multiplier.
2. Ensure pointer cancel/lost capture cleanly resets adapter state so stale direction data cannot leak into a new drag.
3. Drive any displayed countdown from the same logical elapsed-time model used for expiry rather than a separately decremented counter.

## Gate recommendation

- Review evidence: **PASS**
- Approve artifact: `design-v1`
- `design-gate`: **PASS**
- `design-review`: **DONE**
- Next stage `plan`: **READY**

The Reviewer does not authorize or perform Planning or Implementation in this review.
