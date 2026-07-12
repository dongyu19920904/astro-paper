# AstroPaper Delivery Rules

These rules apply to this repository unless a nested `AGENTS.md` is stricter.

## Tooling

- Use `pnpm`; do not mix package managers.
- Install/check dependencies: `pnpm install --frozen-lockfile`.
- Develop: `pnpm dev`.
- Type-check: `pnpm exec astro check`.
- Test: `pnpm test` when a test script exists; otherwise run the focused executable checks documented by the change.
- Lint and format-check: `pnpm lint` and `pnpm format:check`.
- Build: `pnpm build`.

## Repository Conventions

- Put routes under `src/pages/`, reusable UI under `src/components/`, structured project data under `src/data/`, and browser behavior under `src/scripts/` or a page-local Astro script.
- Reuse `src/layouts/Layout.astro`, existing components, Tailwind utilities, and the light/dark design tokens in `src/styles/global.css`.
- Keep project navigation data in `src/data/navProjects.ts`; do not duplicate it in page templates.
- Keep feature-specific validation and filtering logic independently testable.

## Safety And Product Boundaries

- Never hardcode API keys, tokens, private endpoints, or provider credentials. Browser code may only receive `PUBLIC_` configuration that is explicitly non-secret.
- Do not add medical diagnosis, disease prediction, treatment advice, clinical-validity claims, or personal biological-age measurement.
- Do not add uploads or free-form collection of DNA, methylation, MRI, medical-record, patient, or other sensitive biological data.
- Preserve AstroPaper's existing typography, spacing, responsive behavior, navigation, SEO conventions, and dark mode.
- Preserve unrelated user changes. Do not reset, stash, delete, or reformat files outside the requested scope.

## Required Checks

After a change, run the focused tests plus `pnpm exec astro check`, `pnpm lint`, `pnpm format:check`, and `pnpm build`. Inspect `git diff --check`, the actual diff, and the generated browser bundle for secret-like values before delivery.
