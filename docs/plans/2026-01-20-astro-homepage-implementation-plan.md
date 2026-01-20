# Astro Homepage Apple-like Scrollytelling Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current homepage with a minimal, Apple-like scrollytelling layout (hero + 3 feature sections + FAQ + minimal footer) using the approved Chinese copy and a CSS glass sculpture visual.

**Architecture:** New home-only components under `src/components/home/`, a streamlined `src/pages/index.astro`, and new design tokens/layout utilities in `src/styles/global.css`. A tiny inline script powers scroll reveal effects.

**Tech Stack:** Astro, Tailwind CSS (via `@apply` utilities), vanilla JS for IntersectionObserver.

---

## Task 1: Environment & Baseline

**Files:**
- Modify: none

**Step 1: Retry dependency install with more heap**

Run:
```bash
$env:NODE_OPTIONS='--max-old-space-size=4096'; npm install
```
Expected: install completes.

**Step 2: If Step 1 fails, try pnpm**

Run:
```bash
pnpm -v
pnpm install
```
Expected: install completes.

**Step 3: If install succeeds, baseline build**

Run:
```bash
npm run build
```
Expected: build completes without errors.

**Step 4: If install fails, proceed with edits only**
Document skip in `progress.md`.

---

## Task 2: Create Minimal Header

**Files:**
- Create: `src/components/home/HeaderMinimal.astro`

**Step 1: Create header component**

```astro
---
const links = [
  { label: '博客', href: '/posts/' },
  { label: '项目', href: '/projects/' },
  { label: '标签', href: '/tags/' },
  { label: '关于', href: '/about/' },
];
---

<header class="home-header">
  <div class="home-header-inner">
    <a class="home-logo" href="/">yuyu</a>
    <nav class="home-nav" aria-label="主导航">
      {links.map(link => (
        <a class="home-nav-link" href={link.href}>{link.label}</a>
      ))}
    </nav>
    <a class="home-cta" href="/posts/">进入博客</a>
  </div>
</header>
```

---

## Task 3: Hero Section

**Files:**
- Create: `src/components/home/HeroSection.astro`

**Step 1: Create hero component**

```astro
---
const { title, subtitle, primaryCta, secondaryCta } = Astro.props;
---

<section class="hero">
  <div class="hero-copy">
    <p class="hero-eyebrow">PROJECT LAUNCHPAD</p>
    <h1 class="hero-title">{title}</h1>
    <p class="hero-subtitle">{subtitle}</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href={primaryCta.href}>{primaryCta.label}</a>
      <a class="btn btn-secondary" href={secondaryCta.href}>{secondaryCta.label}</a>
    </div>
  </div>
  <div class="hero-visual" aria-hidden="true">
    <div class="glass-orb orb-1"></div>
    <div class="glass-orb orb-2"></div>
    <div class="glass-slab"></div>
  </div>
</section>
```

---

## Task 4: Feature Sections

**Files:**
- Create: `src/components/home/FeatureSection.astro`

**Step 1: Create feature component**

```astro
---
const { title, description, meta, flip } = Astro.props;
---

<section class={`story-section ${flip ? 'is-flip' : ''}`}>
  <div class="story-copy reveal">
    <p class="story-meta">{meta}</p>
    <h2 class="story-title">{title}</h2>
    <p class="story-desc">{description}</p>
  </div>
  <div class="story-visual reveal" aria-hidden="true">
    <span class="visual-chip"></span>
    <span class="visual-line"></span>
  </div>
</section>
```

---

## Task 5: FAQ Section

**Files:**
- Create: `src/components/home/FaqSection.astro`

**Step 1: Create FAQ component**

```astro
---
const { items } = Astro.props;
---

<section class="faq">
  <h2 class="faq-title">常见问题</h2>
  <dl class="faq-list">
    {items.map(item => (
      <div class="faq-item">
        <dt>{item.q}</dt>
        <dd>{item.a}</dd>
      </div>
    ))}
  </dl>
</section>
```

---

## Task 6: Minimal Footer

**Files:**
- Create: `src/components/home/FooterMinimal.astro`

**Step 1: Create footer component**

```astro
---
const links = [
  { label: '博客', href: '/posts/' },
  { label: '项目', href: '/projects/' },
  { label: '标签', href: '/tags/' },
  { label: '关于', href: '/about/' },
  { label: 'RSS', href: '/rss.xml' },
];
---

<footer class="home-footer">
  <div class="home-footer-inner">
    <span>© yuyu</span>
    <nav class="home-footer-links">
      {links.map(link => (
        <a href={link.href}>{link.label}</a>
      ))}
    </nav>
  </div>
</footer>
```

---

## Task 7: Rebuild `index.astro`

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace layout**
- Use `HeaderMinimal`, `HeroSection`, `FeatureSection`, `FaqSection`, `FooterMinimal`.
- Remove Launchpad/about/featured/recent blocks.

**Step 2: Provide data constants**
Use the approved copy:
- Title: `每天五分钟跟上 AI 生科`
- Subtitle: `日报+博客+项目入口，一屏找到最该看的`
- Primary CTA: `进入博客` -> `/posts/`
- Secondary CTA: `查看项目` -> `/projects/`

Feature copy:
1) `日报速览` / `更快完成当天信息筛选，因为我们只保留可验证来源，同时不牺牲阅读体验。`
2) `博客深读` / `更快完成结构化理解，因为重点观点会被拆成清晰段落，同时不牺牲细节。`
3) `项目入口` / `更快进入当前在做的产品与实验，因为入口集中在一处，同时不牺牲更新节奏。`

FAQ items:
- 更新频率：北京时间每日 02:00 更新日报；博客 07:00 / 18:00 更新。
- 信息来源：预印本、顶刊/顶会、官方博客与发布会、开源社区与行业媒体，优先可验证来源。
- 订阅方式：提供 RSS（/rss.xml），浏览器或阅读器订阅即可。

**Step 3: Add reveal script**
Add IntersectionObserver to toggle `.is-visible` on `.reveal` elements, with `prefers-reduced-motion` fallback.

---

## Task 8: Update Global Styles

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Update fonts & tokens**
- Replace Oxanium import with Sora.
- Set background to #FFFFFF / #F7F7F8, text #111/#555, accent #111.
- Update `--font-display` to Sora.

**Step 2: Layout utilities**
- `max-w-app` -> 72rem (≈1152px)
- `app-layout` -> `px-6` (>=24px)

**Step 3: Home classes**
Add styles for `.home-header`, `.hero`, `.hero-visual`, `.story-section`, `.faq`, `.home-footer`, `.btn`, `.reveal` animations, and glass visual pieces.

---

## Task 9: Manual Verification (TDD skipped per user approval)

**Step 1: Local preview**
Run:
```bash
npm run dev
```
Expected: Homepage renders with new layout, proper spacing, and animations.

**Step 2: Checklist**
- Nav is minimal and CTA visible.
- Hero title/subtitle and CTAs correct.
- Three feature sections each show one message and appear on scroll.
- FAQ includes update schedule + sources + RSS.
- Buttons >= 44px; contrast acceptable.

---

## Task 10: Commit

**Step 1: Stage changes**
```bash
git add src/pages/index.astro src/styles/global.css src/components/home/*.astro progress.md
```

**Step 2: Commit**
```bash
git commit -m "feat: rebuild homepage scrollytelling"
```

---

Plan complete and saved to `docs/plans/2026-01-20-astro-homepage-implementation-plan.md`.

Two execution options:
1) Subagent-Driven (this session)
2) Parallel Session (separate) using `executing-plans`
