# Design Review — F-ZHIZHILIAO-DEPLOY-0002

## Decision

**PASS** — The Design is aligned with the approved Requirement, technically implementable with current Vite and GitHub Pages mechanisms, and provides a verification strategy strong enough to support implementation and later acceptance. No blocking finding prevents `design-gate: PASS`.

## Requirement alignment

PASS.

- Preserves the existing Vue 3 + TypeScript + Vite pure-frontend architecture.
- Introduces no backend, database, server runtime, container, VM, Nginx, SSR, authentication, leaderboard, or persistent service.
- Keeps the Feature deployment-only and explicitly excludes gameplay/rules/scoring/timing/controls/progression changes.
- Keeps `main` as the normal production deployment source.
- Uses the existing committed `package-lock.json` with `npm ci`.
- Requires the repository-mandated checks `npm run typecheck`, `npm run test`, and `npm run build` before artifact publication/deployment.

## Vite base strategy

PASS.

The fixed configuration:

```ts
base: '/zhu-zhiliao-game/'
```

is correct for the standard GitHub Pages project-site URL for repository `DREAM-XIN/zhu-zhiliao-game`, where the site is served under `/zhu-zhiliao-game/`.

Vite applies `base` to development, build, and preview. A fixed absolute base therefore also makes local Vite dev use the repository-prefixed public path. This is supported Vite behavior and does not make development or tests unusable. It is a small local-URL/developer-experience difference, not a deployment blocker. Given this Feature has one defined production repository Pages location, a fixed base is sufficiently simple and correct; a production-only conditional base is optional rather than required.

If implementation finds application-owned hard-coded root-relative asset/navigation URLs, only narrowly scoped deployment-path corrections are authorized; gameplay semantics remain out of scope.

## GitHub Pages workflow design

PASS.

The Design uses the supported Pages architecture and explicitly requires official GitHub Actions:

1. `actions/checkout`
2. `actions/setup-node`
3. `npm ci`
4. `npm run typecheck`
5. `npm run test`
6. `npm run build`
7. `actions/configure-pages`
8. `actions/upload-pages-artifact` for `./dist`
9. a separate deploy job using `actions/deploy-pages`

The deploy job declares `needs: build`, so dependency install, validation, build, and artifact publication failures prevent deploy. Required steps are fail-fast and the Design forbids `continue-on-error` and deploy-side `if: always()` bypasses.

The requested permissions are appropriate and minimal for this workflow:

- `contents: read`
- `pages: write`
- `id-token: write`

The `github-pages` environment and deployment URL output are appropriate for Pages deployments.

The Design also correctly separates the new production Pages workflow from existing AI-SDLC lifecycle workflows and explicitly forbids repurposing or weakening them.

## Trigger and concurrency

PASS.

`push` to `main` is the required normal production trigger. Optional `workflow_dispatch` is acceptable only because the Design requires it to use the same validation/build path and not bypass checks.

A single Pages concurrency group with `cancel-in-progress: true` is supported by GitHub Actions and is reasonable for a latest-main-wins deployment model. Implementation should keep the group dedicated to the Pages workflow so it cannot accidentally cancel unrelated workflows.

## Repository Settings / platform prerequisite

PASS.

The Design correctly distinguishes repository-controlled code from the one-time GitHub Pages platform prerequisite in **Settings → Pages**. If GitHub Actions is not enabled as the Pages publishing source, an authorized maintainer action may be required. The Design correctly treats this as platform configuration/evidence, not as application code.

It also correctly states that the expected URL `https://dream-xin.github.io/zhu-zhiliao-game/` is not itself proof of deployment success; the authoritative URL must be obtained from a successful deployment and then verified publicly.

## Verification strategy

PASS.

The Design is externally verifiable and covers all critical layers:

- workflow trigger and successful build/deploy job relationship;
- evidence that `npm ci`, typecheck, test, and build executed successfully in order;
- Pages artifact creation from `dist/`;
- real deployment output/public URL;
- public root HTTP success and absence of Pages 404;
- JavaScript/CSS/static asset success under the repository base path;
- representative desktop rendering and start-to-gameplay verification;
- representative mobile/mobile-viewport rendering and playability;
- regression execution of typecheck/test/build.

It correctly rejects YAML inspection or an expected URL string as sufficient acceptance evidence.

## Failure / rollback review

PASS.

- Dependency/check/build failure prevents artifact deployment.
- Artifact/deploy failure remains visibly failed.
- A previous successful Pages release remains the effective site subject to normal GitHub Pages platform behavior.
- Recovery through reverting/correcting `main` and redeploying a known-good static revision is appropriate for a stateless frontend.
- No data/database rollback is invented.

## Existing repository compatibility

PASS.

The current repository exposes the required npm scripts and has a committed lockfile. The current `vite.config.ts` has no Pages base yet, so adding the approved base is a bounded implementation change. Existing AI-SDLC Persist workflow state authority remains separate from the proposed Pages workflow; the Design explicitly instructs implementation not to modify lifecycle workflows unless a separate control-plane defect is discovered.

## Blocking findings

None.

## Non-blocking findings

1. **Fixed base changes local dev URL shape** — Because Vite `base` applies in development as well as build, local dev is naturally served with the `/zhu-zhiliao-game/` base path. This is supported and does not make dev/test unusable. A mode-dependent production-only base could preserve a root-path local dev URL, but it adds configuration complexity and is not required for this Feature.
2. **Concurrency group isolation** — `group: pages` with `cancel-in-progress: true` is valid. Implementation should ensure the group remains unique to the Pages deployment workflow; a workflow-qualified group would be a harmless hardening option if future workflows might reuse the same name.
3. **Official Action versions should be current at implementation time** — The Design intentionally does not freeze stale version numbers and instead requires current supported official releases or immutable SHA pins. Implementation should follow that instruction when writing the workflow.

## Gate recommendation

Approve `design-v1`, record this review as pass evidence, set `design-gate: PASS`, mark `design-review: DONE`, and make `plan: READY`.

No Plan or Implementation work is performed by this review.
