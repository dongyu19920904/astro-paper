# Aging Clock Atlas MVP Plan

## Goal

Build and publish an AstroPaper-native `Aging Clock Atlas / 多维衰老时钟地图` at `/projects/aging-clock-atlas/`. The MVP turns verified AI-longevity daily-report projects into a source-traceable navigation, comparison, and education tool with a guarded website-remix planner.

## Scope

- Curate four verified public GitHub projects across epigenetic clocks, brain age, ancient-DNA clocks, and digital biomarkers.
- Store facts, license status, limitations, sources, and remix ideas in one validated local TypeScript data module.
- Provide URL-synced filters, a 2-4 project comparison, accessible project details, responsive layouts, and source links.
- Add a project-plan form with bounded enumerations/text and a deterministic local fallback.
- Add `POST /api/project-lab/aging-clock-plan` to the existing BioAI Worker through its Anthropic-compatible adapter.
- Add an internal project card to the existing `/projects` navigation.
- Add focused executable tests, build checks, accessibility-oriented markup, and secret scans.

## Non-goals

- No biological-age calculator, diagnosis, disease prediction, treatment recommendation, or clinical-validity claim.
- No upload or collection of DNA, methylation, MRI, medical records, patient files, or wearable datasets.
- No copying candidate repositories, datasets, weights, coefficients, or manifests.
- No crawler, new database, vector store, local model, Docker addition, DNS change, or production-data change.
- No refactor of the BioAI daily frontend or unrelated Worker generation flows.

## Source And Authority

- The local `D:\GitHub\BioAI-Daily-Web` worktree is read-only and currently contains user changes. Its checked-out content stops at 2026-01-23.
- GitHub `main` is newer; read-only GitHub API/code search identified the dated 2026-07-11 daily, opportunity, and project-opportunity files. Source paths and repository facts are recorded, but the daily repository will not be pulled or edited.
- Candidate README, LICENSE/NOTICE, repository tree, and current metadata are verified from each official GitHub repository on 2026-07-11.
- An absent repository license is recorded as `许可证待核实`; public metadata may be summarized, but no code or assets are redistributed.

## Architecture

### Astro frontend

- Static Astro route rendered with `Layout`, `Header`, and `Footer`.
- One TypeScript data/schema module validates project records at build time.
- One pure utility module owns filter parsing/application, comparison limits, and AI-plan request/response validation.
- Progressive-enhancement browser script syncs filters to query parameters and drives comparison/details without a state library.
- Native form controls and `<dialog>`/semantic regions provide keyboard behavior; narrow screens use stacked comparison cards rather than an unusable wide table.
- `PUBLIC_BIOAI_API_BASE_URL` is the only frontend API setting. If absent or the request fails, the deterministic local example remains usable.

### BioAI Worker

- New isolated handler and validation module; only a minimal import/public-route insertion touches the already-modified `src/index.js`.
- Validate content type, body size, enumerations, project id, and bounded goal text before model invocation.
- Use the existing Anthropic-compatible `callChatAPI` path with environment-provided endpoint, key, primary model, optional backup model, timeout, and output limit.
- Parse and validate structured JSON before returning it. Provider/config/timeout/parse failures return a safe deterministic fallback and a non-sensitive status message.
- Handle CORS from an allow-list setting. Use a Cloudflare Rate Limiting Binding plus the existing namespaced KV counter as an aligned second layer because the platform Binding is intentionally permissive/eventually consistent.
- Log only route outcome/error class; never log keys, full prompts, biological data, or user text.

## Acceptance Criteria

- [x] `/projects/aging-clock-atlas/` builds and opens directly after a static build.
- [x] At least four real projects show repository URL, category, input, algorithm, output, offline status, difficulty, license status, risk, source daily, and verification date.
- [x] Category/input/difficulty/offline/license/remix filters work, clear correctly, and survive a shareable query string.
- [x] Users can select 2-4 projects, cannot select a fifth, and can clear/compare selections on mobile and desktop.
- [x] Details include workflow, audience, limitations, license, medical/privacy boundaries, and sources.
- [x] AI input is enum-bounded, free text is length-limited, and no sensitive-data upload exists.
- [x] Worker request and response schemas are validated; model/key names come from environment configuration.
- [x] Missing API configuration or runtime failure produces a usable deterministic fallback without crashing.
- [x] `/projects` contains the internal Aging Clock Atlas card with status/tags/update date.
- [x] SEO title, description, canonical, Open Graph, heading hierarchy, focus states, keyboard navigation, dark mode, and 360/768/1440 layouts are covered.
- [x] Focused tests, Astro check, lint, format check, build, diff checks, and secret/build-artifact scans pass or are reported factually.
- [x] The BioAI daily frontend remains unchanged; existing dirty files in all repositories remain preserved.

## Current Progress

- [x] Read task, repository-level instructions, and applicable skills.
- [x] Record all three initial `git status --short` results.
- [x] Locate current Astro project entry, package manager, build commands, layouts, styles, and public-env convention.
- [x] Locate BioAI Worker routing, model adapter, tests, Wrangler config, and overlapping user change in `src/index.js`.
- [x] Locate the newest dated remote daily/opportunity/project-opportunity content without modifying the daily repository.
- [x] Verify the four required official repositories and license-file presence.
- [x] Create and validate `daily-to-project` repository Skill.
- [x] Implement and build the first static vertical slice.
- [x] Complete filtering, comparison, details, backend route, planner, navigation integration, and tests.
- [x] Run review/fix/retest rounds and record final evidence.
- [x] Deploy and verify the Worker preview and production route without exposing provider credentials.
- [x] Verify exact sequential 5-per-60-second enforcement in an AI-disabled preview.

## Assumptions

- Feature work is committed on isolated branches; deployment uses clean release worktrees so unrelated local changes remain in place.
- The existing `cloudflare-bioai-daily` Worker remains the API host and the existing GitHub Pages workflow remains the frontend deployment path.
- Only public repository metadata is displayed. Project execution inputs are described, never accepted from visitors.
- Current verification date is 2026-07-11 (Asia/Shanghai).

## Risks

- Three candidate repositories have no detectable license file; only facts and links may be shown.
- `epiage-skill` code is MIT, but GrimAge commercial terms and third-party coefficients/reference data require separate review.
- The Worker worktree already changes `src/index.js`; integration must be a minimal additive patch and preserve visitor-stats work.
- Remote BioAI daily content is ahead of the local checkout, so source verification depends on authenticated read-only GitHub API results.
- Real preview and production calls were attempted within the two-call debugging cap. The primary route did not produce a schema-valid response inside the guarded path, and the backup route returned provider authentication failure; deterministic server fallback remains explicit and safe.
- Repository-wide lint and formatting have pre-existing failures outside this feature. Changed-file lint and formatting pass; the baseline files were not reformatted because that would expand scope.

## Test Results

| Check | Result |
| --- | --- |
| Initial three-repository status | Completed; unrelated dirty files recorded and preserved |
| Candidate metadata/README/license presence | Completed via official GitHub repositories |
| Dependency check | `pnpm install --frozen-lockfile` passed; lockfile already current |
| Repository Skill validation | `quick_validate.py` passed with UTF-8 mode |
| Frontend focused tests | 6/6 passed |
| Worker focused tests | 13/13 passed after timeout-budget and layered-rate-limit review |
| Worker full tests | 52/52 passed in the clean release worktree |
| Changed-file lint/format | ESLint and Prettier checks passed |
| Repository-wide lint | Failed only on 12 pre-existing errors in `bioai-backend-files/src/handlers/scheduledBlog.js` |
| Repository-wide format | Failed on the pre-existing formatting baseline; no feature file was listed by the focused check |
| Astro check | Passed with 0 errors/0 warnings and 4 existing hints in `scheduledBlog.js` |
| Production build | Passed; 495 pages built, target route emitted, 307 pages indexed by Pagefind, Windows copy step passed |
| Static preview | Direct route and query-string reload both returned HTTP 200 |
| Secret and generated-bundle scan | No key/token candidate found in feature sources or `dist`; `.env.example` values remain empty |
| Responsive/keyboard inspection | System Chrome passed 360/768/1440, no horizontal overflow/page errors; filters, comparison, native dialog/Escape, fallback, reload, and dark mode passed |
| Review/fix round 1 | Strengthened positive medical-capability rejection and added environment-forwarding assertions |
| Review/fix round 2 | Verified production preview and separated feature checks from repository baseline failures |
| Review/fix round 3 | Audited final diffs, staged state, production config, temp artifacts, and secret candidates; long-string hits were existing Google News href paths, not credentials; added a containment guard before replacing Pagefind assets |
| Worker preview | Final candidate uploaded; existing `/getContent`, `/rss`, visitor preflight, CORS, 400/403/405/413 paths passed |
| Rate-limit preview | AI disabled; requests 1-5 returned 200 and request 6 returned 429 with `Retry-After: 60` |
| Real provider checks | Preview and production returned safe `server-fallback`; no model response was presented as live AI |
| Production and push | Worker `cb2bf98e-e63c-4d11-a450-6f60dbe985af` deployed with rollback `af31c5d5-89a3-4186-a6f2-7d45b315f9e9`; backend `main` is `f36a4d8`; frontend `main` is `3afcf74`; GitHub Pages run `29181664512` completed successfully |
