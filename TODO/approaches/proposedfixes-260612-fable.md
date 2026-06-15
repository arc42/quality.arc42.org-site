# Proposed Fixes — Approaches Audit

Derived from `TODO/audits/approach-audit-2026-06-11.md` (full-corpus audit, 44 agents). Proposed by Claude (Fable 5), 2026-06-12.
Prioritized P1 (do first) → P6 (decide once, then mechanical). Mark items ✅ when done. Wording-level MINORs (~167) live in the audit report and are not repeated here.

## P1 — Structural blocker

- [x] ✅ 2026-06-12, `_approaches/S/saga-pattern.md` (flattened, trimmed 939→354 words, six audit MINORs folded in) **saga-pattern**: flatten `### Coordination Styles` and `### Reliability Guarantees` into the `## How It Works` flow (e.g. bold lead-ins: `**Orchestration:** … / **Choreography:** …`). The schema forbids `###`; nested headings break the document outline for screen readers. Fold the word-count trim (939 → ≤350-ish) into the same edit — it's the second-longest page.

## P2 — Factual errors (citable-wrong; highest brand risk: *precise, trustworthy*)

- [x] ✅ **strong-authentication**: GDPR does **not** mandate MFA — Art. 32 requires "appropriate technical and organisational measures" and never names it; NIST SP 800-63 is guidance, not regulation. Keep PCI DSS as the genuine mandate. Also soften "making phishing structurally impossible" / "cannot succeed" (intent): origin binding defeats credential-harvesting, but enrolled fallback factors and AitM session-token theft remain — the page's own Failure Modes say so.
- [x] ✅ **secret-management**: "fulfill mandatory technical controls for PCI DSS, SOC 2, and ISO 27001" — SOC 2 is criteria-based (no mandatory technical controls); ISO 27001 Annex A controls are risk-selected via the SoA. Rephrase as "supports controls commonly required by…".
- [x] ✅ **api-gateway**: RFC 6749 described as "token-based authentication" — OAuth 2.0 is an authorization/delegation framework; OAuth-as-authentication is a known anti-pattern. Say the gateway validates OAuth access tokens, and name OIDC where authentication is meant.
- [x] ✅ **responsive-design** (two slips): the "Orientation Stress Test" says rotate **180°** — that keeps the same orientation; the test needs 90°. And 44×44px is cited as the WCAG baseline — SC 2.5.5 is Level **AAA**; under WCAG 2.2 (the site's own target) the AA criterion is SC 2.5.8 at 24×24px. Cite 2.5.8/24px as the requirement, keep 44px as good practice.
- [x] ✅ **caching** (two slips): "Thunderous Herd" → **Thundering Herd** (the established term; a wrong term breaks readers' literature searches). And "distributed cache … keeps consistency across the cluster" contradicts the page's own `consistency` trade-off — most distributed caches are configurably/eventually consistent.
- [x] ✅ **fine-grained-authorization**: ReBAC was not "pioneered by Google Zanzibar" — the concept predates it by a decade (Gates 2007, Fong 2011). Say Zanzibar *implemented/popularized it at global scale*.
- [x] ✅ **input-sanitization-output-encoding**: injection has not "topped the OWASP Top 10 for over two decades" — #1 only in 2010/2013/2017, A03 in 2021, lower since. State it as a perennial top-category instead.
- [x] ✅ **cqrs**: "a read model can be rebuilt by replaying the event or change stream" is only universal with event sourcing or a fully retained log; CDC from a mutable store rebuilds from snapshot + reprojection. Condition the claim — the page itself lists Event Sourcing as a separate variant.
- [x] ✅ **content-delivery-network**: "the origin stays reachable during … regional outages" — during an origin outage the origin is by definition unreachable; the CDN preserves *user-facing service*, and only if serve-stale (stale-if-error, RFC 5861) is configured and content is cached. Rephrase conditionally.
- [x] ✅ 2026-06-12 (Claude, note scoped to AEAD vs XTS/TDE) **encryption-at-rest-and-in-transit**: the `data-integrity` note presents tamper detection as inherent, but the page's own mechanisms include FDE/TDE which typically use unauthenticated modes (AES-XTS) with no integrity protection. Scope the claim to AEAD modes.
- [x] ✅ 2026-06-12 (Claude, softened + Knight & Leveson cited in new References section) **n-version-redundancy**: "keeps faults from correlating" stated as guarantee — Knight & Leveson (1986) showed independently developed versions still fail coincidentally. Change to "reduces correlation"; ideally cite the experiment.

## P3 — Internal contradictions (frontmatter asserts what the body conditions)

- [x] ✅ 2026-06-12 (Claude — note, overview, and verification bullet now all say "declared safe state", not "blocked") **safety-interlocks**: fail-safe note + overview say "the default is always the safe path = blocked", while paragraph 3 correctly explains the safe direction depends on hazard analysis (fire exits fail **open**). Make "safe state ≠ always blocked" consistent throughout.
- [x] ✅ 2026-06-12 (Claude — expiry scoped to release/experiment/ops; permission toggles long-lived by design) **feature-toggles**: applicability demands all toggles expire, but the body's category table legitimizes long-lived Permission toggles. Scope the expiry rule to release/experiment/ops toggles.
- [x] ✅ 2026-06-12 (Claude — "Most service meshes build on it, though sidecar-less variants are emerging.") **sidecar**: "today it underpins every service mesh" — contradicted by the page's own Variants (ambient mode, eBPF node proxies). Soften to "most service meshes" or "historically underpinned".
- [x] ✅ 2026-06-12 (Claude — mapping REMOVED, fits the page's own "skip for anonymous public traffic" applicability; graph edge gone → Docker restart needed) **manage-event-arrival**: the `related_requirements` mapping to `handle-sudden-increase-in-traffic` contradicts both pages — the requirement demands ≥99% success *during* a 300% surge (absorb), while this tactic sheds/refuses excess. Remove the mapping or rewrite the note to say what the tactic actually contributes (protecting the core path while shedding).
- [x] ✅ 2026-06-12 (Claude — note now conditioned on a redundant gateway fleet and idempotent-route retries) **api-gateway**: availability note claims transparent failover universally, while the body's Single-Point-of-Failure mode says the opposite unless the gateway fleet is redundant; retries also only safe for idempotent routes. Condition the note.

## P4 — References policy violations (template forbids vendor/product docs)

- [x] ✅ 2026-06-12 (Claude — Vitess/MongoDB dropped, Kleppmann ch. 6 added, Spanner kept with full citation) **database-sharding**: 3 of 4 references are product docs (2× Vitess — one version-pinned —, 1× MongoDB Manual). Keep the Spanner paper; replace the rest with durable sources (e.g. Kleppmann, *Designing Data-Intensive Applications*, partitioning chapter — already site-citable style). Move Vitess/MongoDB to body as `e.g.` mentions if wanted.
- [x] ✅ 2026-06-12 (Claude — both dropped; body already illustrates K8s probes and OTP supervisors, so nothing lost) **watchdog-supervision**: drop kubernetes.io probe how-to ("the canonical reference" — it isn't, it's a product doc) and the Erlang/OTP Supervisor docs from `## References`; both belong in the body as `e.g.` illustrations only.
- [x] ✅ 2026-06-12 (Claude — relinked to the KDD paper's own DOI 10.1145/1281192.1281295) **ab-testing** (minor, same class): the KDD 2007 paper is linked via a personal Stanford homepage; relink via DOI (10.1007/s10618-008-0114-1) or the ACM DL.

## P5 — Graph & relationship curation (editorial judgment, one-sided `related:` per convention)

- [x] ✅ 2026-06-12 (Claude — removed from plugin-architecture; sidecar side kept) **Remove the duplicate declaration** `plugin-architecture ↔ sidecar` (declared on both sides; keep the sidecar side, notes are near-identical).
- [x] ✅ 2026-06-12 (Claude — all 8 first-tier links added, one-sided, slugs verified against the content tree; second tier still open, decide after a look at the regenerated graph) **Add the strongest missing `related:` links** (declare on the side named first; write notes symmetrically):
  - blue-green-deployment → canary-deployment — the two canonical safe-rollout variants, constantly compared.
  - cqrs → event-sourcing — canonical literature pairing, constantly conflated; currently unlinked.
  - event-driven-architecture → asynchronous-messaging — style layered directly on the mechanism.
  - caching → content-delivery-network — a CDN *is* edge caching.
  - circuit-breaker → bulkheads — complementary fault isolation, always discussed together.
  - ab-testing → canary-deployment — same traffic-splitting infrastructure, different intent.
  - rate-limiting → manage-event-arrival — overlapping territory; the note should *disambiguate* them.
  - least-privilege → fine-grained-authorization — principle and its enforcement mechanism.
  - (second tier, judgment: circuit-breaker→feature-degradation, data-replication→database-sharding, standby-failover→n-version-redundancy, watchdog-supervision→standby-failover, saga-pattern→event-driven-architecture)
- [ ] **`aka` decisions** (audit flagged as misleading index terms):
  - standby-failover: drop bare "Redundancy" (could equally mean N-version voting; Bass's *active redundancy* is closer to voting).
  - watchdog-supervision: "Monitor" is too generic — prefer "Watchdog Timer" or drop.
  - manage-event-arrival: "Service-Level Agreement" misleads (readers expect SLO/availability content) — drop or reword.
  - Decide the single owner of "Throttling" (currently rate-limiting; Bass readers would look for it on limit-event-response).
- [ ] **open-host-service → event-sourcing**: weakest edge in the graph (niche connection); keep or cut — judgment call.

## P6 — Systemic decisions (decide once, then mechanical)

- [ ] **Word-count policy** for the 23 pre-template pages (421–951 words vs. ≤350 target): grandfather explicitly, or trim opportunistically whenever a page is touched (P2/P3 edits above touch many of the worst offenders — combining is efficient).
- [ ] **Spelling**: unify `back-pressure` (4 pages) vs `backpressure` (1 page) — suggest unhyphenated.
- [ ] **Compliance-note copy-paste**: five security pages share near-identical "regulatory frameworks require X" notes — differentiate per mechanism while fixing the P2 compliance claims, or accept as house pattern.
- [ ] **Coverage gap** (backlog steering, not a page fix): `suitable` and `maintainable` have 1 tagged approach each vs. 18 for `reliable`. Maintainable-tier proposals were previously rejected as non-constructive — decide whether the gap is intentional or the backlog should target these dimensions with *constructive* patterns.
- [ ] **Diagrams**: 24 older pages have none (INFO only) — add opportunistically when pages are reworked.
