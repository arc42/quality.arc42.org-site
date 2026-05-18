# LinkedIn Series Plan: q42 Impeccable Critique, Violet Redesign, Search, and Performance (Apr-May 2026)

## Source Analysis

This proposal is based on the local git history, with the main focus on `main..418-violet-redesign`.

- Core range: 22 commits from 2026-04-24 to 2026-05-11.
- Diff size: 146 files changed, 8039 insertions, 12641 deletions.
- Branches represented in or feeding this work: `418-violet-redesign`, `418-redesign-site-navigation`, `lunr-search`, `codex/#446-asset-optimizition`, `add-wikipedia-ref-access-control`, `impeccable-audit-again`, and the local `improve-fa-icon-handling` tip.
- Broader history checked for related topics since March 2026: navigation extraction/simplification, color model work, WCAG/Lighthouse reports, search, asset optimization, visual testing, and Impeccable critique notes.
- Important process artifacts: `TODO/visual/impeccable-combined-260425.md`, `TODO/asset-optimization/consolidated-proposal.md`, and commits such as `f1aa77d`, `a527532`, and `134531e`.

## Recommendation

Use a **5-post LinkedIn series** rather than one large post.

Reason: the work has three distinct messages that appeal to overlapping but different audiences:

- design-minded engineers: critique-driven redesign with the Impeccable skill collection
- architects and trainers: usability of q42 as a knowledge model
- frontend and web engineers: navigation, search, and page-load work
- quality-minded teams: measuring site quality with Lighthouse and WCAG reports

A single long post can still work as a wrap-up after the series, but it should not be the primary format.

## Short List of Change Topics

1. **Critique-driven redesign with Impeccable**
   - The redesign started with critique, not color picking.
   - The Impeccable skill collection was used to review the existing UI as a design system and product surface.
   - The critique called out concrete weaknesses: old-brand residue, inconsistent visual hierarchy, header/search usability, homepage graph framing, count/copy clarity, focus states, contrast, reduced-motion behavior, and token consistency.
   - This created a backlog that grounded the later improvements.
   - The useful message for readers: AI-assisted critique is strongest when it produces inspectable findings and a prioritized improvement path, not when it blindly generates a new look.

2. **Visual redesign and product identity**
   - Violet/cream visual system became the structural brand direction.
   - Header, footer, homepage, page panels, tag chips, and content surfaces were aligned.
   - New typography assets were added: Atkinson Hyperlegible and Libre Caslon.
   - Old visuals and legacy presentation leftovers were removed.

3. **Navigation as part of usability**
   - Navigation was extracted into `_data/navigation.yml`.
   - Primary/secondary navigation was simplified and tuned.
   - Mobile navigation received practical behavior changes, including hiding the sticky header on downward scroll and revealing it on interaction.
   - A reported mobile font sizing issue was fixed.

4. **Search and discoverability**
   - The old naive search was replaced with Lunr-based search.
   - A generated search index now covers qualities, requirements, standards, and approaches.
   - Search ranking uses titles, aliases, tags, and body text.
   - This matters because q42 has grown enough that "find by intent" is now a core workflow.

5. **Page-load and asset optimization**
   - Legacy CSS files were decommissioned or migrated into modular Sass.
   - Dead JavaScript and old static page scripts were removed.
   - jQuery and the old sticky plugin were dropped from the global page load.
   - Site JavaScript is now bundled via esbuild.
   - Mermaid is lazy-loaded only when diagrams exist on a page.
   - Unused Font Awesome regular font files were removed.

6. **Measured quality, not just perceived quality**
   - Lighthouse reports were generated and committed under `assets/reports/lighthouse/`.
   - The Lighthouse scan covers 21 representative routes.
   - Between the Apr 27 and May 11 reports, local audit averages moved from:
     - Performance: 92 to 96
     - Accessibility: 91 to 98
     - Best practices: 74 to 95
     - SEO: 95 to 99
   - WCAG reports and the accessibility scope notes were updated.

7. **Maintainability behind the scenes**
   - Product guidance moved from `.impeccable.md` to `PRODUCT.md`.
   - `CLAUDE.md` was heavily streamlined.
   - Build tooling and Docker/Jekyll setup were adjusted so the redesigned site is easier to run and audit locally.

## Suggested Post Split

| Post | Topic | Working Title | Main Message |
| --- | --- | --- | --- |
| 1 | Method | Critique before redesign | Impeccable critique helped expose visual weaknesses and turn them into a concrete redesign backlog. |
| 2 | Visual redesign | A quality model also needs usability | q42 moved from a useful content repository toward a clearer product surface. |
| 3 | Navigation and search | When a model grows, search becomes architecture | Better navigation and Lunr search make q42 easier to use in daily work. |
| 4 | Page load | The fastest feature is the one you delete | Performance came from removing old CSS/JS/assets and loading work only when needed. |
| 5 | Measurement | We published the quality signals of the quality site | Lighthouse and WCAG reports make site quality visible and repeatable. |

## Commit Evidence Map

- `38b90c0` - refined content and navigation, introduced the site header include and navigation data.
- `f1aa77d`, `859bb5f`, `2b1f7f6` - violet visual system, typography, homepage/header/footer work, graph presentation updates.
- `a527532` - optimization proposals from Impeccable and asset reviews.
- `134531e` - post-Impeccable refinements, WCAG/accessibility notes, graph and responsive polish.
- `5e872a4` - Lunr search, generated search index, ranking across titles, aliases, tags, and content.
- `fa65984`, `9eeaa4e` - asset optimization: remove legacy CSS, remove static scripts, drop jQuery/sticky plugin, bundle site code.
- `02ab077`, `6518a74` - Lighthouse report generation and report updates.
- `081101b` - mobile font sizing fix reported by a user.
- `cd1557c` - navigation and overall feel, including mobile sticky-header behavior.
- `c60be30` - page-load work: lazy Mermaid, remove incremental Jekyll setting, remove unused Font Awesome regular assets.

## Visual Ideas

- Post 1: screenshot or excerpt of the Impeccable TODO list, showing critique categories rather than private prompt text.
- Post 2: before/after screenshot of homepage or header/footer.
- Post 3: search result screenshot for a real term such as "access control" or "availability".
- Post 4: small graphic with "8039 insertions, 12641 deletions" and a short list of removed assets.
- Post 5: screenshot of the Lighthouse report page with the four average scores.

## Cadence

- Publish 2 posts per week over 2-3 weeks.
- Use the fifth post as the bridge into future q42 work.
- If time is limited, publish posts 1, 2, and 4 first: they tell the strongest process-to-outcome story.

## Hashtag Set

Use only 3-5 per post, for example:

`#SoftwareArchitecture #QualityAttributes #WebPerformance #Accessibility #OpenSource`
