# Requirements proposals — 5 September 2026

## Recommendation

Start with eight existing requirements whose links need review, then write the ten examples below. Keep twelve further examples in the queue. Review six broad or overlapping quality entries before inventing requirements for them.

The aim is useful, distinct examples. Reducing the gap counter is a consequence, not an acceptance criterion.

## Inventory and priorities

Snapshot: `main` at `6fa4c9da`, 228 quality files and 150 requirement files. Reproduced the **36** gaps from the “Qualities without Requirements” logic in `_includes/about/content-analytics.md`: a canonical quality has no incoming requirement `related:` reference. Excluded alias stubs and synonyms from `_data/quality-synonyms.yml`. This measures direct links, not whether existing prose already covers the concern.

Priorities reflect consequence of failure, usefulness across systems, distinction from existing examples, and readiness of the definition. They are editorial judgments, not empirical risk scores. Order within the first batch is the suggested writing order.

| Work                           | Qualities | Outcome                                                                                       |
| :----------------------------- | --------: | :-------------------------------------------------------------------------------------------- |
| Review existing coverage first |         8 | Add a justified relation, or make a small clarification, rather than duplicate a requirement. |
| First batch                    |        10 | Drafts below address concrete gaps in privacy, control, safety, shared resources, and AI.     |
| Second batch                   |        12 | Useful examples with narrower applicability or more measurement design needed.                |
| Review definitions first       |         6 | Resolve duplication, broad categories, or unclear quality boundaries.                         |
| **Total**                      |    **36** | Every current gap has a proposed disposition.                                                 |

## Review existing coverage first

These are proposed changes, not completed fixes. A relation must be supported by an acceptance criterion; a word in the context is insufficient. Review inherited defects before presenting an existing example as a model to copy.

| Quality                                                 | Existing requirement                                                                             | Verdict and precise follow-up                                                                                                                                                                     |
| :------------------------------------------------------ | :----------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Data residency](/qualities/data-residency)             | [Citizen-record localization](/requirements/data-localization-for-citizen-records)               | Storage, processing, backups, and recovery locations are explicit. Add the relation after distinguishing the fictional jurisdiction policy from a claim that every country requires localization. |
| [Durability](/qualities/durability)                     | [Replication and quorum reads/writes](/requirements/replication-and-quorum-failure-transparency) | The criterion prohibiting loss of acknowledged writes directly covers database durability. Link that meaning; the quality page also carries a different, long-term-usefulness meaning.            |
| [Upgradeability](/qualities/upgradeability)             | [Fleet OTA updates](/requirements/fleet-ota-updates-with-safe-rollback)                          | Activation of a new version and recovery to the previous version already provide an example. No separate scenario needed merely to distinguish the existing updateability link.                   |
| [Themability](/qualities/themability)                   | [Configurable UI theme](/requirements/configurable-ui-theme)                                     | Runtime theme switching and preference persistence directly cover it. Add the missing relation.                                                                                                   |
| [Personalization](/qualities/personalization)           | [Restore filter after login](/requirements/restore-filter-after-log-in)                          | Restoring an individual's saved settings is direct coverage. Clarify that a shared workstation restores the signed-in user's settings, not the previous user's.                                   |
| [Securability](/qualities/securability)                 | [Only authenticated users can access data](/requirements/only-authenticated-users-can-access)    | The cross-role authorization criterion covers different levels of access. Link it; the title understates the existing authorization scope.                                                        |
| [Self-descriptiveness](/qualities/self-descriptiveness) | [New user completes core tasks](/requirements/new-user-completes-core-tasks-without-training)    | In-application guidance and contextual error messages provide a direct example. Review the fixed interaction-count and SUS claims separately; do not inherit them uncritically.                   |
| [Effectiveness](/qualities/effectiveness)               | [New user completes core tasks](/requirements/new-user-completes-core-tasks-without-training)    | Correct task completion is already measured separately from completion time. Link the success criterion; speed alone would measure efficiency.                                                    |

## First batch: ten drafts

All domains and numerical targets below are **illustrative authoring assumptions**, not observed benchmarks, legal deadlines, or certified safety limits. Version the test inputs and expected outcomes before evaluating an implementation. Passing a finite test suite provides evidence for that suite, not a universal guarantee. The three safety examples use a simulator; operational deployment needs a system-specific hazard analysis.

### 1. Withdrawal stops optional analytics

Primary quality: [consent management](/qualities/consent-management). Proposed slug: `withdrawal-stops-optional-analytics`.

**Context:** An account service uses consent for optional usage analytics. Essential account processing has a separate policy and remains available.

**Trigger:** A signed-in user withdraws consent for analytics.

**Acceptance criteria:**

- The withdrawal takes effect before the service acknowledges success, within 2 seconds of receipt in every case in the release test matrix; evidence: consent-service traces.
- After acknowledgement, no new analytics processing starts for that account, including queued jobs and requests from stale sessions; evidence: purpose-labelled execution traces for the release matrix covering queue delay, retry, and consent-store outage. An unreadable consent state does not authorize optional processing.

**Review boundary:** This concerns future processing for the withdrawn purpose. It does not promise erasure of earlier lawful processing or establish a statutory deadline. Existing personal-data lifecycle requirements do not test purpose-specific consent enforcement.

### 2. Registration stores only necessary fields

Primary quality: [data minimization](/qualities/data-minimization). Proposed slug: `registration-stores-only-necessary-fields`.

**Context:** A newsletter service needs an email address and selected language. Product and privacy owners approve that field list for registration; optional analytics are outside this example.

**Trigger:** A visitor submits the registration form or calls its API.

**Acceptance criteria:**

- No submitted personal field outside the approved list is persisted or passed downstream, including through logs and analytics; evidence: storage snapshots and captured outbound payloads for each release's field-injection tests.
- Registration succeeds with only the approved fields in every valid case in the release suite; evidence: API and form test results.

**Review boundary:** Encryption or deletion after collection does not demonstrate that unnecessary collection was avoided. The list is a stated purpose decision, not a model-generated claim about what privacy law permits.

### 3. Retrieved instructions cannot authorize tool actions

Primary quality: [injection resistance](/qualities/injection-resistance). Proposed slug: `retrieved-content-cannot-authorize-actions`.

**Context:** A support assistant reads customer attachments and can propose account changes. Retrieved content cannot grant permissions, approve actions, or establish persistent operating instructions.

**Trigger:** An attachment contains instructions that conflict with the user's authorized task.

**Acceptance criteria:**

- No unauthorized account change, external disclosure, or persistent instruction update occurs in a fixed release suite of 200 adversarial cases covering attachments, retrieved pages, tool output, and retained context; evidence: action and memory-write traces compared with each case's permission manifest.
- At least 95% of 100 separate benign support cases complete correctly under the same permissions; evidence: task-level evaluation report for that release.

**Review boundary:** The benign set prevents “refuse everything” from passing. SQL-injection examples already exist; this example adds retrieved instructions and persistent context. It does not claim that prompt injection has been eliminated.

### 4. A person can pause automated refunds

Primary quality: [controllability](/qualities/controllability). Proposed slug: `operator-pauses-automated-refunds`.

**Context:** A support supervisor can pause an assistant's refund queue. A refund already accepted by the payment service cannot be recalled by this control.

**Trigger:** The supervisor requests a pause while refunds are queued or being dispatched.

**Acceptance criteria:**

- The pause becomes effective and is acknowledged within 1 second of receipt in every release test, including concurrent dispatch; evidence: supervisor-command and payment-dispatch traces.
- No new refund is dispatched after acknowledgement until an authorized resume; evidence: action traces for a test matrix covering retries, worker restart, and an unavailable control store.
- The supervisor sees the identifiers and outcomes of refunds already dispatched at the pause boundary within 5 seconds; evidence: UI checks against the payment-service test ledger.

**Review boundary:** Define the dispatch boundary explicitly. A visible pause button and an audit entry alone do not establish control.

### 5. Operators can stop a hazardous simulated action

Primary quality: [intervenability](/qualities/intervenability). Proposed slug: `operator-intervenes-in-simulated-conveyor-hazard`.

**Context:** A conveyor training simulator models an operator stopping an unsafe transfer. Its demonstration contract defines the stopped state as drive command zero and automatic restart disabled.

**Trigger:** The simulator presents a hazard warning; the operator activates the stop control.

**Acceptance criteria:**

- Every scripted warning identifies the affected transfer and presents an operable stop control before the simulator's intervention deadline; evidence: scenario timeline and interaction test report for each release.
- After activation, the simulator reaches the defined stopped state within 500 ms in every scripted case; evidence: simulator state traces.

**Review boundary:** The 500 ms target is for software demonstration only. Record warning-to-activation time separately; the command-response measurement does not establish that a real operator can react before harm.

### 6. Commands stay inside a declared operating limit

Primary quality: [operational constraint](/qualities/operational-constraint). Proposed slug: `simulated-vehicle-obeys-operating-limit`.

**Context:** A warehouse-vehicle simulator has a demonstration operating envelope. In its pedestrian zone, permitted speed commands range from 0 to 0.5 m/s; an unknown zone permits only a zero-speed command.

**Trigger:** A planner requests a speed while the vehicle enters or occupies that zone.

**Acceptance criteria:**

- Every issued speed command remains inside the applicable envelope in the release suite covering boundary values, excessive requests, and missing zone data; evidence: requested-versus-issued command traces.
- The same suite contains valid nonzero requests that are issued unchanged; evidence: command comparisons, preventing a permanently disabled vehicle from passing.

**Review boundary:** This tests automatic constraint enforcement. It does not test operator intervention, physical braking distance, or certify 0.5 m/s as a safe real-world speed.

### 7. Integration preserves a simulated safety invariant

Primary quality: [safe integration](/qualities/safe-integration). Proposed slug: `integration-preserves-simulated-stop-invariant`.

**Context:** A robot simulator receives a replacement obstacle-detection component. Its agreed invariant prohibits a forward-motion command while an obstacle occupies the simulated exclusion zone.

**Trigger:** A candidate detector is integrated with the controller.

**Acceptance criteria:**

- The invariant holds in every case of the versioned integration suite, including mismatched distance units, reversed coordinate axes, stale observations, and disconnected input; evidence: simulator input and motion-command traces.
- Every unobstructed nominal case still completes its planned route; evidence: route completion report from the same release run.

**Review boundary:** Component tests alone cannot pass this gate: the evidence must exercise the assembled detector-controller pair. The simulator's invariant needs separate validation before use in physical equipment.

### 8. Batch processing does not disrupt interactive work

Primary quality: [co-existence](/qualities/co-existence). Proposed slug: `batch-processing-preserves-interactive-service`.

**Context:** Reporting and order entry share a fixed-capacity environment. The test contract fixes 100 order requests per second and a report workload of one million records.

**Trigger:** The report starts while order entry runs at its declared load.

**Acceptance criteria:**

- Order-entry p95 response time increases by at most 10% against an order-only baseline in each of three paired 30-minute runs using the same hardware, dataset, and request trace; evidence: load-test reports, with errors counted as failed requests rather than omitted.
- The report completes within 15 minutes in each shared run; evidence: report-job traces.
- Order-entry failed requests remain at or below 0.1% in each shared run; evidence: load-generator results for all submitted requests.

**Review boundary:** Both products must still do useful work. Suspending the batch indefinitely is not co-existence.

### 9. A model learns from corrected labels

Primary quality: [functional adaptability](/qualities/functional-adaptability). Proposed slug: `ticket-classifier-learns-from-corrections`.

**Context:** A ticket classifier receives 500 reviewed corrections for a newly introduced category. This example concerns learning from feedback; it is separate from detecting drift.

**Trigger:** The corrected training set becomes available to the model-maintenance process.

**Acceptance criteria:**

- Within one working day, the candidate's F1 score for the new category reaches at least 0.80 and exceeds the incumbent by at least 0.05 on a separate, fixed 300-ticket evaluation set containing 100 positive examples; evidence: versioned training and evaluation report.
- No established category's F1 score drops by more than 0.02 on the fixed existing regression set; evidence: per-category report for the same candidate.

**Review boundary:** Keep corrections and evaluation cases disjoint, with independently reviewed labels. A candidate that misses either target is not promoted. The target is an example budget and improvement goal, not a guaranteed consequence of retraining.

### 10. Reviewers can identify the model actually running

Primary quality: [model transparency](/qualities/model-transparency). Proposed slug: `deployed-model-has-current-evidence`.

**Context:** An organization deploys a document classifier. Its release reviewers need to assess the exact deployed model, not a generic supplier description.

**Trigger:** A model version is submitted for production release.

**Acceptance criteria:**

- Every candidate has a release-linked record of model identity, version, intended use, excluded uses, provenance, evaluation-set identity, per-task results, known limitations, and usage rights; evidence: record-to-artifact comparison at the release review. Unavailable information is explicitly marked with its owner and release disposition.
- In a review exercise, each of three reviewers finds the deployed version, its principal limitation, and the matching evaluation report within 5 minutes without asking its author; evidence: timed review sheet and artifact checks.

**Review boundary:** Completeness alone can reward invented provenance. Unknowns remain unknown; required information missing without an approved disposition prevents release. This is model documentation, not an explanation of each prediction.

## Second batch: twelve authoring briefs

These are starting points, not acceptance-ready requirements. Each needs its named inputs and evidence before publication.

| Quality                                                                   | Proposed example and decisive measurement                                                                                                           | What to settle first                                                                                                                                               |
| :------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Communicability](/qualities/communicability)                             | A benefits portal explains a rejected submission. New users identify both the reason and the next action from the message in a moderated task.      | Define the answer rubric and intended users; distinguish communication from task completion.                                                                       |
| [Conciseness](/qualities/conciseness)                                     | An incident handover contains the service, impact, current status, and next owner in at most 120 words. Reviewers recover all four facts correctly. | The word budget is illustrative. Brevity without required information fails.                                                                                       |
| [Credibility](/qualities/credibility)                                     | A public-data dashboard shows provenance and known limitations. Users distinguish verified findings from explicitly uncertain estimates in a study. | Define credibility as warranted trust, with comprehension checks; a favourable rating alone can reward persuasive misinformation.                                  |
| [Distributability](/qualities/distributability)                           | The same application runs in single-node and three-node arrangements and passes an unchanged functional suite. Bound configuration effort.          | Specify topology, network conditions, and which components move; avoid turning this into a scaling benchmark.                                                      |
| [Energy proportionality](/qualities/energy-proportionality)               | Measure service power at idle and at 25%, 50%, and 100% of a declared useful-work rate. Compare each point with a stated power envelope.            | Define the meter boundary, hardware, warm-up, steady-state windows, and useful-work unit. Do not assume ideal zero idle power.                                     |
| [Expected physical environment](/qualities/expected-physical-environment) | An outdoor kiosk completes its transaction suite throughout its declared temperature and humidity envelope.                                         | Obtain the intended deployment envelope and chamber protocol. Invented ranges are not evidence of field fitness.                                                   |
| [Immunity](/qualities/immunity)                                           | An import workstation handles prohibited executable content without execution or propagation, while permitted documents still open.                 | Use approved harmless test fixtures and an isolated harness. Distinguish malware handling from API access control and prompt injection.                            |
| [Longevity](/qualities/longevity)                                         | A planning system supports the forecast three-year data volume while retaining agreed response-time and cost limits.                                | This page currently defines capacity growth, not service lifespan. Fix the growth forecast and budget before choosing numbers.                                     |
| [Self-containedness](/qualities/self-containedness)                       | A service completes named local workflows during a 30-minute outage of adjacent business systems. Verify completion through its own interface.      | State dependencies that remain available and how deferred exchanges are reconciled. This demonstrates operational independence, not every SCS organizational rule. |
| [Simplicity](/qualities/simplicity)                                       | Maintainers unfamiliar with a module correctly implement a bounded rule change within an effort budget and pass the regression suite.               | Choose comparable participants and tasks. Lines of code and a single complexity score are weak substitutes for understanding.                                      |
| [User engagement](/qualities/user-engagement)                             | Users rate a voluntary training interface as inviting and choose to continue after completing a required lesson.                                    | Separate voluntary continuation from task failure, obligation, or manipulative prompts; predefine the study questions and population.                              |
| [Versatility](/qualities/versatility)                                     | One reporting product completes three distinct, named reporting tasks using the same released feature set.                                          | Select materially different purposes and acceptable outputs; distinguish breadth of use from learning or customization.                                            |

## Review six definitions before drafting

| Quality                                                                                     | Editorial decision                                                                                                                                                                                                                              |
| :------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Functional suitability](/qualities/functional-suitability)                                 | Its definition matches suitability. Decide whether one should become an alias before creating two examples of the same concern.                                                                                                                 |
| [Suitability](/qualities/suitability)                                                       | Resolve jointly with functional suitability. Then use a concrete task-fitness scenario, potentially refining the existing primary-function example.                                                                                             |
| [Features](/qualities/features)                                                             | A feature inventory is not automatically a quality requirement; more features need not improve fitness. Decide whether this belongs under functional completeness before drafting.                                                              |
| [DevOps metrics](/qualities/devops-metrics)                                                 | This is a family of measures. Existing change-failure and recovery examples may supply justified umbrella links; verify current DORA terminology from its own sources before revising this page. Do not prescribe a universal deployment quota. |
| [Legal requirements](/qualities/legal-requirements)                                         | Select one actual obligation, jurisdiction, affected actor, and effective date. Generic “comply with all laws” text adds no useful example. Existing privacy examples need source review, not automatic relinking.                              |
| [Operational and environment requirements](/qualities/operational-environment-requirements) | The definition collects interfaces, packaging, releases, and backward compatibility. Select one boundary or clarify the category; do not add a requirement that attempts all four.                                                              |

## Authoring and review

Use [Requirements Prompt v3](requirements-prompt-v3.md). Publish the first batch individually after checking definitions, nearby examples, and the proposed thresholds. Preserve one primary quality per example; add secondary relations only when an explicit criterion supports them.

For repository publication, use existing canonical slugs in `related:`, choose existing dimension tags, and check permalink collisions. Recompute the gap count only after those relations are present. Nothing in this proposal edits live qualities or requirements.
