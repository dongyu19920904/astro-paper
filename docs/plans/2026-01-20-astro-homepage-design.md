# Astro Homepage Redesign Design (2026-01-20)

## Goal
Redesign the astro-paper homepage into an Apple-like scrollytelling layout: minimal nav, high whitespace, strong hierarchy, clear CTAs, and a single-message-per-section narrative.

## Non-goals
- Do not replicate Apple.com layouts, copy, or imagery.
- Do not add large JS bundles or heavy client logic.
- Do not change the blog content pipeline or routing.

## Information Architecture
- Top: minimal nav (logo + 3-5 links + one primary CTA).
- Hero: left-aligned title/subtitle + two CTAs; right-aligned abstract glass visual (no UI screenshot).
- Sections 2-4: three single-purpose panels (each with 1 visual or micro-illustration + 1-2 lines of copy).
- Footer: minimal links.
- FAQ: address update frequency, sources & filtering, and subscription (RSS).

## Content Fields (final text from chat)
- Hero title: use approved CN line (daily 5-minute promise).
- Hero subtitle: use approved CN line (one screen for daily/blog/projects).
- Primary CTA: enter blog (CN).
- Secondary CTA: view projects (CN).
- Feature 1: daily brief (CN).
- Feature 2: blog deep dive (CN).
- Feature 3: project entry (CN).
- FAQ: include update schedule (BJT 02:00 daily; 07:00/18:00 blog), source scope, and RSS link.

## Visual Direction & Tokens
- Background: #FFFFFF / #F7F7F8.
- Text: #111111 primary, #555 secondary.
- Accent: single tone #111111.
- Radius: 12-20px.
- Max width: 1100-1200px; padding >= 24px.
- Fonts: display (Sora), body (IBM Plex Sans).
- Hero visual: pure CSS glass sculpture (soft gradients + blur + subtle noise).

## Motion
- Only: fade-in, slight upward motion, and staggered card reveals.
- Respect prefers-reduced-motion.

## Performance & Accessibility
- Lazy-load non-hero visuals (loading="lazy", decoding="async").
- Buttons >= 44px hit area; keyboard navigable; contrast compliant.

## Implementation Notes
- New components under src/components/home/ (HeaderMinimal, HeroSection, FeatureSection, FaqSection, FooterMinimal).
- Update src/pages/index.astro to use new home sections; remove Launchpad/about/featured/recent blocks.
- Update src/styles/global.css for new tokens, layouts, and animation utilities.
- Keep RSS feed endpoint; link from FAQ only.
