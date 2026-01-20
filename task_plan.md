# Task Plan: astro-paper homepage Apple-like scrollytelling

## Goal
Redesign the astro-paper homepage into an Apple-like scrollytelling layout with minimal nav, hero + visual, three feature sections, and FAQ/footer while keeping AstroPaper structure.

## Current Phase
Phase 3

## Phases

### Phase 1: Requirements & Discovery
- [x] Understand user intent
- [x] Identify constraints and requirements
- [x] Document findings in findings.md
- **Status:** complete

### Phase 2: Planning & Structure
- [x] Define technical approach
- [x] Create project structure if needed
- [x] Document decisions with rationale
- **Status:** complete

### Phase 3: Implementation
- [ ] Execute the plan step by step
- [ ] Write code to files before executing
- [ ] Test incrementally
- **Status:** pending

### Phase 4: Testing & Verification
- [ ] Verify all requirements met
- [ ] Document test results in progress.md
- [ ] Fix any issues found
- **Status:** pending

### Phase 5: Delivery
- [ ] Review all output files
- [ ] Ensure deliverables are complete
- [ ] Deliver to user
- **Status:** pending

## Key Questions
1. Homepage visual direction preference? (future tech / soft / editorial / etc.)
2. Should project navigation be ordered or highlight top 1-2 items?

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Apple-like scrollytelling layout with minimal nav, hero, 3 feature sections, FAQ | Matches user brief; improves hierarchy |
| Display font Sora + body IBM Plex Sans | Distinctive but clean pairing |
| Hero visual is CSS-only glass sculpture | No external assets; lightweight |
| Primary CTA = blog, secondary CTA = projects | Directs main traffic; user choice |
| Subscription only in FAQ via RSS | Keeps top nav minimal |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| apply_patch path not found | 1 | Retried with absolute path in astro-paper |
| apply_patch line mismatch (emoji headings) | 2 | Verified headings contain emoji; no change needed |
| apply_patch task_plan update mismatch | 1 | Used script to update due to encoding |
| apply_patch failed to read task_plan (invalid UTF-8 or wrong path) | 1 | Rewrote task_plan.md with UTF-8 content |

| Get-Content CLAUDE.md not found | 1 | Confirmed no CLAUDE.md in astro-paper |

## Notes
- Update phase status as you progress: pending -> in_progress -> complete
- Re-read this plan before major decisions (attention manipulation)
- Log ALL errors - they help avoid repetition

