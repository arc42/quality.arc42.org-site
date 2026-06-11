# `#maintainable` — Tactics & Strategies Proposal

**Date:** 2026-06-10
**Scope:** New approach candidates for the `#maintainable` dimension (analyse, modify, test, evolve with predictable effort).
**Cross-referenced against:** the 19 maintainable candidates already queued in `approaches-planning-and-status.md`, the Harrer review (`tactics-candidates-from markus-harrer-book-260520.md`), the Bass catalog (`bass-tactics.md`), and the 34 published `_approaches/`.
**Research basis:** four parallel deep-research passes (2026-06): legacy modernization & refactoring-at-scale · architecture governance & maintainability measurement · socio-technical strategies · code-base hygiene & large-scale automation. Canonical sources verified per item.

---

## How to read this

The queued maintainable backlog is **structure-heavy** (Bass: cohesion, coupling, defer binding, testability mechanics) — it answers *"what shape should the system have?"*. The biggest gaps for an experienced audience are the **other three quarters of maintainability**:

1. **Analyse** — find out *where* maintainability is actually decaying (evidence, not opinion).
2. **Change safely at scale** — execute large structural changes without big-bang risk.
3. **Keep it clean over years** — lifecycle disciplines that stop decay from re-accumulating.
4. **Socio-technical** — the team/ownership structures that make or break all of the above.

Everything below was filtered against a hard bar: named, teachable technique · real mechanism · real tradeoffs · canonical citation · **no no-brainers** ("write clean code", "do reviews", "use CI" — all rejected).

**Legend — Theme column:**
🔍 analyse/measure · 🔧 change execution · 🧹 hygiene/lifecycle · 🧪 verification · 👥 socio-technical · 🏛 governance/decisions

**Legend — Done column** (matches the other planning docs):
`✅` published · `📋` queued elsewhere · ` ` new

---

## Tier 1 — Write these first

The strongest combination of "under-used", "high leverage", and "fits our depth format". Roughly ordered: the analysis tactics first (they tell you where to aim every other tactic), then the safe-change toolkit, then the anti-decay disciplines.

| # | Done | Approach | Theme | One-line mechanism | Why it earns a page | Source |
|---|:----:|----------|:-----:|--------------------|---------------------|--------|
| 1 | | **Hotspot Analysis (Churn × Complexity)** | 🔍 | Mine version-control history and overlay change frequency on complexity to find the 2–5% of code where most development activity (and debt interest) concentrates | Inverts the "fix all smells" failure mode: most complexity sits in code nobody touches. Answers the question every other tactic presumes — *refactor what?* Evidence-backed ("Code Red": low-health hotspot code → up to 15× more defects) | Tornhill, *Your Code as a Crime Scene* 2nd ed. (2024); CodeScene / code-maat |
| 2 | | **Change Coupling Analysis** | 🔍 | Mine commits/tickets for files that repeatedly change together despite having no static dependency — exposing hidden coupling, copy-paste twins, broken module boundaries | Detects coupling **invisible to every static-analysis tool** (cross-language, code↔config, cross-repo); directly validates whether a "modular" decomposition actually decouples change | Tornhill; Gall et al., ICSM 1998 |
| 3 | | **Characterization / Approval Testing** | 🧪 | Pin down a legacy system's *actual* behavior by capturing outputs as approved reference files and diffing every run — assertions about what *is*, not what *should be* | The entry ticket to safe legacy change: cheap, broad regression armor over untested code before refactoring. Skill lies in input selection and approval-churn management | Feathers, *WELC* (2004); Bache; ApprovalTests (Falco) |
| 4 | | **Seams & Dependency-Breaking Techniques** | 🔧 | A seam is a place where behavior can be altered without editing that place; Feathers' catalog (Sprout/Wrap/Extract Interface…) manufactures seams to get untestable code under test | The conceptual model the whole legacy toolkit builds on — explains *why* "just mock it" fails without an enabling point. Deliberately tolerates temporary design degradation: a real tradeoff worth teaching | Feathers, *WELC*; Fowler, "LegacySeam" |
| 5 | | **Branch by Abstraction** | 🔧 | Put an abstraction over the subsystem to replace, migrate consumers to it, build the new implementation behind it, flip, delete — all on trunk, shippable at every commit | The standard alternative to long-lived branches for multi-week structural change; the discipline is staying green mid-surgery. Foundational enabler for most other large-scale-change tactics | Hammant (2007); Fowler bliki |
| 6 | | **Parallel Change (Expand–Migrate–Contract)** | 🔧 | Make breaking interface/schema changes in three individually backward-compatible phases: add the new form, migrate consumers incrementally, remove the old form | Turns "big-bang breaking change" into a deploy sequence; workhorse for zero-downtime DB migrations and published-API evolution. Hard parts: dual-write consistency, and actually *finishing* the contract phase | Sato, martinfowler.com (2014) |
| 7 | | **Mikado Method** | 🔧 | Attempt the change naively, record what breaks as prerequisite nodes in a goal graph, **revert**, recurse on the leaves until the original goal becomes trivial | The counterintuitive core (systematically reverting working analysis) keeps trunk green during architectural surgery and makes restructuring effort visible, estimable, pausable, and parallelizable | Ellnestam & Brolund, *The Mikado Method* (Manning 2014) |
| 8 | | **Parallel Run / Scientist Pattern** | 🧪 | Run old (control) and new (candidate) implementations side by side on production traffic, return the control's result, diff outputs and latency before cutover | Verifies behavioral equivalence under real data distributions no test suite reproduces — far stronger evidence than tests for critical-path rewrites. The verification mechanism Strangler Fig is missing | GitHub Scientist; Newman, *Monolith to Microservices* (2019) |
| 9 | | **Event Interception** | 🔧 | Tap updates flowing into/through the legacy system at an existing integration point (messaging, CDC) and route copies — or the flow itself — to the new system | The most mechanism-rich Legacy Displacement pattern: replacement progress decouples from the legacy codebase's changeability. Hard parts: ordering, idempotency, cut-over of write authority. Natural sibling of our Strangler Fig page | Cartwright/Horn/Lewis, martinfowler.com (Thoughtworks) |
| 10 | | **Large-Scale Automated Changes (Codemods)** | 🧹 | Express a refactoring as a program over semantic syntax trees (OpenRewrite recipe, codemod) and apply it across thousands of files/repos as reviewable, re-runnable changesets | Changes the **economics** of change: migrations become deterministic artifacts instead of multi-quarter manual campaigns. Include the 2024–26 hybrid state of the art: AST targeting + LLM edits + toolchain verification (Google: ~50% migration-time reduction) | *SWE at Google* ch. 22; OpenRewrite; Fowler, "Codemods" article; arXiv:2504.09691 |
| 11 | | **Planned Deprecation** | 🧹 | Treat removal as a first-class process: published policy, machine-readable signals (`Deprecation`/`Sunset` headers, RFC 9745/8594), the deprecating team migrates its consumers, automated dead-code deletion (Meta SCARF) enforces end dates | Systems rot by accretion; almost nobody designs the *removal* path. Incentive design is the teachable core ("experts make the update", ratchets over nag-mails). RFC 9745 (2025) makes this genuinely current | *SWE at Google* ch. 15; RFC 9745; Meta SCARF (100M+ LOC deleted) |
| 12 | | **Feature-Flag Lifecycle Management** | 🧹 | Give every flag an owner, expiry date, staleness detection, and automated removal PRs (Uber Piranha) so toggles don't fossilize into permanent conditional complexity | The decay-management discipline our published Feature Toggles page stops short of. Named tool, named papers (ICSE-SEIP 2020, PLDI 2024), ~2,000 flags auto-removed at Uber — and under-practiced everywhere | Rama et al. (Uber Piranha); Hodgson, martinfowler.com |
| 13 | | **Randomizing Unspecified Behavior** | 🧹 | Make unspecified behavior impossible to depend on by actively randomizing it — map-iteration order (Go), GREASE in TLS (RFC 8701) — so the implicit API surface stays equal to the documented one | Hyrum's Law countermeasure as API-contract engineering: spend a little continuous consumer pain to buy permanent freedom to change internals. Deliciously counterintuitive, almost never practiced outside language/protocol teams, applicable to any platform/library team | Hyrum Wright; *SWE at Google* ch. 1; RFC 8701 |

---

## Tier 2 — Strong, write after Tier 1

Clear the bar with room to spare; either slightly narrower, more org-shaped, or dependent on a Tier-1 page existing first.

| # | Done | Approach | Theme | One-line mechanism | Why it earns a page | Source |
|---|:----:|----------|:-----:|--------------------|---------------------|--------|
| 14 | | **Technical Debt Registry** | 🏛 | Track debt as first-class work items (affected artifacts, consequence/interest, remediation cost) on the *same backlog* as features, with explicit pay/convert/accept decisions per item | Turns "we have debt" hand-waving into a managed portfolio with principal/interest economics; the SEI book supplies the item template. Honest failure mode: registries rot without an owner and triage cadence. Fold in Fowler's debt quadrant as classification vocabulary | Kruchten/Nord/Ozkaya, *Managing Technical Debt* (SEI 2019) |
| 15 | | **Continuous Dependency Updating** | 🧹 | Treat updates as a continuous automated flow — bot PRs, auto-merge lanes for low-risk ranges, freshness measured in libyears — instead of episodic big-bang upgrades | The *policy* is the technique, not the bot: grouping rules, merge-queue strategy, vulnerability lanes, a measurable drift target. Counterintuitive economics: more frequent updates → lower total cost and risk | Renovate; libyear (Cox et al., ICSE 2015); *SWE at Google* ch. 21 |
| 16 | | **Team-First Boundary Design (Inverse Conway Maneuver)** | 👥 | Structure teams and their communication paths to match the *target* architecture, and size modules by team cognitive load — splitting along fracture planes (usually bounded contexts) | Conway's Law is known; the actionable inversion is not. Gives architects a defensible criterion for "how big should a service be" and treats required high-bandwidth inter-team communication as an architecture smell. One page covering both the maneuver and cognitive-load sizing | Skelton & Pais, *Team Topologies* (2019) |
| 17 | | **Code Ownership Models** | 👥 | Deliberately choose strong/weak/collective ownership per component and enforce it mechanically (CODEOWNERS review gates), monitoring ownership metrics | One of the few org practices with hard quantitative evidence: minor-contributor count and low top-owner share strongly predict failures (Microsoft Research, ESEC/FSE 2011). Honest tension with #18 — concentrate for quality vs. spread for resilience — is exactly what experienced readers want | Bird et al., "Don't Touch My Code!"; Fowler taxonomy |
| 18 | | **Knowledge Maps & Truck-Factor Management** | 👥 | Compute per-module knowledge ownership from git authorship, simulate developer departure, and target hotspots with deliberate rotation/pairing before people leave | Turns the fuzzy "what if X leaves" worry into a computed, trackable metric. Evidence: 46% of 133 popular GitHub systems had truck factor 1. Remediation arm: targeted ensemble sessions on truck-factor hotspots | Avelino et al. (ICPC 2016); Tornhill, *Software Design X-Rays* |
| 19 | | **Architecture Decision Records (with decision lifecycle)** | 🏛 | Record each architecturally significant decision as a small immutable document with an explicit status lifecycle (proposed → accepted → superseded-by), in-repo next to the code | Bare "write ADRs" is near-no-brainer in 2026; what clears the bar is the **lifecycle discipline**: superseding chains instead of edits, the significance filter, and the honest limit that a 2021 ADR read at face value in 2025 misleads. Frame around lifecycle + limits, not the template | Nygard (2011); MADR 4.0 (2024) |
| 20 | | **Architecture Advice Process** | 🏛 | Anyone may take an architectural decision, but must first seek advice from everyone meaningfully affected and from relevant experts; advice is considered, not obeyed; the decision is recorded (ADR) | Removes the architect-as-bottleneck that makes large systems slow to modify, while avoiding both ivory tower and consensus paralysis. Recent canonical book (2024), rising fast in 2025/26 discourse | Harmel-Law, *Facilitating Software Architecture* (O'Reilly 2024) |
| 21 | | **Risk Storming** | 🏛 | Recurring time-boxed workshop: participants *independently* rate architecture risk per quality dimension on an impact×likelihood matrix over a shared diagram, then converge on a ranked mitigation list | The lightweight, repeatable successor to multi-day ATAM; independent-scoring-then-discuss surfaces disagreement consensus meetings suppress. Output feeds the debt registry (#14) | Richards & Ford, *Fundamentals of Software Architecture* 2nd ed. (2025) ch. 22; Simon Brown, riskstorming.com |
| 22 | | **Dependency Structure Matrix (DSM) Analysis** | 🔍 | Represent inter-module dependencies as an N×N matrix; reorder/partition to expose latent layering, cycles (above-diagonal entries), and enforceable structural rules | Scales where dependency graphs become hairballs; partitioning reveals layering nobody documented. 20 years of industrial use (Lattix, NDepend), still genuinely under-used. Reading DSMs is a learned skill — that's the page | Sangal et al., OOPSLA 2005; MacCormack et al. 2006 |
| 23 | | **Modularity Maturity Index (MMI)** | 🔍 | Score a system 0–10 on weighted criteria — modularity (45%), pattern consistency (25%), hierarchy/cycle-freedom (30%) — to decide per system: keep, refactor, or replace | Portfolio-level comparability, validated on 300+ systems; explicit thresholds (>8 keep, 4–8 refactor, <4 replace candidate) make it a management communication device. Strong European/practitioner pedigree fits arc42's audience | Lilienthal, *Sustainable Software Architecture*; *Software Architecture Metrics* (O'Reilly 2022) ch. 4 |
| 24 | | **Transitional Architecture (+ Legacy Mimic)** | 🔧 | Deliberately build scaffolding — adapters, mimics, interception points — that exists only to enable incremental displacement and is *planned for demolition*; mimics keep byte-compatible output flowing to untouched consumers | Legitimizes real engineering spend on throwaway components and forces an explicit decommissioning plan — countering both "big bang because scaffolding is waste" and "temporary glue becomes permanent". Must state the Mimic↔ACL distinction (ACL protects the new model; Mimic deliberately reproduces legacy behavior outward) | Cartwright/Horn/Lewis, Legacy Displacement catalog |
| 25 | | **Flaky-Test Quarantine & Scoring** | 🧪 | Detect nondeterministic tests statistically (probabilistic flakiness scores), auto-quarantine out of the merge-blocking suite with owner + fix-or-delete deadline, track suite flakiness as a budget | The naive responses (retry everything / ignore / delete) all destroy signal; the designed workflow — scoring, quarantine, re-admission criteria — is the technique. Spotify: 33% reduction from visibility alone | Google Testing Blog (Micco); Atlassian (2024); Luo et al., FSE 2014 |

---

## Tier 3 — Opportunistic / situational

Real and citable, but narrower in audience, weaker in tooling, or org-scale-dependent. Pick up when a related page needs a companion.

| # | Done | Approach | Theme | One-line mechanism | Note | Source |
|---|:----:|----------|:-----:|--------------------|------|--------|
| 26 | | Divert the Flow + Critical Aggregator | 🔧 | Rebuild the cross-system reporting/decision component *first*, divert its flow, and legacy loses its "center of the universe" gravity | Counterintuitive sequencing insight; narrower (enterprise-estate) audience. One combined page | Legacy Displacement catalog |
| 27 | | Sacrificial Architecture | 🏛 | Decide at *build* time that the system will be replaced once it has done its discovery job, and engineer replaceability (small severable components) up front | Strategic stance more than hands-on tactic; cite Bellotti (*Kill It with Fire*) here | Fowler bliki (2014) |
| 28 | | Preparatory Refactoring | 🔧 | "Make the change easy, then make the easy change" — attach structural work to feature delivery, no permission needed | Borderline against the no-brainer bar; earns a page only as a *scheduling/economics* workflow, not "refactor more" | Fowler, *Refactoring* 2nd ed.; Beck |
| 29 | | Read by Refactoring (Provable Refactorings) | 🔧 | Understand legacy code by performing only IDE-automated, provably behavior-preserving micro-refactorings while reading, with risk-graded commit notation | Exactly the off-beat/high-leverage profile; weakest canonical citation of the list (blog corpus, no book) | Belshee, "Core 6 Refactorings" |
| 30 | | Connascence-Based Coupling Assessment | 🔍 | Classify every coupling by kind (name…timing, identity), strength, locality, degree; convert stronger to weaker, tolerate strong only at close locality | High pedagogical leverage, near-zero automated tooling; the precision vocabulary "loose coupling good" lacks | Page-Jones; *Building Evolutionary Architectures* 2nd ed.; connascence.io |
| 31 | | Decoupling Level & Propagation Cost | 🔍 | Compute from a design-rule DSM how far changes ripple and how well the system splits into independently evolvable modules, benchmarked against 100+ industrial systems | Rare architecture metrics with published predictive validity for maintenance effort — but DV8 tooling is research-niche | Mo/Cai/Kazman et al., ICSE 2016 |
| 32 | | One-Version Rule | 🧹 | Exactly one version of every dependency in one repo; all consumers build at head, so cross-cutting changes are atomic and diamond dependencies disappear | High-leverage, high-commitment, near-irreversible; monorepo-scale shops only. Good "know the option" entry | *SWE at Google* ch. 16/21; Potvin & Levenberg, CACM 2016 |
| 33 | | Golden Paths / Paved Road | 🧹 | Publish opinionated, fully supported end-to-end stacks (template+CI+deploy+observability) so teams on the path get upgrades for free | Incentive-based standardization without mandates. **Flag:** straddles `#maintainable`/`#operable`; platform strategy more than architecture tactic | Spotify Engineering (2020); Backstage |
| 34 | | InnerSource (Trusted Committer + 30-Day Warranty) | 👥 | Open-source mechanics inside the org: contribution guides, Trusted Committers mentor/review, warranty pattern transfers bug liability to contributors | Worked-out pattern language, not "share your repos"; dissolves cross-team change-blockers. **Flag:** org-level, process-leaning | InnerSource Commons patterns |
| 35 | | Predictive Test Selection | 🧪 | Run only the tests a change can plausibly affect — build-graph reachability or ML on change-vs-failure history — backstopped by periodic full runs | The deliberate recall-for-cycle-time trade (Meta: ~2× infra cost cut, >99.9% faulty-change detection) is a real architectural decision; only relevant once suites exceed ~30–60 min | Machalica et al., ICSE-SEIP 2019; Hammant |
| 36 | | Hermetic / Reproducible Builds | 🧹 | Build outputs as a pure function of declared inputs — bit-for-bit rebuildable, enabling safe caching, trustworthy bisection, supply-chain verification | Mature (Debian ~99.5%); **flag:** strongest selling point is `#secure` (supply chain), tag both | reproducible-builds.org; Lamb & Zacchiroli, IEEE Software 2022 |
| 37 | | You Build It, You Run It | 👥 | The building team operates and maintains the service for its whole life — no handoff — so maintainability costs land on the people who can design them away | Incentive internalization + the product-vs-project funding contrast. **Flag:** operating-model, leans `#operable` | Vogels, ACM Queue 2006 |
| 38 | | Readability Process | 👥 | Per-language certification: every change needs approval from a certified reviewer, making review an org-wide consistency and mentoring mechanism | Named mechanism with real tradeoffs (latency, gatekeeping) — but pays off only at large-org scale | *SWE at Google* ch. 3/9 |

---

## Explicitly *not* recommending (and why)

| Candidate | Verdict |
|-----------|---------|
| **Trunk-Based Development** | Mainstream orthodoxy by 2026; the genuinely non-trivial parts are already covered by Branch by Abstraction (#5), Flag Lifecycle (#12), and Codemods (#10). At most a hub page later. |
| **Fixit weeks / cleanup cadences** | Mechanism too thin (calendar + theme); one sentence inside Planned Deprecation (#11), not a page. |
| **Beyoncé Rule** | A sharp policy aphorism, not a practice — mention inside One-Version Rule / CI pages. |
| **Dark Launching, Keystone Interface** | Variants: fold into Parallel Run (#8) and Branch by Abstraction (#5) respectively (Fowler concurs). |
| **Cognitive Complexity (Sonar)** | A metric choice *inside* the queued "Limit Structural Complexity" page — add there, with the honest note that empirical validation is mixed and the classic Maintainability Index is discredited. |
| **Code Health / delta-based gates** | Strong idea (ratchet: "never worse", scoped to hotspots) but it's the modern *angle* for the queued "Static Analysis + Quality Gates" page, not a separate approach. Cite "Code Red" (TechDebt 2022) there. |
| **Spring Modulith / dependency-cruiser / Nx boundaries** | Tooling realizations of the queued "Architecture Conformance Analysis" — fold in there. |
| **Architectural Smell Detection (Arcan etc.)** | Sibling of Architecture Conformance Analysis; distinct only via "no intended architecture required". Mention as a variant there. |
| **Code-age analysis** | Too thin alone; sibling technique inside Hotspot Analysis (#1). |
| **Team API, Communities of Practice, guilds** | Too generic-management for an architecture-tactics catalog. |
| **Ensemble/mob programming** | Weak evidence base as standalone; appears only as the remediation arm inside Truck-Factor Management (#18). |
| **DORA/Accelerate findings** | Evidence, not an approach — citation ammunition for other pages (CD → ~21% less rework). |
| **RFC/Design-Doc process (Oxide RFD, Google design docs)** | Real, but overlaps ADR + Advice Process; treat as the "process" half of the ADR page (#19) with cross-links, to avoid three near-identical decision pages. |

---

## Interactions with the existing backlog

- **Strategic Code Deletion** (Harrer Tier 1) ⊂ **Planned Deprecation** (#11) — merge or make Deletion the code-level page and Deprecation the API/system-level page. Decide before writing either.
- **Limit Nondeterminism** (queued, testability) is the *inverse twin* of **Randomizing Unspecified Behavior** (#13) — one removes nondeterminism for repeatable tests, the other adds it to keep contracts honest. Cross-link explicitly to preempt confusion; do not merge.
- **Feature Toggles** (published) ← **Flag Lifecycle Management** (#12) must cross-link, not duplicate; the published page's tradeoffs section already names the versioning/debt cost.
- **Strangler Fig** (queued) gains two siblings: **Event Interception** (#9, how stranglers get fed) and **Parallel Run** (#8, how cutover gets verified). Consider writing the three as a cluster.
- **Anti-Corruption Layer** (Harrer Tier 1) vs. **Legacy Mimic** (#24): ACL protects the new model from legacy concepts; Mimic deliberately reproduces legacy behavior outward. State this on both pages.
- **Hotspot Analysis** (#1) + **Change Coupling** (#2) are the prioritization front-end for nearly every queued structural tactic (Increase Cohesion, Restrict Dependencies, Split Modules…) — good "related" targets.
- **Fitness Functions** (Harrer Tier 1, queued) is the enforcement backend for #13, #19, #22 and the conformance family.

---

## Suggested sequencing

1. **Open the analysis front** (nothing on the site tells readers *where* to invest yet): Hotspot Analysis (#1), Change Coupling (#2) — pairs with the queued Fitness Functions / Architecture Conformance work.
2. **The safe-change toolkit** as a coherent cluster: Characterization Testing (#3) → Seams (#4) → Branch by Abstraction (#5) → Parallel Change (#6) → Mikado (#7) → Parallel Run (#8). These cross-link densely; writing them together pays off.
3. **The anti-decay disciplines** (most distinctive for the site, least covered elsewhere): Planned Deprecation (#11), Flag Lifecycle (#12), Codemods (#10), Randomizing Unspecified Behavior (#13).
4. **Governance & socio-technical** in a second wave: Debt Registry (#14), Team-First Boundary Design (#16), Ownership Models (#17) + Truck Factor (#18) as a tension pair, ADR (#19) + Advice Process (#20) as a decision pair.

---

## Open questions

- Several Tier-2/3 items (#16–#21, #34, #37) are **strategies/processes**, not software tactics. Do they belong in `_approaches/` with a marker (e.g. a `kind: practice` frontmatter field), or does the site want a separate content type for socio-technical approaches?
- The truck-factor and knowledge-map tactics involve per-developer git analytics — worth a privacy/works-council caveat box on those pages for the German-speaking audience?
- `aka:` candidates worth pre-deciding: Approval Testing ↔ Golden Master ↔ Characterization Testing (#3); Parallel Run ↔ Scientist ↔ Shadow Testing (#8); Codemods ↔ Large-Scale Changes (#10); Paved Road ↔ Golden Path (#33).
