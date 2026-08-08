# F-ZHIZHILIAO-MVP-0001 — Code Review

## Review scope

Independent review of the implementation on `feature/F-ZHIZHILIAO-MVP-0001` against approved `requirement-v1`, `design-v1`, implementation plan, implementation evidence, CI workflow, package metadata/lockfile, and the feature branch diff relative to `main`.

Starting authoritative state: revision 12, `current_stage: code-review`, implementation `DONE`, code-review `READY`, code-gate `PENDING`.

## Conclusion

**PASS**

No blocking correctness, requirement, reliability, security, or lifecycle issue was found in the delivered MVP.

## Blocking findings

None.

## Requirement / design checks

- Frontend-only Vue 3 + TypeScript + Vite architecture is preserved; no backend, persistence, account, sensor, canvas/WebGL, branded asset, or real-person dependency was introduced.
- Round duration is driven from explicit timestamps. `remainingMs()` derives from `startedAtMs` and `nowMs`; the UI uses RAF only to refresh derived state, not a drifting decrement counter.
- `elapsed >= 30000` ends the session and `applySessionShake()` refuses mutation once the timed state is finished. End-of-round input therefore cannot increase score or combo.
- Shake detection follows the approved 18 px minimum distance, dominant-axis sign reversal, and 220 ms stale-sample reset. Detector logic is pure and browser-independent.
- Pointer input uses a single Pointer Events path for touch/mouse/pen and captures the active pointer. Scoring remains outside the pointer adapter.
- Combo semantics match design: first shake = 1, window = 650 ms inclusive, timeout beyond 650 ms resets, and multipliers are 1x / 1.5x / 2x / 3x at the approved boundaries.
- Modifier semantics match design: eligible check after an accepted shake when inactive, 8% probability, 3000 ms duration, 2x score while active, explicit expiry, and injected `RandomSource`. The triggering shake itself is scored before the newly triggered modifier becomes active, consistent with “trigger checks occur after accepted shake events.”
- Title mapping matches 0-299 / 300-699 / 700-1199 / 1200+ boundaries.
- Replay calls `startSession()` through the session composable and resets score, combo, best combo, timestamps, and modifier state.
- Vue composables are separated from the deterministic core: timing/scoring/combo/modifier/shake/title rules live under `src/game/**`; DOM/pointer behavior lives in the adapter/components.
- RAF is cancelled on restart and unmount. When a frame transitions the game to finished, at most one already-scheduled follow-up frame is used to observe the non-playing phase and cancel itself; no persistent RAF leak was found.
- Accessibility requirements are met at MVP level: semantic buttons, visible instructions/status, accessible label on the interaction target, non-color-only modifier state, focus treatment, and polite live status text.
- `prefers-reduced-motion` suppresses presentation transforms/transitions without changing thresholds, time, combo, modifier, or scoring rules.
- Mobile CSS explicitly supports a 320 px minimum viewport and keeps the interaction target large; no obvious 320 px overflow defect is present in the reviewed styles.
- No real company trademark, real-person likeness, external branded image, or misleading real-world claim appears in the reviewed implementation.

## Tests and CI evidence

- Deterministic tests cover timing boundaries including 30000 ms and score rejection, shake threshold/reversal/stale reset, combo window/multiplier behavior, scoring, deterministic modifier trigger/expiry, titles, and session behavior.
- The GitHub Actions `Implementation CI` workflow installs with `npm ci`, then runs the repository-required `typecheck`, `test`, and `build` commands.
- Implementation verification evidence records successful run `31258778384` / job `93106214905`: 7 test files, 15 tests, typecheck PASS, tests PASS, build PASS.
- A committed lockfileVersion 3 `package-lock.json` is present and CI uses `npm ci`, providing reproducible dependency installation for the reviewed commit.

## Non-blocking findings

1. `docs/features/F-ZHIZHILIAO-MVP-0001/implementation.md` still contains an earlier environment-blocker narrative and says implementation should remain WORKING. This is stale relative to the later GitHub Actions pass evidence and authoritative revision 12 state. It should be refreshed in a later documentation cleanup, but the later evidence and manifest are unambiguous and this does not invalidate the code.
2. `usePointerShake.finishPointer()` always calls `releasePointerCapture()` and is also wired to `lostpointercapture`. A more defensive browser adapter would make cleanup idempotent and avoid attempting explicit release from the already-lost-capture path; adding adapter-level tests for pointerup/cancel/lostcapture would improve robustness. The deterministic game core and normal pointer path are unaffected, so this is not Gate-blocking for the MVP.
3. The current tests are intentionally core-heavy and do not simulate Pointer Events or 320 px browser layout. This is allowed by the approved Design, but a future iteration would benefit from lightweight component/browser coverage for the input adapter, replay UI, accessibility names, and narrow viewport smoke behavior.

## Gate recommendation

Approve `implementation-v1`, mark code-review DONE, set code-gate PASS with review evidence, and move verification to READY. Do not execute Verification as part of this review.
