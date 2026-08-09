# F-ZHIZHILIAO-DEPLOY-0002 — Implementation Plan

## Goal

Implement the approved GitHub Pages deployment design for the existing Zhu Zhiliao Vue 3 + TypeScript + Vite game without changing gameplay scope.

## Implementation order

### P1 — Configure Vite repository base

Update `vite.config.ts` so the production/static build is compatible with the repository Pages path:

```text
/zhu-zhiliao-game/
```

Definition of done:

- Vite-generated JS/CSS/static-asset URLs resolve below `/zhu-zhiliao-game/`.
- Existing development/test behavior remains usable.
- No gameplay logic under `src/game` is changed.

### P2 — Add dedicated GitHub Pages workflow

Add a production deployment workflow such as `.github/workflows/pages.yml` using official GitHub Pages Actions.

Required flow:

```text
checkout
-> setup-node
-> npm ci
-> npm run typecheck
-> npm run test
-> npm run build
-> configure-pages
-> upload-pages-artifact (dist/)
-> deploy-pages
```

Definition of done:

- Normal production trigger is `push` to `main`.
- Optional `workflow_dispatch` may be included for redeploy/recovery, but it must run the same checks.
- Deploy job depends on successful build job.
- Required checks do not use `continue-on-error` or equivalent bypasses.
- Permissions are limited to `contents: read`, `pages: write`, `id-token: write`.
- Deployment uses the `github-pages` environment.
- Pages concurrency prevents obsolete deployments racing.
- Existing AI-SDLC control workflows are not repurposed or modified.

### P3 — Deployment documentation

Update `README.md` only with deployment behavior that is true at implementation time.

Definition of done:

- Explain that production is deployed through GitHub Pages from `main`.
- Distinguish expected URL from verified live URL until a real deployment succeeds.
- Record the final public URL only after it is verified.
- Note that first-time repository Pages enablement / `Source = GitHub Actions` may require an authorized maintainer action in GitHub Settings.

### P4 — Repository-level validation

Run the required repository checks on the implementation branch:

```text
npm ci
npm run typecheck
npm run test
npm run build
```

Definition of done:

- All required commands pass.
- `dist/index.html` and generated resource paths are compatible with `/zhu-zhiliao-game/`.
- No backend, database, server, Nginx, new runtime service, or gameplay change is introduced.

### P5 — Pages deployment readiness / evidence

Prepare implementation evidence for the code-controlled part of the deployment and identify any platform prerequisite separately.

Definition of done:

- Evidence records changed files and required-command results.
- Evidence records whether repository Pages is already enabled for GitHub Actions or whether a maintainer action remains required after merge.
- A real live URL is not claimed before `main` deployment succeeds.
- Actual public URL / HTTP / browser playability verification is handed off to Verification / Acceptance after deployment becomes available.

## Dependencies

- P1 and P2 can be implemented together.
- P3 should reflect the implemented workflow and must not falsely claim a live deployment.
- P4 follows P1/P2 and must pass before implementation completion.
- P5 records implementation readiness and any external Pages prerequisite.

## Expected implementation scope

Primary files:

- `vite.config.ts`
- `.github/workflows/pages.yml` or equivalent dedicated Pages workflow
- `README.md`
- `docs/features/F-ZHIZHILIAO-DEPLOY-0002/**` evidence/artifacts
- Feature Events under `state/events/F-ZHIZHILIAO-DEPLOY-0002/**`

Normally unchanged:

- `src/game/**`
- gameplay UI/logic
- `package.json`
- `package-lock.json` except if a narrowly justified, approved deployment necessity is discovered
- existing AI-SDLC lifecycle workflows

## Platform prerequisite

GitHub repository Settings may require one-time Pages enablement with **Build and deployment → Source = GitHub Actions**. This is a GitHub platform setting, not application code. If required, the Developer must report it as a deployment prerequisite rather than bypassing the lifecycle or claiming deployment success.

## Handoff

After Planning, the Developer implements this plan on `feature/F-ZHIZHILIAO-DEPLOY-0002`, runs required checks, records implementation evidence, and advances state only through Feature Event + Persist. The Developer must not directly edit the authoritative Feature Manifest.
