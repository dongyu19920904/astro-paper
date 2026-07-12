---
name: daily-to-project
description: Turn dated AI/BioAI daily-report discoveries into a verified, deployable website MVP. Use when Codex handles 日报选题, AI 延续学日报项目, open-source project remixing, 开源项目改造, project directories, 项目导航网站, or integrating a daily-report idea into this AstroPaper site.
---

# Daily To Project

Convert one dated source signal into the smallest useful website slice while preserving provenance, licenses, user safety, and the destination site's conventions.

## Workflow

1. **Find the source.** Locate the newest daily, opportunity daily, and project-opportunity daily by dates in file content or paths. Record exact source paths, dates, and whether evidence came from the local checkout or a read-only remote view.
2. **Extract candidates.** List the referenced public repositories and the concrete user problem each could support. Keep claims from the daily separate from repository facts.
3. **Verify candidates.** Read each official README, repository metadata, license/notice, recent maintenance evidence, runtime requirements, inputs, outputs, and third-party data/model/weight/coefficient terms. Mark missing or ambiguous terms as unknown; never assume repository code licensing covers bundled artifacts.
4. **Score the shortlist.** Score source relevance, user value, website fit, local feasibility, maintenance evidence, documentation, license clarity, privacy/medical risk, and delivery size. Reject ideas that need sensitive uploads, clinical claims, unavailable hardware/data, or broad infrastructure.
5. **Choose the safe slice.** Select the lowest-risk candidate that can be demonstrated on the current device and within the existing stack. State the audience, one primary job, non-goals, source facts, assumptions, and acceptance checks before editing.
6. **Build vertically.** Implement one end-to-end slice first: validated source data, one real rendered item, its source link, and the smallest interaction. Reuse the site's layout, tokens, components, package manager, and public data contracts.
7. **Integrate the entry.** Add the internal route to the existing project navigation/data source. Preserve language, SEO, canonical metadata, dark mode, responsive spacing, keyboard navigation, and focus behavior.
8. **Verify before expanding.** Run focused data/logic tests, type checks, lint, formatting checks, build, direct-route inspection, 360/768/1440 responsive inspection, keyboard/accessibility checks, `git diff --check`, and a secret scan. Confirm generated browser code contains no key and copied no unlicensed code/data.
9. **Report and iterate.** Inspect the rendered slice and actual diff, fix material issues, and retest. Report sources, licenses, limitations, verification commands/results, unresolved questions, rollback scope, and no more than five next actions.

## Guardrails

- Keep source ingestion, writing, and publishing separate; do not modify the daily-report repository unless the task explicitly requires it.
- Summarize public metadata when a license is unknown; do not copy code, datasets, weights, coefficients, images, or manifests.
- Never collect DNA, methylation, MRI, medical records, patient data, credentials, or other sensitive inputs in a navigation/education MVP.
- Never present research software as a medical device or provide diagnosis, disease prediction, treatment, or a personal biological-age result.
- Put secrets only in server-side environment/secret stores. Expose only named non-secret `PUBLIC_` configuration to browser code.
- Preserve unrelated dirty files, avoid broad refactors, and do not push or deploy unless the user separately authorizes it.

## Delivery Evidence

Finish only when the source trail is reproducible, the first slice works without private data or provider credentials, the project entry exists, supported checks have run, and remaining license/deployment work is stated explicitly.
