# Domain Quality Profiles (DQPs) for quality.arc42.org — Concept Summary

## The problem

The arc42 Quality Model (Q42) at quality.arc42.org has grown to 216+ quality characteristics, 130+ example requirements, 42 standards, and 21 solution approaches across 9 quality dimensions (#efficient, #reliable, #secure, #usable, #safe, #maintainable, #flexible, #suitable, #operable). This breadth is excellent as a reference, but practitioners face a cold-start problem: "Where do I begin for *my* system?"

## The concept: Domain Quality Profiles

A DQP is a **curated navigation aid** — not new content, but a guided entry point into the existing Q42 collection. Each profile selects and prioritises a subset of characteristics, requirements, and standards that are typically most relevant for a specific type of system. Profiles are explicitly framed as **starting points, not checklists**.

In the Q42 domain language (dimensions → characteristics → requirements → standards → approaches), a DQP sits as a dashed-border container *around* these existing building blocks — a curatorial layer, not a new entity type. We chose green as the visual colour (matching the "approaches" family) and a dashed border to signal "scope/lens" rather than "new peer concept." The profile appears in the site navigation directly after "How to Use this Site" and before "Quality Dimensions."

## The five classification axes

Each profile is classified along five axes that independently and meaningfully shift quality priorities. The acid test: changing one axis value while holding others constant should noticeably shift which characteristics dominate. All five pass this test.

1. **Audience** — mass-market · professional · internal. Drives usability depth, accessibility requirements, onboarding vs. power-user efficiency.
2. **Regulation** — safety-critical · compliance · light. Drives certifiability, auditability, traceability rigour.
3. **Platform** — web · mobile · embedded · cloud. Drives resource constraints, deployment model, device diversity.
4. **Criticality** — life-critical · business-critical · convenience. Drives fault tolerance, recovery targets, testing depth.
5. **Interaction style** — transactional · informational · collaborative · monitoring · immersive · batch/pipeline · offline-field. Drives data integrity patterns, latency profiles, sync strategy. This is the most differentiating axis.

### Deliberately excluded: Scale

Scale (millions/thousands/dozens of users) was dropped because it correlates too strongly with audience and doesn't independently shift *which* characteristics matter — only their *targets*.

### Cross-cutting property: Change frequency

Change frequency (how often the system changes) was kept as a **visible property on each profile card** (●●● continuous · ●●○ periodic · ●○○ rare/costly) rather than a sixth filter axis, because nobody searches "show me all fast-changing systems." Change pace instead signals how much weight #maintainable and #flexible get within a profile:

- **Continuous (●●●):** Deployability, testability, modularity, feature flags, DORA metrics become critical.
- **Periodic (●●○):** Changeability, analysability, impact analysis, migration strategies. Changes often externally triggered (regulation, policy).
- **Rare / costly (●○○):** Longevity, backward compatibility, re-certification cost dominate. Architecture must be stable for decades.

## The 12 initial profiles

Selected to maximise contrast across the five axes. If two candidate profiles would share 80%+ of the same characteristics at similar priorities, they were merged.

| # | Profile | Audience | Regulation | Platform | Criticality | Interaction | Change |
|---|---------|----------|-----------|----------|-------------|-------------|--------|
| 01 | E-commerce / online shop | mass | light | web | biz-crit | transactional | ●●● |
| 02 | SaaS / cloud platform (B2B) | prof | compliance | cloud | biz-crit | collaborative | ●●● |
| 03 | Banking / financial services | mass | compliance | web | biz-crit | transactional | ●●○ |
| 04 | Medical device / health IT | prof | safety | embedded | life-crit | monitoring | ●○○ |
| 05 | Railway / transportation | prof | safety | embedded | life-crit | monitoring | ●○○ |
| 06 | Mobile app (consumer) | mass | light | mobile | convenience | informational | ●●● |
| 07 | Embedded / IoT system | internal | compliance | embedded | biz-crit | monitoring | ●○○ |
| 08 | Data platform / ML pipeline | internal | light | cloud | biz-crit | batch/pipeline | ●●○ |
| 09 | Content / news portal | mass | light | web | convenience | informational | ●●● |
| 10 | ERP / enterprise backend | internal | compliance | cloud | biz-crit | transactional | ●●○ |
| 11 | Government / public sector | mass | compliance | web | biz-crit | informational | ●●○ |
| 12 | Mobile game | mass | light | mobile | convenience | immersive | ●●○ |

## Handling domain complexity: Variants

An experienced reviewer pointed out that "e-commerce" alone is too coarse — a concert ticket shop has fundamentally different quality needs than a pharmaceutical shop or a fashion retailer.

Our solution: each profile has a **base layer** (what all systems of this type share) plus **variant cards** on the detail page that describe how specific sub-domains shift priorities. For e-commerce, we defined six variants:

- **Ticketing / Events** (concerts, flights, hotels) — extreme peak concurrency, fairness, queue management, elastic scalability.
- **Regulated goods** (pharmaceuticals, alcohol, weapons) — compliance shifts from "light" to "compliance-heavy," age verification, prescription workflows, audit trails.
- **Custom / print-on-demand** (photo books, T-shirt printing, furniture) — long asynchronous fulfilment chains, order status tracking, configurator usability.
- **Fashion / high-return** (clothing, shoes, accessories) — 40–60% return rates shape the system: reverse logistics, visual product presentation, size/fit recommendations.
- **Marketplace / multi-vendor** (Amazon model, Etsy, B2B platforms) — multi-tenancy, vendor isolation, trust/rating systems, split payments.
- **Subscription / recurring** (subscription boxes, SaaS licences, streaming) — billing cycle reliability, churn-prevention UX, usage metering.

Each variant lists the additional characteristics it activates. This keeps the overview page clean (12 cards) while providing real depth on each detail page.

## Page structure

### Overview page (DQP entry page)

A filter bar with chips for all five axes, a card grid showing all 12 profiles. Each card shows: name, one-line description, axis pills, top-4 dimension tags, and change-pace dots. Filters are additive and optional — the page works without touching them. An expandable "How profiles are classified" section explains the 5 axes for those who want it.

### Detail page (per profile)

Seven sections in order:

1. **Hero** with axis pills, description, and radar chart across the 9 dimensions.
2. **Variants** section with cards for domain-specific sub-types.
3. **Curated characteristics** in three priority tiers (Critical / Important / Consider), each linking to full Q42 detail pages.
4. **Example requirements** — concrete, measurable, with units.
5. **Relevant standards** with brief context why each applies.
6. **Change pace** block explaining which maintainability/flexibility characteristics get extra weight.
7. **Prev/next navigation** between profiles.

## Prior art

No existing work does exactly what DQPs do:

- The **SEI/CMU Quality Attribute Workshop (QAW)** provides a *process* for discovering quality priorities per project, but doesn't publish pre-composed profiles.
- **Bass/Clements/Kazman's** *Software Architecture in Practice* (4th ed.) treats quality attributes as universal building blocks without domain-specific bundles.
- **ISO 25010** provides a taxonomy but no domain navigation.
- **Academic papers** exist for single domains (e.g., quality models for e-commerce, embedded systems), but nobody has assembled a multi-domain, filterable navigation layer over a shared quality model.

The contribution of DQPs is the combination: a practitioner-facing, multi-domain, filterable navigation layer with variant depth, built on top of an existing comprehensive quality model.

## Deliverables created

- Updated Q42 domain language diagram (SVG) showing where DQPs fit
- Navigation placement mockup
- DQP overview/entry page (full HTML prototype with filtering)
- DQP detail page for E-commerce (full HTML prototype with variants)
- Email draft to reviewers (German, two variants)
- LinkedIn post + long-form article (Word document)
- Research summary on prior art

All HTML prototypes are self-contained, support light/dark mode, and are designed as reference implementations for the dev team. The visual language (green dashed borders, axis pill colours, dimension tag colours) is consistent across all deliverables.
