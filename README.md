# Zhu Zhiliao Game

A lightweight mobile-first web game used as a real cross-repository AI-SDLC dogfood target.

## Goal

Build a playful browser game around shaking a bamboo cicada toy, with scoring, combo feedback and a short-session result screen.

## Stack

- Vue 3
- TypeScript
- Vite
- Vitest

## GitHub Pages deployment

Production deployment is configured through the dedicated GitHub Actions Pages workflow in `.github/workflows/pages.yml`.

- A push to `main` runs `npm ci`, `npm run typecheck`, `npm run test`, and `npm run build` before the Pages artifact can be deployed.
- The Vite production base is `/zhu-zhiliao-game/`, matching the repository Pages subpath.
- The expected public URL is `https://dream-xin.github.io/zhu-zhiliao-game/`.
- This expected URL is not considered verified until a real deployment from `main` succeeds and the deployed site is checked.
- On the first deployment, an authorized maintainer may need to open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.

## AI-SDLC

This repository is intentionally managed as a target repository of `DREAM-XIN/ai-sdlc`. Product features should move through the repository-backed AI-SDLC lifecycle instead of bypassing Feature Manifest / Feature Event authority.

The first dogfood feature will be `F-ZHIZHILIAO-MVP-0001`.
