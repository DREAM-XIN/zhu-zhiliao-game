# Design — F-ZHIZHILIAO-DEPLOY-0002

## 1. Architecture overview

This Feature keeps the existing Vue 3 + TypeScript + Vite application as a pure static frontend. No backend, database, server runtime, container, VM, Nginx, SSR, authentication service, or new gameplay service is introduced.

Production delivery path:

```text
GitHub main
  -> GitHub Actions Pages workflow
  -> npm ci
  -> npm run typecheck
  -> npm run test
  -> npm run build
  -> Vite dist/
  -> actions/upload-pages-artifact
  -> actions/deploy-pages
  -> GitHub Pages
  -> https://dream-xin.github.io/zhu-zhiliao-game/
```

The source of production deployments is `main`. The build executes on GitHub-hosted Actions runners. The deployable artifact is the Vite `dist/` directory. Hosting is GitHub Pages.

The expected public URL is `https://dream-xin.github.io/zhu-zhiliao-game/`, but that string is only an expectation derived from the standard repository Pages URL form. The authoritative URL must come from a successful Pages deployment and subsequent public verification.

Existing AI-SDLC lifecycle workflows remain separate control-plane infrastructure. The new Pages workflow is a production deployment workflow and must not replace, repurpose, or weaken AI-SDLC lifecycle workflows such as `.github/workflows/ai-sdlc-persist.yml`.

## 2. Vite base strategy

### Decision

Set the Vite production base to the fixed repository Pages subpath:

```ts
base: '/zhu-zhiliao-game/'
```

The recommended implementation is a direct `base` entry in `vite.config.ts` because this repository has one defined production Pages location and the Requirement explicitly fixes repository-subpath compatibility. An environment-dependent production base is unnecessary complexity for this Feature.

### Rationale

GitHub Pages repository sites are served below `/<repo>/`, not the domain root. A Vite build using the default `/` base can generate resource references such as `/assets/...`, which resolve against `https://dream-xin.github.io/assets/...` and can produce asset 404s. Setting `base: '/zhu-zhiliao-game/'` causes Vite-generated HTML/imported asset URLs to resolve under the repository site path.

Application code should continue to prefer Vite-managed imports and `import.meta.env.BASE_URL` for any deployment-base-sensitive path rather than introducing hard-coded domain-root paths.

### Development and tests

The fixed Vite `base` is a build/served-path setting and does not change game logic. Normal `vite` development remains supported; Vite handles the configured base during development. Unit tests that operate on game/application logic should remain unaffected. If any test asserts generated URLs, it must assert repository-base-aware behavior rather than domain-root `/assets/...` behavior.

No gameplay behavior changes are authorized to accommodate the base. If implementation discovers a static resource path that is incorrectly hard-coded to `/...`, only the minimum deployment-path correction is in scope; changes to `src/game` behavior remain out of scope.

## 3. GitHub Pages workflow design

### Workflow file

Add a dedicated workflow such as:

`/.github/workflows/pages.yml`

The exact filename may vary, but it must remain clearly separate from AI-SDLC lifecycle workflows.

### Trigger

Required production trigger:

```yaml
on:
  push:
    branches: [main]
```

A manual `workflow_dispatch` trigger may also be included for controlled redeployment/recovery, provided it does not bypass the same validation/build sequence.

Normal production publication remains sourced from `main`.

### Permissions

Use only the Pages permissions needed by the workflow:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

No application or deployment secrets are required.

### Concurrency

Use one Pages deployment concurrency group, for example:

```yaml
concurrency:
  group: pages
  cancel-in-progress: true
```

This prevents obsolete concurrent deployments from racing. A newer `main` revision may supersede an older in-progress deployment.

### Build job

The `build` job runs on a GitHub-hosted Ubuntu runner and performs, in order:

1. `actions/checkout`
2. `actions/setup-node` with an appropriate supported Node version and npm cache keyed through the existing lockfile
3. `npm ci`
4. `npm run typecheck`
5. `npm run test`
6. `npm run build`
7. `actions/configure-pages`
8. `actions/upload-pages-artifact` with `path: ./dist`

Implementation should use current supported official GitHub action releases and may pin immutable SHAs according to repository security conventions while retaining these official actions.

`package-lock.json` remains authoritative for dependency installation. The workflow must not replace `npm ci` with `npm install`.

### Deploy job

The `deploy` job:

- declares `needs: build`;
- runs only after the build job succeeds;
- uses the `github-pages` environment;
- exposes the deployment URL from the `actions/deploy-pages` step output;
- invokes `actions/deploy-pages` to publish the Pages artifact.

Conceptually:

```yaml
deploy:
  needs: build
  environment:
    name: github-pages
    url: ${{ steps.deployment.outputs.page_url }}
  steps:
    - id: deployment
      uses: actions/deploy-pages@...
```

The build and deploy jobs must not be independent. `needs: build` is the fail-closed dependency boundary that guarantees no deploy job starts if required checks or artifact creation fail.

## 4. Validation ordering

The mandatory validation chain is exactly:

```text
npm ci
-> npm run typecheck
-> npm run test
-> npm run build
-> upload Pages artifact
-> deploy
```

All commands execute as normal fail-fast Actions steps. No `continue-on-error` is permitted for required commands. No deploy step/job may use `if: always()` or another condition that would allow deployment after a failed required command.

Although the existing `npm run build` also performs `vue-tsc -b`, the explicit standalone `npm run typecheck` remains required because `.ai-sdlc/project.yaml` and the approved Requirement define it as an independent required command.

## 5. Repository Pages prerequisite

Repository code can implement:

- the Vite base configuration;
- the Pages workflow;
- build/check ordering;
- artifact upload/deploy behavior;
- README/deployment documentation;
- lifecycle evidence.

GitHub repository platform configuration is separate. For a first Pages deployment, an authorized maintainer may need to open **Settings -> Pages** and set **Build and deployment -> Source = GitHub Actions** / otherwise enable Pages for the repository.

This is a platform prerequisite, not application code and not something the Vite build can guarantee.

If this one-time action is required, Implementation or Acceptance evidence must record that it was performed. The expected URL string alone must never be accepted as proof that Pages is enabled or successfully deployed. Deployment success requires real Actions/Pages evidence and public URL verification.

## 6. Verification strategy

Verification must cover repository configuration, CI execution, Pages publication, public network behavior, rendering, and playability.

### CI / workflow verification

- Confirm the Pages workflow was triggered by a `main` push/merge or an explicitly allowed manual run.
- Confirm the build job succeeded.
- Confirm logs show `npm ci`, `npm run typecheck`, `npm run test`, and `npm run build` succeeded in the required order.
- Confirm a Pages artifact was uploaded from `dist/` only after those checks.
- Confirm the deploy job ran only after the build job and `actions/deploy-pages` succeeded.
- Record the deployment output/public URL as evidence.

### Public HTTP / asset verification

Against the real deployed URL:

- HTTP request to the Pages root succeeds and does not return a GitHub Pages 404.
- Returned HTML is the built game application HTML.
- Main JavaScript and CSS resources referenced by the HTML return successful HTTP responses.
- Required static images/assets return successful HTTP responses.
- Resource URLs resolve under `/zhu-zhiliao-game/` where applicable; no required generated resource is incorrectly requested from domain-root `/assets/...`.

### Browser verification

Desktop:

- open the real public URL in a representative current desktop browser;
- confirm the home/start experience renders;
- start the game and reach actual gameplay;
- confirm no deployment-path errors prevent normal interaction.

Mobile:

- open the same public URL in a representative mobile browser or mobile browser viewport;
- confirm the mobile-first UI renders and remains usable;
- start the game and reach actual gameplay using the existing controls.

### Regression verification

Re-run/confirm the repository-required commands without regression:

- `npm run typecheck`
- `npm run test`
- `npm run build`

No acceptance can be based solely on workflow YAML inspection or on the expected URL text. Real deployment and runtime evidence are required.

## 7. Failure behavior and recovery

### Dependency/check/build failure

If `npm ci`, typecheck, tests, or build fails, the build job fails. Artifact upload must not occur, `deploy` must not run because `needs: build` is unsatisfied, and the currently published Pages version remains the effective deployment subject to GitHub Pages platform behavior.

### Artifact/deploy failure

If artifact upload or `actions/deploy-pages` fails, the workflow is failed and must remain visibly failed in Actions. It must not be represented as a successful release.

### Pages disabled / source not enabled

If repository Pages is disabled or Source is not configured for GitHub Actions, deployment may fail or no public site may become available. The response is to satisfy the one-time repository setting prerequisite with authorized maintainer access and rerun/redeploy through the normal workflow. Do not modify application code merely to hide this platform configuration failure.

### Incorrect Vite base

Symptoms include root HTML loading while JS/CSS/images return 404, commonly from requests such as `https://dream-xin.github.io/assets/...`. This is a deployment failure. Correct the Vite base/path usage to `/zhu-zhiliao-game/`, re-run required checks, and redeploy through `main`.

### Rollback / redeploy

Because the deployment is stateless, rollback is repository-history based:

- revert or correct the offending commit on `main`;
- allow the same Pages workflow to rebuild, revalidate, and redeploy a known-good revision.

A manual workflow trigger may be used to redeploy the same known-good repository revision if included in the implementation, but it must not bypass checks. No data rollback exists because no persistent backend state is introduced.

## 8. Security and permissions

Security model:

- `contents: read` for repository checkout;
- `pages: write` for Pages publication;
- `id-token: write` for the Pages deployment identity flow;
- `github-pages` deployment environment;
- no application secrets;
- no cloud/server credentials;
- no PAT-based `gh-pages` branch push mechanism;
- no third-party deployment service.

Official GitHub Pages Actions are preferred over custom scripts because they minimize bespoke credential/deployment logic.

## 9. Expected implementation file scope

Expected production-code/configuration changes:

- `vite.config.ts` — add repository Pages base.
- `.github/workflows/pages.yml` (or equivalently named dedicated Pages workflow) — add build/check/artifact/deploy pipeline.
- `README.md` — document the verified public play URL and deployment behavior after the deployment is real.
- Feature-specific evidence/docs under `docs/features/F-ZHIZHILIAO-DEPLOY-0002/**` as required by later lifecycle stages.

`package-lock.json` is expected to be consumed, not regenerated merely for this Feature. `package.json` should not require dependency changes; a change is only justified if implementation identifies a narrowly necessary deployment command/configuration adjustment consistent with this Design.

Existing AI-SDLC lifecycle workflows should not be changed for the Pages implementation unless a separate, genuine control-plane defect is discovered and handled through its own approved scope.

## 10. No gameplay changes

This Feature is deployment-only.

`src/game` and gameplay rules, scoring, timing, controls, progression, visual gameplay behavior, and product scope are not implementation targets. No gameplay change is authorized to satisfy Pages deployment.

The only permissible application-source correction is a narrowly bounded deployment-path fix if an existing asset/navigation reference is proven incompatible with the approved repository base and the fix does not alter gameplay semantics. Any broader gameplay change requires a separate approved Feature.

## 11. Design decisions summary

- Keep Vue 3 + TypeScript + Vite pure frontend architecture.
- Deploy only from `main` to GitHub Pages.
- Use `dist/` as the Pages artifact.
- Fix Vite `base` to `/zhu-zhiliao-game/`.
- Use official checkout/setup-node/configure-pages/upload-pages-artifact/deploy-pages Actions.
- Use existing `package-lock.json` with `npm ci`.
- Enforce typecheck -> test -> build before artifact upload and deploy.
- Separate build and deploy jobs with `deploy.needs: build`.
- Use least-privilege `contents: read`, `pages: write`, `id-token: write` and the `github-pages` environment.
- Treat Settings -> Pages -> Source = GitHub Actions as a possible one-time platform prerequisite, not code.
- Require real deployment/public HTTP/browser evidence; expected URL text is not deployment proof.
- Introduce no backend/database/server/Nginx and no gameplay changes.
