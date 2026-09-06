# Requirements coverage — working plan

Working plan for closing requirement-example coverage gaps, distilled from the September 2026 proposals and updated as work lands. The proposal documents have been removed — every row below is self-contained; there is no draft text to inherit.

Authoring rules live in the `write-requirement` skill, not here.

**Live gap count: 21.** Recompute it; never trust this number. It is a consequence, not a target.

## Done

- **P1 — 13 relation rows.** All applied. Gap count 36 → 22.
- **P2 #19 upgradeability** — closed by `fleet-ota-updates-with-safe-rollback`, against this review's preference for a major-version example. That example is still worth writing.
- **P2 #14 suitability / functional-suitability** — resolved **against** this review. They are not duplicates: ISO/IEC 25019 §3.2.1.3 scopes suitability to *behaviours and outcomes* satisfying specified quality requirements; ISO 25010 scopes functional suitability to *functions*. The `suitability` page carried the right `standards:` entry and the wrong quotation, which is what made them look identical. Both pages kept and differentiated; `functional-suitability` closed via `user-tries-primary-function`. **Do not re-propose the alias**, and answer #174's "consolidate suitability pages" with *no*.

## P2 — open editorial decisions (4 gaps)

| Quality | Decision |
| :--- | :--- |
| user-engagement | Link `attractive-quality-knowledge-base`. ISO 25010:2023 says user engagement replaced user-interface aesthetics and the page quotes that note, but its hedonic scores measure pleasure, not continued interaction — keep the continuation facet as a brief. #174 |
| legal-requirements | Link `personal-data-lifecycle-protection`; its context names GDPR and CCPA. Its 24-hour erasure target invents a tightening of GDPR's one month — mark that as an assumption when linking. Better than a generic "comply with all laws" example. |
| operational-environment-requirements | Either link `interoperable-with-java-12` (backward compatibility) and `on-prem-installation-ready-in-30-min` (productization), or convert the page into a Volere category page and link nothing. |
| features | Alias to `functional-completeness` or delete: no citable definition, and its unsourced "more features means higher quality" contradicts functional appropriateness. No requirement either way. #544 |

## P3 — new drafts, in writing order (10 gaps)

| # | Quality | What the example must do — and the trap to avoid |
| ---: | :--- | :--- |
| 1 | consent-management | Withdrawing consent stops optional processing. Cover **record**, not only enforce — the page defines obtain, record, update, enforce — so the withdrawal is logged with timestamp and purpose and is retrievable on request. One clock: the acknowledgement is sent only after enforcement, and arrives within 2 s. Fail closed: an unreadable consent state does not authorize optional processing. |
| 2 | data-minimization | Registration stores only necessary fields. Test both halves: injected extra fields are neither persisted nor forwarded, **and** the released form and API schema contain no personal field outside the approved list (evidence: schema diff at release). Retention sits outside the boundary — say so in the assumption line. |
| 3 | model-transparency | Reviewers can identify the model actually running. Unknowns carry an owner and a disposition; missing information without a disposition blocks release. Split identity/version/provenance from evaluation/limitations/usage rights — one obligation per criterion, not an eleven-item sentence. |
| 4 | co-existence | A batch workload does not disrupt interactive work. The batch must be a **separate product** — a third-party BI tool on the same cluster, say. Two modules of one product is internal resource contention, not co-existence. Paired timed runs on the same trace, errors counted as failures, and a completion bound for the batch. |
| 5 | functional-adaptability | A model learns from corrected labels. Use an **absolute floor** on the newly introduced category (F1 >= 0.70 on a fixed 300-ticket set, 100 positives). A relative "+0.05 over the incumbent" is satisfied by an F1 of 0.05, because a newly introduced category starts near zero. Keep a 0.02 regression cap on established categories and the disjointness rule; put the start event (corrected set available) in the criterion, not only in the trigger. |
| 6 | safe-integration | Integration preserves a safety invariant. Write it for the **robot, not a simulator** — the suite may of course run in simulation. Name the integration faults that matter: mismatched units, reversed axes, stale observations, disconnected input. Block the "never move" degenerate pass explicitly. |
| 7 | energy-proportionality | Power draw tracks utilization: idle / 25% / 50% / 100% against a declared envelope, metering boundary stated. Not total consumption — `reduce-energy-consumption` and `carbon-efficiency-save-20-percent` already measure totals, which is a different claim. |
| 8 | self-containedness | The system completes its primary use case while adjacent systems are unavailable: a 30-minute outage, named local workflows complete, deferred exchanges reconciled afterwards. |
| 9 | intervenability | An operator can intervene in an **AI system's** action — ISO 25059 scopes the characteristic that way. A stop button on a conveyor is fail-safe, not intervenability. The operator sees the planned action and its confidence, can stop it, and the stop reaches the defined safe state within a stated time; record warning-to-activation and command-to-stop separately. Limits come from the product's hazard analysis. |
| 10 | suitability | Outcome-based, per ISO/IEC 25019 §3.2.1.3: a specified quality requirement is satisfied in use, independent of which functions the product offers. |

Worth writing after P3, though they close no gap: an AI-oversight example for controllability (a person pauses automated refunds), a retrieved-content facet for injection-resistance (retrieved instructions cannot authorize tool actions), a vehicle speed-envelope example for operational-constraint, and a major-version example for upgradeability.

## P4 — briefs, need inputs (7 gaps)

| Quality | Blocker |
| :--- | :--- |
| communicability | Rubric and population. Moderated task with an "identify reason and next action" rubric is right; `expressive-error-messages` is not close enough to link. |
| credibility | Study design. Keep the "warranted trust with comprehension checks" guard against rewarding persuasive misinformation. |
| distributability | Topology and network conditions. Unchanged functional suite across single-node and three-node topologies, bounded configuration effort. |
| immunity | Approved harmless fixtures, isolated harness, "permitted documents still open" guard. |
| versatility | Three materially different named tasks with the same released feature set. |
| conciseness | Reframe: an incident handover written by a person is not a system property. Make the artifact system-generated. Word budget plus "all four facts recoverable" is the right pair once the producer is the system. |
| longevity | Definition decision (#542). The page defines capacity growth (Volere) while `durability` carries the unsourced lifespan meaning. |

## Open issues

#147 every quality should have a requirement · #174 consolidate aesthetics pages (suitability half now answered: no) · #541 wcag-refresh port · #542 durability/longevity crossed definitions · #543 intervenability and effectiveness tags — content already corrected in the tree, issue still open · #544 page defects · #545 qualities citing ISO 25019 without being in its model
