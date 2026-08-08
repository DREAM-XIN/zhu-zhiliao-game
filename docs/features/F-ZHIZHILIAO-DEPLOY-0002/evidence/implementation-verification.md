# Implementation Verification Evidence — F-ZHIZHILIAO-DEPLOY-0002

## Scope

Evidence for the implementation-stage repository checks and GitHub Pages build readiness. This is not evidence that the public Pages URL is already live.

## Verified commit / PR

- Feature branch: `feature/F-ZHIZHILIAO-DEPLOY-0002`
- Draft PR: #5
- Verified commit: `599557ab814d2741ec4d7535a988a30fc015890f`

## Required commands

GitHub Actions `Deploy GitHub Pages` run `31262143883`, build job `93114514019`, completed successfully on the PR validation path.

Observed command results from the job log:

1. `npm ci` — PASS
   - added 194 packages
   - audited 195 packages
   - 0 vulnerabilities reported by npm audit output
2. `npm run typecheck` — PASS
   - executed `vue-tsc -b`
3. `npm run test` — PASS
   - Vitest 3.2.7
   - 7 test files passed
   - 15 tests passed
4. `npm run build` — PASS
   - executed `vue-tsc -b && vite build`
   - Vite 7.3.6
   - 29 modules transformed
   - build completed successfully

The repository's existing `Implementation CI` run `31262143880` also completed with conclusion `success` for the same verified commit.

## Build output / asset-path check

The Vite build produced:

- `dist/index.html`
- `dist/assets/index-B_zUrPBs.css`
- `dist/assets/index-D076x2oK.js`

The Pages workflow then executed an explicit `Verify Pages asset paths` step, which passed all of the following assertions against `dist/index.html`:

```bash
test -f dist/index.html
grep -q 'src="/zhu-zhiliao-game/assets/' dist/index.html
grep -q 'href="/zhu-zhiliao-game/assets/' dist/index.html
if grep -Eq '(src|href)="/assets/' dist/index.html; then
  exit 1
fi
```

Result: PASS. Generated JS/CSS references are compatible with `/zhu-zhiliao-game/` and no matching domain-root `/assets/...` reference was found in `dist/index.html`.

## Pages platform prerequisite evidence

The first Pages workflow run after adding the deployment workflow was run `31262074777`.

Its build job completed these steps successfully before the platform check:

- checkout — PASS
- setup-node — PASS
- `npm ci` — PASS
- `npm run typecheck` — PASS
- `npm run test` — PASS
- `npm run build` — PASS

The next step, `actions/configure-pages@v6`, failed with:

`Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions ... Error: Not Found`

As a result:

- Pages artifact upload was skipped.
- Deploy job was skipped.
- No live deployment success is claimed.

This proves a repository-level Pages enablement prerequisite remains. An authorized maintainer should configure **Settings → Pages → Build and deployment → Source = GitHub Actions** before the first production deployment from `main`.

## Production workflow readiness

Final `.github/workflows/pages.yml` behavior:

- `push` to `main`: install → typecheck → test → build → asset-path verification → configure-pages → upload-pages-artifact → deploy-pages.
- `workflow_dispatch`: same production path.
- `pull_request` to `main`: install → typecheck → test → build → asset-path verification; Pages platform/deploy steps are skipped so PR CI can validate code before repository Pages is enabled.
- `deploy` has `needs: build` and is skipped for pull requests.
- No required check uses `continue-on-error`.
- Permissions are `contents: read`, `pages: write`, `id-token: write`.
- Deployment environment is `github-pages`.

## Deferred verification

The following require a real deployment from `main` after Pages is enabled and are intentionally deferred to later lifecycle stages:

- authoritative public Pages URL from deploy output
- HTTP success of the public root URL
- JS/CSS/static-resource HTTP success
- desktop browser rendering/playability
- mobile browser/viewport rendering/playability
