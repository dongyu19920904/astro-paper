# Findings & Decisions
<!-- 
  WHAT: Your knowledge base for the task. Stores everything you discover and decide.
  WHY: Context windows are limited. This file is your "external memory" - persistent and unlimited.
  WHEN: Update after ANY discovery, especially after 2 view/browser/search operations (2-Action Rule).
-->

## Requirements
<!-- 
  WHAT: What the user asked for, broken down into specific requirements.
  WHY: Keeps requirements visible so you don't forget what you're building.
  WHEN: Fill this in during Phase 1 (Requirements & Discovery).
  EXAMPLE:
    - Command-line interface
    - Add tasks
    - List all tasks
    - Delete tasks
    - Python implementation
-->
<!-- Captured from user request -->
- 个人主页首页被评价“单调、无点击欲望”，需要改成一打开就突出“项目导航”。
- 用户选择：优先看项目导航（首页第一屏引导看项目）。

## Research Findings
<!-- 
  WHAT: Key discoveries from web searches, documentation reading, or exploration.
  WHY: Multimodal content (images, browser results) doesn't persist. Write it down immediately.
  WHEN: After EVERY 2 view/browser/search operations, update this section (2-Action Rule).
  EXAMPLE:
    - Python's argparse module supports subcommands for clean CLI design
    - JSON module handles file persistence easily
    - Standard pattern: python script.py <command> [args]
-->
<!-- Key discoveries during exploration -->
- 已初始化 planning-with-files 模板。
- 首页项目卡片数据来自 `src/data/navProjects.ts` 的 `NAV_LINKS`（包含 title/desc/url/tag/icon）。
- `src/styles/global.css` 定义主题色与 `--font-app`，整体字体由 `--font-google-sans-code` 驱动，色板较克制。
- `src/styles/typography.css` 主要控制文章排版，不影响首页模块结构。
- `src/layouts/Layout.astro` 通过 `astro:assets` 加载字体变量 `--font-google-sans-code`。
- 项目内只看到 `--font-google-sans-code` 变量引用，未找到其他字体定义来源（需决定是否引入新字体）。
- 项目使用 Tailwind v4（无单独 tailwind.config），可在 `src/styles/global.css` 增加自定义样式与字体引入。
- `src/pages/index.astro` 目前先 hero 再项目导航，且 hero 文案较长；需要调整为 Launchpad 首屏。
- 已将首页结构替换为 Launchpad 首屏 + 下方 About（`src/pages/index.astro`），项目卡片为首屏主视觉。
- 纠正了 Launchpad 区块中文文本被误写成“?”的问题，并清理了残留注释行。
- Launchpad 区块已确认只保留一条正确注释与中文文案。

## Technical Decisions
<!-- 
  WHAT: Architecture and implementation choices you've made, with reasoning.
  WHY: You'll forget why you chose a technology or approach. This table preserves that knowledge.
  WHEN: Update whenever you make a significant technical choice.
  EXAMPLE:
    | Use JSON for storage | Simple, human-readable, built-in Python support |
    | argparse with subcommands | Clean CLI: python todo.py add "task" |
-->
<!-- Decisions made with rationale -->
| Decision | Rationale |
|----------|-----------|
|          |           |

## Issues Encountered
<!-- 
  WHAT: Problems you ran into and how you solved them.
  WHY: Similar to errors in task_plan.md, but focused on broader issues (not just code errors).
  WHEN: Document when you encounter blockers or unexpected challenges.
  EXAMPLE:
    | Empty file causes JSONDecodeError | Added explicit empty file check before json.load() |
-->
<!-- Errors and how they were resolved -->
| Issue | Resolution |
|-------|------------|
|       |            |

## Resources
<!-- 
  WHAT: URLs, file paths, API references, documentation links you've found useful.
  WHY: Easy reference for later. Don't lose important links in context.
  WHEN: Add as you discover useful resources.
  EXAMPLE:
    - Python argparse docs: https://docs.python.org/3/library/argparse.html
    - Project structure: src/main.py, src/utils.py
-->
<!-- URLs, file paths, API references -->
- d:\GitHub\astro-paper

## Visual/Browser Findings
<!-- 
  WHAT: Information you learned from viewing images, PDFs, or browser results.
  WHY: CRITICAL - Visual/multimodal content doesn't persist in context. Must be captured as text.
  WHEN: IMMEDIATELY after viewing images or browser results. Don't wait!
  EXAMPLE:
    - Screenshot shows login form has email and password fields
    - Browser shows API returns JSON with "status" and "data" keys
-->
<!-- CRITICAL: Update after every 2 view/browser operations -->
<!-- Multimodal content must be captured as text immediately -->
-

---
<!-- 
  REMINDER: The 2-Action Rule
  After every 2 view/browser/search operations, you MUST update this file.
  This prevents visual information from being lost when context resets.
-->
*Update this file after every 2 view/browser/search operations*
*This prevents visual information from being lost*
## 2026-01-19 12:10
- Plan files present in repo root; task_plan.md shows Phase 3 in progress.
- task_plan.md contains mojibake/encoding issues from previous write.
## 2026-01-19 12:11
- launchpad section and styles found in index.astro + global.css; ready for commit/push.
## 2026-01-19 12:12
- index.astro contains '?' placeholders for headings; needs cleanup to plain text.
- global.css has fonts + metallic variables; no obvious issues.
## 2026-01-19 12:14
- index.astro headings use emoji (rg shows emoji); console displays '?' due to code page.
- No content change required for headings.
## 2026-01-19 12:19
- Repo is now up to date with origin/main after rebase.
- Upstream added src/data/blog/bioai-daily-2026-01-19.md.
## 2026-01-19 12:22
- index.astro BOM removed; staged diff looks clean for homepage swap.
## 2026-01-19 12:25
- Commit created for index.astro + global.css; ready to push and deploy.
## 2026-01-19 12:27
- Deploy workflow triggered for astro-paper; monitor run 21125289364.
## 2026-01-19 12:30
- task_plan.md goal rewritten in ASCII; Phase 3 complete, Phase 4 in progress.
## 2026-01-19 13:08
- Glass panel styling staged; planning files left unstaged.
## 2026-01-19 13:10
- Push blocked by TLS handshake error (schannel) to GitHub remote.
## 2026-01-19 13:11
- Remote is https://github.com/dongyu19920904/astro-paper.git; git 2.51.0.windows.2.
## 2026-01-19 13:12
- ssl backend uses schannel; no explicit sslVerify/schannelCheckRevoke config found.
## 2026-01-19 13:14
- No git http.proxy or sslCAInfo settings found.
## 2026-01-19 13:15
- Network TCP to github.com:443 OK; TLS handshake issue likely schannel/cert layer.
## 2026-01-19 14:23
- Deploy workflow triggered for astro-paper; current run 21127468435.
- Current homepage layout is defined in src/pages/index.astro with a launchpad hero, about section, featured/recent posts, and uses NAV_LINKS from src/data/navProjects.ts.
- Global styles for launchpad and visual tokens are in src/styles/global.css and currently use Oxanium/IBM Plex fonts and metal/glass theme.
- Header navigation is in src/components/Header.astro and currently includes menu links, search, and theme toggle without a primary CTA.
- Read task_plan.md: Phase 1 in_progress; decisions table empty; key questions still present. TDD skill requires failing test unless user approves skip for style-only changes.
- index.astro still uses Launchpad/about/featured/recent layout with mojibake text and a broken project-arrow span ("a??/span>"), so homepage needs full replacement per new Apple-like scrollytelling spec.
- Loaded using-git-worktrees + writing-plans skills. Need to create isolated worktree and write implementation plan before code; plan expects TDD but user approved skipping tests, so plan will document manual visual verification instead.
- No .worktrees/ or worktrees/ directory found in astro-paper.
- git worktree list shows only main worktree at D:/GitHub/astro-paper. Repo root confirmed: D:/GitHub/astro-paper.
