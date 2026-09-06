# Requirements proposals — Fable review of the Astra proposal, 5 September 2026

Reviewed: `TODO/requirements/proposed-reqs-260905-astra.md` against `main` at `6fa4c9da`.
Method: reproduced the gap list with a script over `_qualities/` and `_requirements/` (36 gaps, matching the analytics include), then read every one of the 36 quality definitions and the acceptance criteria of every existing requirement that could plausibly cover one of them. Every claim below that names a file was checked in the file. Nothing in this document edits live content.

## Verdict

The Astra proposal is sound in its method and mostly correct in its facts, but it under-uses the existing corpus and over-hedges its new drafts.

- **Correct:** the gap count, the file counts, all ten proposed slugs are free, the eight "existing coverage" verdicts are supported by acceptance criteria as the proposal requires, and `requirements-prompt-v3.md` exists.
- **Incomplete:** at least **six more** gaps already have criterion-level coverage in existing requirements that the proposal did not find (expected physical environment, DevOps metrics, injection resistance, operational constraint, simplicity, controllability in its usability meaning). Two of those were scheduled for new drafts or briefs.
- **Defects in drafts:** one draft has a broken baseline that makes its main criterion trivially passable (functional adaptability). Three drafts require a *simulator* as the system under requirement, which makes them weak as examples for architects. One brief measures a human-written document rather than a system property (conciseness).
- **Definition problems bigger than the proposal states:** durability/longevity have crossed definitions, intervenability and effectiveness are tagged against their own definitions. These block sensible linking and were filed as issues #542 and #543.

Revised plan: **19 gaps close with relations or alias decisions**, **9 need new drafts** (7 of the Astra drafts survive, 3 of them rewritten), **8 stay as briefs**. Table in the last section.

## Facts checked

| Claim in the proposal | Result |
| :--- | :--- |
| 36 gaps, same logic as `_includes/about/content-analytics.md` | Reproduced exactly (`alias_of` excluded; requirement `related:` slug equals last permalink segment). |
| 228 quality files, 150 requirement files | Correct. |
| Ten proposed slugs have no permalink collision | Correct, all free. |
| `requirements-prompt-v3.md` exists | Yes. |
| Eight cited requirements exist under the stated permalinks | Yes. Note two file names differ from permalinks (`configurable-gui-theme.md`, `only-authorized-users-can-access.md`); use the permalink slug in `related:`. |
| "SQL-injection examples already exist" | Yes: `public-api-intrusion-attempts-blocked` (criterion 2) and `avoid-common-vulnerabilities`. Neither is linked to `injection-resistance`; see below. |
| Existing personal-data lifecycle requirement does not test consent | Correct. `personal-data-lifecycle-protection` covers encryption, anonymization, erasure, audit, retention. No consent criterion. |
| No requirement `related:` names a non-existent quality | Correct (checked as a side effect). |
| All tags used by requirements have tag pages | Correct: nine tags, nine pages. |

## Review of "Review existing coverage first"

All eight verdicts hold. Corrections and sharper follow-ups:

| Quality | Astra verdict | Fable correction |
| :--- | :--- | :--- |
| Data residency | Link citizen-record localization | Agree. One nuance the proposal missed: both `data-residency` and `data-localization` pages define residency as a *choice* and localization as a *legal mandate*, and the requirement's context is a mandate. The link is still correct because the criteria test physical location, which is residency by the page's first definition. No text change needed. |
| Durability | Link replication and quorum (no acknowledged write lost) | Agree, and add `financial-transactions-are-acid-compliant` (criterion 3: "zero confirmed data loss" on primary-node kill mid-transaction). Do **not** touch the page's first, unsourced definition here; that is issue #542. |
| Upgradeability | Link fleet OTA | **Medium confidence, not high.** The `updateability` page explicitly says updateability is incremental patches and *upgradeability* is "major version transitions". Fleet OTA is a patch-and-fix example by its own context. Linking it to upgradeability contradicts the site's own distinction. Either accept the link with the reasoning that "activate new version, roll back to previous" applies to both, or keep the gap and write a major-version example (schema migration, no data loss, bounded downtime). Recommend the second; it is the more useful example. |
| Themability | Link configurable UI theme | Agree. The requirement was written for this concept and never linked. Highest-confidence relation in the list. |
| Personalization | Link restore filter after login | Agree. The requirement is weak (three restatements of one criterion, no numbers); link it anyway, do not present it as a model. The shared-workstation clarification is optional; the trigger already says the user logs in. |
| Securability | Link only-authenticated-users | Agree, but `access-control-is-enforced` is the *more direct* match: its criteria require "at least three" data classification levels with "stricter controls for highly sensitive data", which is literally "different levels of secure access". Link both. That requirement has 14 criteria including "99.99% uptime for the access control service"; inherited defect, do not copy. |
| Self-descriptiveness | Link new-user-completes-core-tasks | Agree (criteria: only in-application guidance, contextual error messages, help answers top-20 questions offline). The SUS 68 threshold the proposal doubts is correct as the published mean; the "7 sequential interactions" ceiling is the arbitrary one. |
| Effectiveness | Link new-user-completes-core-tasks (task success rate) | Agree. `user-tries-primary-function` (95% first-attempt completion) is a second candidate. Blocked by tagging: the page is tagged `efficient` only, which is the confusion its own body warns against (issue #543). Fix the tag first or the requirement appears under the wrong property. |

### Missed reuse (criterion-level support exists today)

These were not in the proposal. Each relation is supported by an acceptance criterion, per the proposal's own rule.

| Quality | Existing requirement | Supporting criterion |
| :--- | :--- | :--- |
| **Expected physical environment** | `usable-on-factory-floor` | Scope fixes ambient noise >= 80 dB(A), illuminance 100–500 lux, required gloves. That *is* the specified physical environment (Volere p. 56). Also `usable-with-gloves`. The proposal's "outdoor kiosk" brief becomes optional. |
| **DevOps metrics** | `low-change-failure-rate`, `mttr-12h`, `fast-deployment` | The page defines the quality as the four DORA metrics and links each. Change-failure rate (98% incident-free deployments) and MTTR (12 h) are two of the four; `fast-deployment` (deployment completes in < 2 h) bounds one component of lead time and is already related to `deployment-frequency` and `lead-time-for-changes`. Umbrella links are honest here because the page itself is an umbrella. |
| **Injection resistance** | `public-api-intrusion-attempts-blocked` | Criterion 2: >= 2,000 crafted SQL-injection, XSS and path-traversal requests, >= 99.5% blocked, <= 0.1% false positives. The page's definition covers classic injection explicitly. The Astra LLM draft then adds the retrieved-content facet rather than closing the gap. |
| **Operational constraint** | `provable-insulin-dosage-safety` | Criterion 2: "no combination of inputs within the defined physiological range can result in a Max Basal command exceeding the patient-specific safety limit". This is ISO 25010's own example 2 (radiation limited regardless of operator input). Strongest missed link. |
| **Simplicity** | `good-readability-score` | Cognitive complexity <= 15 per function, every PR. The page defines simple as "easy to read, understand, and correctly modify"; cognitive complexity was designed to score understandability. The proposal's brief rightly says a single score is a weak substitute; link now, keep the brief as a later, better example. |
| **Controllability** (usability meaning) | `interruptable-backend-process` | User aborts a distributed report generation; control returns within 10 s; all backend tasks acknowledge cancel. Matches the Stanford definition on the page ("allow appropriate control"). The Astra draft 4 still adds the AI-oversight meaning, which is the page's main emphasis. |

Medium-confidence candidates, decide during editorial review:

| Quality | Candidate | Why it is not clear-cut |
| :--- | :--- | :--- |
| User engagement | `attractive-q42-website` | ISO 25010:2023 says user engagement *replaced* user-interface aesthetics, and the page quotes that note. VisAWI and AttrakDiff hedonic scores measure "pleasure and satisfaction"; "continued interaction" appears only in the monitoring artifact (bounce rate). Link, and keep the brief for the continuation facet. Issue #174 already asks to consolidate aesthetics pages. |
| Legal requirements | `personal-data-lifecycle-protection` | Context names GDPR and CCPA; retention criterion names a legal retention period. The 24-hour erasure target is an invented tightening of GDPR's "one month"; mark it as an assumption when linking. Better than a generic "comply with all laws" example, which the proposal rightly rejects. |
| Operational and environment requirements | `interop-with-specific-Java`, `on-prem-installation-ready-in-30-min` | The page is a Volere category list (adjacent systems, productization, release, backward compatibility). A Java-version interoperability example is a backward-compatibility example; on-prem install is productization. Honest as category links. Alternatively convert the page into a category page; then no requirement link is needed. |
| Self-containedness | `system-runs-offline` | "Fulfils its primary use case without other systems being available" matches the SCS definition's first bullet; but the requirement is a handheld device, not a web application, and SCS is a web-architecture style. Prefer the brief. |

Not covered by any existing criterion (checked): co-existence, communicability, conciseness, consent management, credibility, data minimization, distributability, energy proportionality, functional adaptability, immunity, intervenability, longevity (as capacity growth), model transparency, safe integration, versatility. `low-impact-diagnosis` is not co-existence (same product's subsystem). `reduce-energy-consumption` and `carbon-efficiency-save-20-percent` measure totals, not proportionality.

## Review of the ten drafts

Ordered by the proposal's numbering. Defects are listed correctness first, then usability, then usefulness.

### 1. Withdrawal stops optional analytics (consent management) — keep, minor edits

- Correct and testable. Fail-closed clause ("unreadable consent state does not authorize optional processing") is the best sentence in the proposal.
- Usability: "takes effect before the service acknowledges success, within 2 seconds" reads as two clocks. Say: acknowledgement is sent only after enforcement, and acknowledgement arrives within 2 s.
- Usefulness: the page defines consent management as obtain, **record**, update, enforce. Add one criterion that the withdrawal is recorded with timestamp and purpose and is retrievable on request; otherwise the example covers enforcement only.
- Tags `[secure]`; related `[consent-management, privacy]`.

### 2. Registration stores only necessary fields (data minimization) — keep, one addition

- Correct. Field-injection tests make "nothing outside the approved list is persisted or forwarded" observable.
- Usefulness: the draft tests what happens to *submitted* extra fields but never requires that the form and API *ask for* only the approved fields. Add: the released registration form and API schema contain no personal field outside the approved list (evidence: schema diff at release). That is the visible half of minimization.
- Retention is part of the page's definition and is correctly placed outside the boundary; say so in the assumption line.

### 3. Retrieved instructions cannot authorize tool actions (injection resistance) — keep as the AI facet, lower priority

- The gap itself closes by linking `public-api-intrusion-attempts-blocked` (above). The draft remains valuable because the page's definition is mostly about LLM systems and no requirement covers that.
- Correctness: "a fixed release suite of 200 adversarial cases" invites overfitting. Require the suite to be versioned and extended per release, and forbid training or prompt-tuning on it. The v3 prompt's own point applies: passing a finite suite is evidence for that suite.
- Usability: "persistent instruction update" is jargon; say "no change to stored instructions, memory, or system prompts".

### 4. A person can pause automated refunds (controllability) — keep as the AI-oversight facet

- Correct. "Effective" is defined implicitly by criterion 2 (no new dispatch after acknowledgement); make that explicit in criterion 1 to avoid a 1-second acknowledgement that precedes a still-running dispatcher.
- Usefulness: this is the human-oversight meaning the page spends most of its body on (EU AI Act Art. 14, NIST MANAGE 2.4). Say so in the context; otherwise a reader wonders why a refund queue is "controllability".
- The usability meaning closes today via `interruptable-backend-process`.

### 5. Operators can stop a hazardous simulated action (intervenability) — rewrite

- **Quality fit is wrong.** ISO 25059 defines intervenability for an *AI system*. A conveyor training simulator with a stop button has no AI component; the example illustrates emergency stop, which is `fail-safe`/`safety`, not intervenability.
- **Simulator as the system under requirement** weakens the example. Architects need a requirement for the product, with "Assumption: illustrative targets" per the v3 prompt, not a requirement for a demonstrator. The existing corpus does this already (`provable-insulin-dosage-safety`, `grace-shutdown`, `life-critical-sensor-failure`).
- Rewrite: an ML-driven autonomous vehicle or sorting robot; operator sees the planned action and its confidence, can stop it, and the stop reaches the defined safe state within a stated time; record warning-to-activation and command-to-stop separately (the proposal's best idea in this draft). Keep the caveat that limits come from the product's hazard analysis.
- Blocked by tagging: the page is tagged `secure` only (issue #543). A requirement tagged `safe` under a `secure` quality will look wrong in the graph.

### 6. Commands stay inside a declared operating limit (operational constraint) — keep, de-simulate, lowest draft priority

- The gap closes today via `provable-insulin-dosage-safety`. This draft still adds a non-formal-methods example, which is useful.
- Same simulator objection as draft 5. Write it for the warehouse vehicle itself; the "unknown zone permits only zero speed" and "valid nonzero requests issued unchanged" pair is correct and should survive.
- Usability: rename the slug when de-simulated (e.g. `vehicle-speed-stays-inside-zone-envelope`).

### 7. Integration preserves a simulated safety invariant (safe integration) — keep, de-simulate

- Correct and the only draft whose second criterion explicitly blocks the "never move" degenerate pass. Mismatched units, reversed axes, stale observations and disconnected input are exactly the integration faults that matter.
- Same simulator objection. The integration suite may of course *run* in simulation; the requirement should be about the robot.

### 8. Batch processing does not disrupt interactive work (co-existence) — keep, one clarification

- Correct. Paired 30-minute runs, same trace, errors counted as failures, and a completion bound for the batch: this is the best-measured draft.
- Correctness of fit: ISO defines co-existence as sharing an environment with *other products*. Reporting and order entry read as two modules of one product. Make the report a separate product (for example a third-party BI tool on the same cluster) so the example is unambiguously co-existence rather than internal resource contention.

### 9. A model learns from corrected labels (functional adaptability) — keep, fix the baseline

- **Correctness defect.** The category is "newly introduced", so the incumbent model has never seen it and its F1 on that category is at or near zero. "Improves by at least 0.05 over the incumbent" is then satisfied by an F1 of 0.05, which is useless. Replace with an absolute floor on the new category (for example F1 >= 0.70 on the fixed 300-ticket set, 100 positives) and keep the 0.02 regression cap on established categories.
- Usability: "within one working day" needs its start event (corrected set available) in the criterion, not only in the trigger.
- Fit to ISO 25059 ("acquire information from data or previous actions and use it in future predictions") is good. Keep the disjointness rule.

### 10. Reviewers can identify the model actually running (model transparency) — keep

- Correct. "Unknowns are marked with owner and disposition; missing information without disposition blocks release" prevents the invented-provenance pass. The three-reviewer, 5-minute retrieval test makes "usable information" observable.
- Usability: the first criterion lists eleven items in one sentence. Split identity/version/provenance from evaluation/limitations/usage rights into two bullets; the v3 prompt asks for one obligation per criterion.

## Review of the second batch (briefs)

| Brief | Assessment |
| :--- | :--- |
| Communicability | Keep. Moderated task with "identify reason and next action" rubric is right. Closest existing example (`expressive-error-messages`) is about infrastructure faults and shutdown; not direct. |
| Conciseness | **Reframe.** An incident handover written by a person is not a system property. Make the artifact system-generated (an automatically produced incident summary, a notification, an error message). Word budget plus "all four facts recoverable" is the correct pair once the producer is the system. |
| Credibility | Keep. "Warranted trust with comprehension checks" is the right guard against rewarding persuasive misinformation. Note the page's second paragraph is ChatGPT-attributed and has a typo (issue #544). |
| Distributability | Keep. Unchanged functional suite across single-node and three-node topologies, bounded configuration effort. Good. |
| Energy proportionality | Keep. Idle/25/50/100% power against a declared envelope with meter boundary is exactly the Barroso-Hölzle measure the page cites. Highest-value brief; promote to a draft. |
| Expected physical environment | **Drop the brief.** Covered by `usable-on-factory-floor` (see above). Optional later. |
| Immunity | Keep. Approved harmless fixtures, isolated harness, "permitted documents still open" guard. Good. |
| Longevity | Keep on hold. The page defines capacity growth (Volere), while `durability` carries the unsourced lifespan meaning. Decide the definitions first (issue #542); the brief's "three-year forecast volume within response-time and cost limits" fits the current page. |
| Self-containedness | Keep; promote to a draft. 30-minute outage of adjacent systems, named local workflows complete, deferred exchanges reconciled. Good scope. |
| Simplicity | Keep as a later, better example; gap closes now via `good-readability-score`. |
| User engagement | Keep as the "voluntary continuation" facet; gap likely closes via `attractive-q42-website`. |
| Versatility | Keep. Three materially different named tasks with the same released feature set. Fine. |

## Review of "Review six definitions first"

| Quality | Astra decision | Fable position |
| :--- | :--- | :--- |
| Functional suitability / Suitability | Decide whether one becomes an alias | Agree; the bodies are word-for-word the same ISO quote and issue #174 already asks for it. Make `suitability` an `alias_of: functional-suitability` (ISO name wins; the `suitable` tag is unaffected). Then link `user-tries-primary-function` (functional-appropriateness and functional-completeness are ISO sub-characteristics). Two gaps become one and close. |
| Features | Decide whether it belongs under functional completeness | Go further: the page has no citable definition and an unsourced claim that more features means higher quality, which contradicts functional-appropriateness. Alias to `functional-completeness` or delete (issue #544). Do not write a requirement. |
| DevOps metrics | Umbrella links may be justified; verify DORA terminology | Link the three existing requirements now (table above). Terminology note is correct: DORA renamed MTTR to "failed deployment recovery time" in 2023; the page quotes Atlassian, so no change is needed for the link. |
| Legal requirements | Select one actual obligation | Agree in principle; in practice `personal-data-lifecycle-protection` already names GDPR/CCPA obligations. Link it with an assumption line on the invented deadlines rather than drafting a second privacy example. |
| Operational and environment requirements | Select one boundary | Agree; or convert the page into a category page listing the Volere sub-areas with existing examples (`interop-with-specific-Java`, `on-prem-installation-ready-in-30-min`). Both are cheaper than a new requirement. |
| (added) Durability / Longevity | not in the proposal | Crossed definitions; see issue #542. Link the ACID examples to durability now, hold longevity. |
| (added) Intervenability / Effectiveness tags | not in the proposal | Tagged against their own definitions; see issue #543. Fix before publishing requirements under them. |

## Revised prioritized plan

Priority is correctness first (the relation must be supported by a criterion and the quality definition), usability second (a reader finds an example they can copy), usefulness third (the example changes an architect's decision). Lower-effort items that satisfy all three come first.

**P1 — relation only, high confidence (13 gaps, no drafting)**

| # | Quality | Add to `related:` of |
| ---: | :--- | :--- |
| 1 | themability | `configurable-ui-theme` |
| 2 | expected-physical-environment | `usable-on-factory-floor`, `usable-with-gloves` |
| 3 | operational-constraint | `provable-insulin-dosage-safety` |
| 4 | injection-resistance | `public-api-intrusion-attempts-blocked` |
| 5 | durability | `replication-and-quorum-failure-transparency`, `financial-transactions-are-acid-compliant` |
| 6 | devops-metrics | `low-change-failure-rate`, `mttr-12h`, `fast-deployment` |
| 7 | securability | `access-control-is-enforced`, `only-authenticated-users-can-access` |
| 8 | self-descriptiveness | `new-user-completes-core-tasks-without-training` |
| 9 | data-residency | `data-localization-for-citizen-records` |
| 10 | simplicity | `good-readability-score` |
| 11 | controllability | `interruptable-backend-process` |
| 12 | personalization | `restore-filter-after-log-in` |
| 13 | effectiveness | `new-user-completes-core-tasks-without-training` (after the tag fix, #543) |

**P2 — relation or alias after an editorial decision (6 gaps)**

| # | Quality | Decision needed |
| ---: | :--- | :--- |
| 14 | functional-suitability + suitability | alias `suitability` to `functional-suitability`, then link `user-tries-primary-function` (#174) |
| 15 | user-engagement | link `attractive-q42-website`; keep the continuation brief |
| 16 | legal-requirements | link `personal-data-lifecycle-protection` with an assumption line |
| 17 | operational-environment-requirements | link `interop-with-specific-Java` and `on-prem-installation-ready-in-30-min`, or convert to a category page |
| 18 | features | alias to `functional-completeness` or delete (#544); no requirement |
| 19 | upgradeability | either accept `fleet-ota-updates-with-safe-rollback` against the site's own updateability distinction, or write a major-version example (preferred) |

**P3 — new drafts, in writing order (9)**

| # | Quality | Source | Required change before publishing |
| ---: | :--- | :--- | :--- |
| 20 | consent-management | Astra draft 1 | add "recorded and retrievable" criterion; single clock |
| 21 | data-minimization | Astra draft 2 | add "form and schema request only approved fields" |
| 22 | model-transparency | Astra draft 10 | split the eleven-item criterion |
| 23 | co-existence | Astra draft 8 | make the batch a separate product |
| 24 | functional-adaptability | Astra draft 9 | replace relative F1 gain with an absolute floor |
| 25 | safe-integration | Astra draft 7 | write for the robot, not the simulator |
| 26 | energy-proportionality | Astra brief | promote; already has the measurement design |
| 27 | self-containedness | Astra brief | promote; 30-minute adjacent-system outage |
| 28 | intervenability | Astra draft 5 | rewrite for an AI system, real product; after tag fix (#543) |

Facet drafts that no longer close a gap but add value (write after P3): controllability AI-oversight (draft 4), injection-resistance retrieved-content (draft 3), operational-constraint vehicle envelope (draft 6, de-simulated), upgradeability major-version (if P2 #19 goes that way).

**P4 — briefs, need inputs or definition work (8)**

| # | Quality | Blocker |
| ---: | :--- | :--- |
| 29 | communicability | rubric and population |
| 30 | credibility | study design |
| 31 | distributability | topology and network conditions |
| 32 | immunity | approved fixtures, isolated harness |
| 33 | versatility | three named tasks |
| 34 | conciseness | reframe artifact as system-generated |
| 35 | longevity | definition decision (#542) |
| 36 | (reserve) user-engagement continuation facet, simplicity task-based example | optional once P1/P2 links exist |

Count check: 13 + 6 + 9 + 8 = 36. Item 36 is a reserve row so the numbering stays aligned with the 36 gaps; the two facets in it belong to qualities already counted in P1/P2.

## Publication rules that the proposal states correctly

Keep these from the Astra document: one primary quality per requirement, secondary relations only when a criterion supports them, canonical slugs in `related:`, existing dimension tags only, `###` headings, "Assumption: illustrative targets" once per requirement, no simulator caveats standing in for real requirements. Recompute the gap counter after the P1 relations land; it is a consequence, not a target.

## Issues opened during this review

- #541 ci: `wcag-refresh.yml` serves Jekyll on port 4000 while Playwright defaults to 4245. The quarterly scan will fail on its next run.
- #542 content: durability and longevity pages have crossed definitions.
- #543 content: intervenability (`secure`) and effectiveness (`efficient`) are tagged against their own definitions.
- #544 content: broken `/chat.openai.com` link on upgradeability, Wiktionary cited as Wikipedia on securability, unsourced "more features = higher quality" claim, typo on credibility.

Existing issues that this plan touches: #147 (every quality should have a requirement), #174 (consolidate suitability pages and aesthetics pages).

## GitHub Actions run failures (last 30 runs)

- Build and deploy, run `33975008548` (5 September): `actions/deploy-pages@v5` timed out during `purging_cdn` after ten minutes. Transient on the GitHub side; the next run one minute later succeeded. No action.
- WCAG score refresh, run `33395653828` (31 August): `net::ERR_UNSAFE_PORT` on port 4045. That port was fixed on 3 September, but the workflow still targets the wrong port; see #541.
