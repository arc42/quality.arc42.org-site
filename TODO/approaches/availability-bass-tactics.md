# Project Plan: Bass-Inspired Availability Tactics for Q42

## Goal

Add a curated, practical set of availability tactics inspired by Bass et al. to `quality.arc42.org`, connected to existing qualities, requirements, and standards.

This plan focuses on implementation quality, not just content volume.

## Scope

- In scope:
  - Availability tactics taxonomy based on Bass-style grouping.
  - Approach pages in `_approaches/` with consistent structure.
  - Cross-linking from quality and tag pages.
  - Clear trade-offs and verification ideas for each tactic.
- Out of scope (for this first increment):
  - Tool-specific implementation tutorials.
  - Domain-specific deep dives (cloud-provider details, vendor products).
  - Full coverage of all architecture tactics beyond availability.

## Target Information Architecture

Primary grouping:

1. Detect Faults
2. Recover from Faults
3. Prevent Faults

Secondary grouping:

- Recover from Faults -> Preparation and Repair
- Recover from Faults -> Reintroduction

Proposed tactic candidates (normalized for Q42 content):

- Detect Faults:
  - Monitoring
  - Ping/Echo
  - Heartbeat
  - Timestamp
  - Condition Monitoring
  - Sanity Checking
  - Voting
  - Exception Detection
  - Self-Test
- Recover from Faults / Preparation and Repair:
  - Redundant Spare
  - Rollback
  - Exception Handling
  - Software Upgrade
  - Retry
  - Ignore Faulty Behavior
  - Graceful Degradation
  - Reconfiguration
- Recover from Faults / Reintroduction:
  - Shadow
  - State Resynchronization
  - Escalating Restart
  - Nonstop Forwarding
- Prevent Faults:
  - Removal from Service
  - Transactions
  - Predictive Model
  - Exception Prevention
  - Increase Competence Set

Note: Some terms may need renaming to better fit modern software architecture wording while preserving the Bass intent.

## Content Model (per tactic page)

Each tactic page should contain:

- Front matter:
  - `title`
  - `tags` (usually `reliable`, optionally `operable`/`maintainable`)
  - `supported_qualities` (for example: `availability`, `recoverability`, `fault-tolerance`)
  - `tradeoffs` (negative impacts, for example: `complexity`, `efficiency`, `consistency`)
  - `intent`
  - `mechanism`
  - `applicability`
  - `permalink`
- Body sections:
  - How it works
  - Failure modes
  - Verification ideas (measurable)
  - Variants and related tactics
  - References (Bass and at least one additional source)

## Delivery Phases

## Phase 0 - Baseline and Taxonomy Lock (0.5 day)

Deliverables:

- Final tactic list with canonical naming.
- Mapping table: Bass term -> Q42 page title/permalink slug.
- Decision log for renamed or merged tactics.

Exit criteria:

- Maintainer approval of taxonomy and naming.

## Phase 1 - Pilot Tactics (2-3 days)

Implement 6 high-value tactics first:

1. Heartbeat
2. Retry
3. Graceful Degradation
4. Rollback
5. Redundant Spare
6. Exception Detection

Deliverables:

- 6 approach pages in `_approaches/`.
- Links from relevant quality/tag pages where appropriate.
- Consistent trade-off and verification sections.

Exit criteria:

- All 6 pages render correctly.
- No broken internal links.
- Content review passed by maintainer.

## Phase 2 - Core Availability Set (4-6 days)

Implement remaining mainstream tactics (recommended next 10):

1. Monitoring
2. Ping/Echo
3. Condition Monitoring
4. Self-Test
5. Exception Handling
6. Reconfiguration
7. State Resynchronization
8. Escalating Restart
9. Transactions
10. Removal from Service

Deliverables:

- 10 additional approach pages.
- Updated cross-links and navigation consistency.

Exit criteria:

- At least 16 total availability tactic pages.
- Uniform page structure and quality level.

## Phase 3 - Advanced/Contextual Tactics (3-4 days)

Implement advanced or context-sensitive tactics:

- Timestamp
- Voting
- Software Upgrade (availability-focused angle)
- Ignore Faulty Behavior
- Shadow
- Nonstop Forwarding
- Predictive Model
- Exception Prevention
- Increase Competence Set

Deliverables:

- Final availability tactic set published.
- "Further reading" notes on niche/advanced usage.

Exit criteria:

- Full planned tactic set complete.
- Editorial review complete.

## Quality Gates

For every tactic page:

- Uses agreed front matter fields.
- Contains explicit trade-offs.
- Contains at least 3 verification ideas with measurable indicators.
- Contains at least 2 internal links to related qualities/approaches.
- Includes at least one authoritative reference.

Repository-level checks:

- `npm run build` succeeds.
- No permalink collisions.
- No broken links on touched pages.

## Suggested Work Breakdown

- Role: content lead
  - Draft intent/mechanism/applicability for each tactic.
- Role: technical editor
  - Validate architecture precision and trade-offs.
- Role: repo integrator
  - Create files, add links, run build checks.

If one person does all roles: work in batches of 3 tactics per PR.

## Prioritization Rules

When time is limited, prioritize tactics that are:

- Widely applicable in modern web/distributed systems.
- Easy to explain with concrete verification metrics.
- Strongly connected to current Q42 requirements examples.

Deprioritize tactics that are:

- Highly domain-specific without context.
- Hard to verify objectively.
- Mostly process/organization advice with little architecture content.

## Risks and Mitigations

- Risk: Generic, shallow pages.
  - Mitigation: enforce verification/trade-off depth gate.
- Risk: Inconsistent naming and slugs.
  - Mitigation: lock taxonomy in Phase 0.
- Risk: Overlap between tactics causing duplicate content.
  - Mitigation: add "Related tactics" and explicit boundary notes.
- Risk: Too much content in one PR.
  - Mitigation: small batched PRs (max 3 tactics).

## Milestones

- M1: Taxonomy approved.
- M2: Pilot 6 tactics live.
- M3: Core 16 tactics live.
- M4: Full availability tactic catalog live.

## Definition of Done

The availability tactics initiative is done when:

- Planned tactic set is published with consistent quality.
- Cross-linking supports navigation from qualities/requirements to tactics.
- Maintainer confirms usefulness for real project planning and architecture decisions.
