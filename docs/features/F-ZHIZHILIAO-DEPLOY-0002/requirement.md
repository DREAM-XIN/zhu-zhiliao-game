# Requirement — F-ZHIZHILIAO-DEPLOY-0002

## 1. Problem / Goal

The completed Zhu Zhiliao browser-game MVP currently exists as a repository-hosted Vue 3 + TypeScript + Vite application but does not yet provide a public, directly accessible online-play URL.

The goal of this Feature is to publish the existing MVP as a static website, preferably with GitHub Pages, so that users can open a stable public URL on desktop or mobile browsers and enter the existing game without requiring local setup.

This Feature is deployment-only. It must preserve the MVP gameplay scope and behavior while adding a reproducible, repository-native build and deployment path from `main`.

## 2. In scope

- Host the existing pure-frontend MVP using GitHub Pages.
- Add or update GitHub Actions workflow configuration so pushes to `main` can build and deploy the site automatically.
- Configure Vite so production assets resolve correctly when the application is served from the repository subpath `/zhu-zhiliao-game/`.
- Use the repository's existing `package-lock.json` and `npm ci` for dependency installation in CI.
- Require `npm run typecheck`, `npm run test`, and `npm run build` to succeed before deployment is allowed to proceed.
- Publish the generated static build output as the GitHub Pages artifact and deploy that artifact using GitHub-supported Pages Actions.
- Produce and document the real public GitHub Pages URL after successful deployment.
- Validate that the deployed application loads correctly in both desktop and mobile browsers and that a user can start the existing game and enter actual gameplay.
- Add minimal deployment documentation where needed to explain the public URL and repository deployment behavior.

## 3. Out of scope

- Any change to game rules, scoring, timing, controls, screens, progression, visual gameplay scope, or other MVP product behavior.
- Backend services, APIs, server-side rendering, databases, authentication, leaderboards, or persistent multiplayer/state services.
- Self-hosted servers, Nginx, VM/container hosting, cloud compute instances, or other custom runtime infrastructure.
- Custom domains or DNS changes.
- Replacing GitHub Pages with another hosting platform unless GitHub Pages is proven infeasible under repository or platform constraints and a later approved lifecycle artifact explicitly changes the requirement.
- Unrelated refactoring, dependency upgrades, or UX redesign.

## 4. User experience / expected URL behavior

The deployment must expose a public URL using the standard GitHub Pages repository-site form for this repository, expected to be:

`https://dream-xin.github.io/zhu-zhiliao-game/`

The exact final URL must be confirmed from the successful GitHub Pages deployment and reported as the authoritative playable URL.

Expected behavior:

- Opening the repository Pages root path returns the game application rather than a GitHub Pages 404 page.
- The initial HTML loads its JavaScript, CSS, images, and other static assets successfully from paths compatible with `/zhu-zhiliao-game/`.
- The existing game home/start experience is visible without requiring manual URL rewriting.
- A user can initiate the game using the existing controls and reach actual gameplay.
- The same public URL is usable from both desktop and mobile browsers.
- Normal navigation and reload behavior required by the current single-page application must not be broken by the Pages deployment model.

## 5. Functional requirements

### FR-1 — Public static deployment
The existing MVP shall be deployable as a public static GitHub Pages site with no runtime backend dependency.

### FR-2 — Main-branch deployment trigger
A GitHub Actions Pages deployment workflow shall exist and shall be triggered by changes merged or pushed to `main` according to the workflow's defined deployment trigger.

### FR-3 — Reproducible dependency installation
The workflow shall use a supported Node.js setup and install dependencies with `npm ci` against the committed `package-lock.json`. It shall not use an unlocked install flow as the normal deployment path.

### FR-4 — Mandatory quality checks before deployment
The deployment workflow shall execute all of the following before publishing/deploying the Pages artifact:

1. `npm run typecheck`
2. `npm run test`
3. `npm run build`

Deployment shall not continue when any of these commands fails.

### FR-5 — GitHub Pages subpath support
The production Vite configuration shall use an asset base compatible with the repository Pages path `/zhu-zhiliao-game/`, so generated HTML references and imported assets resolve from the deployed repository site rather than from the domain root.

### FR-6 — Static artifact publication
The workflow shall publish the Vite production output directory as the Pages deployment artifact using GitHub-supported Pages deployment mechanisms.

### FR-7 — Playability preservation
After deployment, the existing game home screen and existing gameplay flow shall remain usable. The deployment Feature shall not require gameplay changes to function.

### FR-8 — Public URL reporting
After a successful deployment, the repository documentation or deployment evidence shall contain the real, verified Pages URL that users can open directly.

## 6. Deployment requirements

- GitHub Pages is the required primary hosting mechanism.
- Deployment must be repository-native and automated through GitHub Actions.
- The source branch for normal production deployment is `main`.
- The workflow must use `npm ci` with the committed lockfile.
- The workflow must run typecheck, tests, and build before the deployment step.
- The production build output must be the normal Vite static output (for example, `dist/`) unless implementation evidence demonstrates an equivalent Vite-supported static output configuration.
- The workflow must use the GitHub Pages permissions and environment model required by the supported Pages Actions, with only the permissions necessary for deployment.
- The Pages configuration must support the repository path `/zhu-zhiliao-game/`; generated JS/CSS/static-asset URLs must not incorrectly point to `/assets/...` at the domain root.
- The deployment must not depend on secrets for a backend, database, server, or third-party runtime.
- Any deployment documentation must distinguish the public production Pages URL from local Vite development URLs.

## 7. Acceptance criteria

1. A GitHub Pages deployment workflow exists in `.github/workflows/**` and is configured to deploy from `main`.
2. The workflow build job uses Node.js and installs dependencies with `npm ci` using the repository's committed `package-lock.json`.
3. `npm run typecheck`, `npm run test`, and `npm run build` all execute successfully before any Pages deployment step can run.
4. A failure in typecheck, tests, or build prevents deployment of a new Pages version.
5. Vite production asset base configuration is compatible with the repository Pages path `/zhu-zhiliao-game/`.
6. The final verified GitHub Pages URL returns the application successfully rather than a 404 response/page.
7. The deployed HTML loads required JavaScript and CSS resources successfully; required static assets do not fail because of an incorrect root-relative path.
8. The game home/start screen renders correctly at the public Pages URL.
9. A user can start the game from the deployed site and enter the existing actual gameplay flow.
10. The public site can be opened and used in a representative desktop browser.
11. The public site can be opened and used in a representative mobile browser or mobile browser viewport without requiring a separate deployment URL.
12. Existing MVP checks continue to pass; this Feature does not regress the existing `npm run typecheck`, `npm run test`, or `npm run build` behavior.
13. No backend application, server runtime, database, or self-hosted infrastructure is introduced by this Feature.
14. The final deployment evidence records the real accessible public URL, expected to use the repository Pages path, and confirms successful page/resource loading.
15. No gameplay behavior or product scope is intentionally changed as part of satisfying deployment requirements.

## 8. Non-functional requirements

### NFR-1 — Reproducibility
CI deployment must be reproducible from repository state by using the committed lockfile and `npm ci`.

### NFR-2 — Reliability
A failed validation/build must fail closed: the previously deployed working Pages version should remain the effective public version rather than publishing a known-bad build.

### NFR-3 — Maintainability
Deployment configuration should remain small, conventional, and understandable to maintainers familiar with Vite and GitHub Pages. Custom deployment scripts should be avoided when official GitHub Pages Actions cover the requirement.

### NFR-4 — Security / least privilege
The workflow shall request only the GitHub token permissions and Pages environment access necessary to publish and deploy the static artifact. No application secrets are expected.

### NFR-5 — Performance baseline
Deployment must not introduce an additional application runtime layer. The site should be served as static files through GitHub Pages, preserving the lightweight delivery model of the existing Vite build.

### NFR-6 — Compatibility
The deployed site must remain usable on current mainstream desktop and mobile browsers supported by the existing MVP implementation. No browser-specific installation or plugin may be required.

## 9. Failure / rollback expectations

- If dependency installation, typecheck, tests, or build fails, the deployment workflow must fail and must not publish that failing revision as the new Pages release.
- If Pages deployment itself fails, the failure must be visible in GitHub Actions and must not be masked as success.
- A previously successful Pages deployment should remain available when a later deployment attempt fails, subject to normal GitHub Pages platform behavior.
- Rollback must be possible through normal repository history: reverting or correcting the deployment/configuration change on `main` and allowing the workflow to redeploy a known-good build. No custom database/data rollback process is required because this Feature introduces no persistent backend state.
- If the public URL returns 404 or static assets fail to load after deployment, the release is not accepted; likely repository-path/base configuration and Pages workflow settings must be corrected through the normal AI-SDLC lifecycle rather than bypassed manually.

## 10. Constraints

- Follow `AGENTS.md` and the repository AI-SDLC lifecycle; do not bypass Feature Event / Persist authority for workflow state.
- Keep the project as Vue 3 + TypeScript + Vite.
- Do not add backend services, databases, self-hosted servers, or Nginx.
- Do not change the game玩法 / gameplay scope for this deployment Feature.
- Use the existing committed `package-lock.json` and `npm ci` in deployment CI.
- Preserve the repository-required checks defined in `.ai-sdlc/project.yaml`: typecheck, test, build.
- Production static asset paths must work under `/zhu-zhiliao-game/` rather than assuming deployment at `/`.
- Normal production deployment is driven from `main`.
- GitHub Pages is preferred and is the expected solution unless a later approved lifecycle decision establishes a concrete platform blocker.
- Requirement approval is explicitly outside this Product-authoring task and belongs to the independent Requirement Reviewer stage.
