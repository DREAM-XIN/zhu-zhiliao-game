# Implementation — F-ZHIZHILIAO-DEPLOY-0002

## Summary

Implemented the approved GitHub Pages deployment path for the existing Vue 3 + TypeScript + Vite game without changing gameplay behavior.

## Changes

- `vite.config.ts`
  - Set `base: '/zhu-zhiliao-game/'` so Vite-generated production asset references are compatible with the repository GitHub Pages subpath.
- `.github/workflows/pages.yml`
  - Added a dedicated Pages workflow, separate from AI-SDLC control workflows.
  - Production deployment is triggered by pushes to `main`; `workflow_dispatch` is also supported.
  - Pull requests to `main` run the same dependency install, typecheck, test, build, and asset-path validation, but skip Pages platform configuration/artifact deployment.
  - Uses official GitHub Actions: checkout, setup-node, configure-pages, upload-pages-artifact, and deploy-pages.
  - Deploy job depends on the build job and uses the `github-pages` environment.
  - Required permissions are `contents: read`, `pages: write`, and `id-token: write`.
- `README.md`
  - Documented main-to-Pages deployment behavior, expected repository Pages URL, and the possible first-time Pages repository setting prerequisite.

No files under `src/game/**`, gameplay logic, backend/database/server configuration, Nginx configuration, or existing AI-SDLC control workflows were modified for this Feature.

## Validation

GitHub Actions evidence was collected from draft PR #5 for commit `599557ab814d2741ec4d7535a988a30fc015890f`.

- `Implementation CI` run `31262143880`: success.
- `Deploy GitHub Pages` run `31262143883`: success for the PR build-validation path.
- The Pages workflow build job executed `npm ci`, `npm run typecheck`, `npm run test`, and `npm run build` successfully.
- Vitest result: 7 test files passed, 15 tests passed.
- Vite produced `dist/index.html`, CSS, and JavaScript assets.
- The explicit `Verify Pages asset paths` step passed and confirmed generated JS/CSS references use `/zhu-zhiliao-game/assets/...` rather than domain-root `/assets/...`.

Detailed command and platform evidence is recorded in `docs/features/F-ZHIZHILIAO-DEPLOY-0002/evidence/implementation-verification.md`.

## Pages platform prerequisite

The initial Pages workflow attempt (`31262074777`) reached the `Configure GitHub Pages` step after all required commands passed, then failed with GitHub's `Get Pages site failed` / `Not Found` message indicating that this repository does not yet have Pages enabled/configured for GitHub Actions.

An authorized maintainer therefore still needs to enable GitHub Pages for the repository, normally via **Settings → Pages → Build and deployment → Source = GitHub Actions**, before the first real `main` deployment can succeed.

The expected URL remains `https://dream-xin.github.io/zhu-zhiliao-game/`, but it is not claimed as a verified live URL in this implementation artifact.

## Handoff

Implementation is code/CI ready. Public URL availability, HTTP/resource loading, and desktop/mobile playability remain for Verification / Acceptance after the Feature is merged to `main`, Pages is enabled, and a real production deployment completes.
