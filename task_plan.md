# Task Plan

## Goal
- Identify why astro-paper front-end still shows old posts when repo has new blog content, then fix and verify deployment.

## Phases
- [x] 1. Gather state from astro-paper repo and deployment status.
- [x] 2. Trace content pipeline (backend -> repo -> build -> site) to find break point.
- [x] 3. Apply fix or trigger rebuild; verify site updates.

## Decisions/Notes
- Project focus: d:\GitHub\astro-paper
- Root cause found: GitHub Pages deploy fails due to missing unist-util-visit dependency.
- Applied fixes: add dependencies, fix remark plugin typing, normalize description quoting, push + successful deploy.

## Errors Encountered
| Error | Attempt | Resolution |
| --- | --- | --- |
| Get-Content failed for src\\pages\\posts\\[...page].astro (PowerShell path parsing) | 1 | Use quoted path or Get-ChildItem to locate file |
| gh run list timed out for dongyu19920904/astro-paper | 1 | Retry with smaller timeout/limit or check gh auth |
| gh run list timed out (retry with --json/limit 5) | 2 | Consider checking via web or reduce query further |
| gh run view without -R hit 404 for wrong repo | 1 | Re-run with -R dongyu19920904/astro-paper |
| pnpm install reported ERR_PNPM_META_FETCH_FAIL for registry.npmmirror.com | 1 | Non-blocking; install completed; proceed |
| pnpm astro check failed: missing unist-util-visit | 1 | Expected pre-fix; will add dependency |
| pnpm astro check failed after dependency add: YAML frontmatter error in ai-daily-2026-01-11.md; fonts.google.com fetch timeout | 1 | Investigate YAML quoting / decide fix |
| pnpm astro check timed out locally after font provider fetch timeouts | 1 | Retry with longer timeout or rely on CI |
| pnpm add -D @types/mdast logged ECONNRESET from registry.npmmirror.com | 1 | Retry succeeded; dependency added |
| pnpm astro check failed: remarkProxyImages Plugin type mismatch (Root vs Node) | 1 | Added mdast types + Plugin<[], Root> |
| git push origin main timed out | 1 | Verify remote state; retry with higher timeout or push again |
