# Action Plan: Integrating Solution Approaches into quality.arc42.org

This document outlines the plan for adding "solution approaches" (architectural tactics and patterns) to the site. The goal is to bridge the gap from "what" (quality requirements) to "how" (implementation ideas).

## Status and Progress (Iteration 2)

We have successfully established the initial technical foundation and created two pilot approaches.

- **[x] Define "Approach" Entity:** Architectural tactics or patterns.
- **[x] Create Jekyll Structure:** `_approaches` collection, `_layouts/approach.html`, `_includes/directly-related-approaches.html`, and initial cross-linking.
- **[x] Establish Content Template:** See `TODO/approaches/TEMPLATE.md` (authoring reference, not published).
- **[x] Pilot Approach 1:** `_approaches/C/caching.md` is complete.
- **[x] Pilot Approach 2:** `_approaches/C/circuit-breaker.md` is complete (including Mermaid state diagram).
- **[x] Enhance Trade-off Visibility:** Quality pages now show approaches with potential negative impact via `_includes/directly-related-tradeoffs.html`.
- **[x] Automated Cross-linking:** Quality pages now automatically list related approaches (supported and trade-offs).

## Definition of Done for an Approach

An approach is considered **done** when it:

- Has complete frontmatter: `title`, `tags`, `supported_qualities`, `tradeoffs`, `intent`, `mechanism`, `applicability`, `permalink`
- Includes a "How It Works" section with at least one Mermaid diagram (where a flow or state diagram is natural)
- Lists at least two concrete **Failure Modes**
- Lists at least two **Verification Ideas** (measurable, tool-specific where possible)
- Links at least one **Related Requirement** from `_requirements/`
- Lists at least one **Variant**
- All `supported_qualities` and `tradeoffs` reference valid quality IDs (verified by `npm run test:links`)

---

## Phase 1: Technical Refinement

1. **[x] Mermaid.js in Approach Layouts:**
   - Circuit Breaker pilot already uses a Mermaid state diagram successfully.
   - The `approach.html` layout renders Mermaid blocks via the standard Jekyll pipeline.
   - **Remaining:** Verify Mermaid is loaded site-wide (not just on approach pages) and document the expected diagram types in `TEMPLATE.md`.

2. **[ ] Quality-Approach Matrix Page:**
   - **Action:** Create `_pages/72-approaches-matrix.md` at permalink `/approaches/matrix/`.
   - **Content:** A table with the 9 top-level quality dimensions as columns and all published approaches as rows. Cells indicate "supports" (✓) or "trade-off" (⚠).
   - **Implementation:** Use a Liquid loop over `site.approaches` reading `tags` and `tradeoffs` frontmatter to build the matrix dynamically — no hardcoding.
   - **Acceptance:** Matrix renders without manual maintenance as new approaches are added.

3. **[ ] Extend `_includes/directly-related-approaches.html`:**
   - **Action:** Also show approaches on **requirement** pages (not just quality pages), since requirements are the direct "customer" of approaches.
   - **Acceptance:** A requirement page like `/requirements/cache-response-time` shows linked approaches automatically.

---

## Phase 2: Content Backlog

The focus is the **9 top-level quality properties**: Suitable, Usable, Secure, Reliable, Operable, Efficient, Flexible, Safe, and Maintainable.

**MVP milestone:** At least **2 approaches per dimension** = 18 approaches total.

### Priority Approaches

| Dimension | Tactic / Pattern | File | Status |
| :--- | :--- | :--- | :--- |
| **Efficient** | Caching | `_approaches/C/caching.md` | [x] |
| **Efficient** | Database Indexing | `_approaches/D/database-indexing.md` | [ ] |
| **Reliable** | Circuit Breaker | `_approaches/C/circuit-breaker.md` | [x] |
| **Reliable** | Redundancy / Replication | `_approaches/R/redundancy.md` | [ ] |
| **Reliable** | Health Check / Heartbeat | `_approaches/H/health-check.md` | [ ] |
| **Secure** | Principle of Least Privilege | `_approaches/P/least-privilege.md` | [ ] |
| **Secure** | Input Validation / Sanitization | `_approaches/I/input-validation.md` | [ ] |
| **Operable** | Centralized Logging | `_approaches/C/centralized-logging.md` | [ ] |
| **Operable** | Structured Observability | `_approaches/S/structured-observability.md` | [ ] |
| **Flexible** | Plugin Architecture | `_approaches/P/plugin-architecture.md` | [ ] |
| **Flexible** | Feature Toggles | `_approaches/F/feature-toggles.md` | [ ] |
| **Maintainable** | Dependency Injection | `_approaches/D/dependency-injection.md` | [ ] |
| **Maintainable** | Strangler Fig | `_approaches/S/strangler-fig.md` | [ ] |
| **Safe** | Fail-safe Defaults | `_approaches/F/fail-safe-defaults.md` | [ ] |
| **Safe** | Watchdog / Supervisor | `_approaches/W/watchdog.md` | [ ] |
| **Usable** | Progressive Disclosure | `_approaches/P/progressive-disclosure.md` | [ ] |
| **Usable** | Responsive Design | `_approaches/R/responsive-design.md` | [ ] |
| **Suitable** | Domain-Driven Design | `_approaches/D/domain-driven-design.md` | [ ] |
| **Suitable** | Event Sourcing | `_approaches/E/event-sourcing.md` | [ ] |

---

## Phase 3: Content Creation Workflow

Every new approach file must follow this checklist:

1. **Start from the template:** Copy `TODO/approaches/TEMPLATE.md` to the appropriate alphabetical subdirectory under `_approaches/`.
2. **Fill all frontmatter fields** — especially `supported_qualities` and `tradeoffs` using valid quality IDs (check `_qualities/` for permalinks).
3. **Link to requirements:** Find at least one example in `_requirements/` and add a `## Related Requirements` section.
4. **Add a diagram:** Prefer Mermaid `stateDiagram-v2` for state machines, `graph TD` for flows, `sequenceDiagram` for interactions.
5. **Validate references:** Run `npm run test:links` before committing.

---

## Phase 4: Long-term Evolution

1. **[ ] External Standard Mapping:** Link approaches to ISO/IEC 25010/25012 categories where applicable (add `standards` frontmatter field, same pattern as qualities).
2. **[ ] "Suggest an Approach" CTA:** Add a GitHub issue link on the main `/approaches/` page to invite community contributions.
3. **[ ] Case Studies / ADR Links:** Link approaches to real-world architectural decision records (ADRs) or case study blog posts where available.
4. **[ ] Graph Integration:** Explore adding approach nodes to the D3.js graph (as a new node type, distinct color) to make the quality→approach relationship navigable visually.
