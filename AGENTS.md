# AGENTS.md

## Project intent

This repository is a real AI-SDLC dogfood target. Do not bypass the Feature Manifest / Feature Event lifecycle for product feature work.

## Product scope

Build a mobile-first browser game themed around a generic bamboo cicada toy. Do not use real company trademarks, real-person likenesses, or misleading claims about real-world events in game assets or copy.

## Engineering rules

- Use Vue 3 + TypeScript + Vite.
- Keep gameplay deterministic enough for unit testing where practical.
- Prefer small composables and pure functions for scoring/timing logic.
- Avoid backend services for the first MVP unless an approved design explicitly adds them.
- Treat accessibility, touch input, reduced-motion behavior, and mobile viewport constraints as part of Definition of Done.
- Do not edit authoritative AI-SDLC Feature Manifests directly from a worker; write bounded Feature Events through the approved flow.

## Verification

Normal required checks are `typecheck`, `test`, and `build` as declared in `.ai-sdlc/project.yaml`.
