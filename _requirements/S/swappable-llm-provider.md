---
title: "Swappable LLM Provider"
tags: [flexible, maintainable]
related: [replaceability, portability, interchangeability, modifiability, independence]
permalink: /requirements/swappable-llm-provider
note: "An example of a [replaceability](/qualities/replaceability) requirement. The product being replaced is the language model behind an assistant; the assistant, its users and its purpose stay the same. Two things make the example worth spelling out: an alternative model can be interface-compatible yet behave differently, so its fitness has to be measured rather than assumed, and the cost of the exit has to be bounded before the exit is needed."
---

### Context

The assistant calls a commercial large language model over a provider-specific API. Provider risk is concrete: prices change, model versions are deprecated on short notice, capabilities regress between releases, and regulatory or contractual conditions can make a provider unusable at short notice. The system must be able to change provider at a known, bounded cost.

Interface compatibility is not sufficient. Two models can accept the same request and return differently shaped, differently reasoned answers, so an alternative provider counts as available only once it has passed the evaluation suite that defines acceptable behaviour, and only while it can actually carry production load under an active contract.

### Trigger

The provider raises prices, deprecates or degrades the model in use, breaches its service-level agreement, or becomes legally or contractually unusable — and, independently of any such event, the scheduled qualification run that keeps an alternative ready.

### Acceptance Criteria

- Confinement: provider SDKs, request and response types, and provider credentials are confined to one designated adapter component; a build-time dependency check reports **0** provider imports outside it, and a secret scan reports **0** provider credentials outside its configuration; source: dependency-lint and secret-scan reports in CI; horizon: every merge to the main branch.
- Qualification effort: qualifying a new candidate provider — evaluation, prompt adaptation, account and contract setup — takes **<= 15 person-days**; source: engineering work log; horizon: each qualification.
- Switching effort: moving production traffic to a qualified provider takes **<= 3 person-days** of effort and **<= 2 working days** elapsed from decision to full cutover, and changes no application code outside the adapter component; prompt templates, evaluation cases and tests may change; source: engineering work log for effort, switching-drill log for elapsed time, merged pull-request diff for scope; horizon: each provider switch or switching drill.
- Suite coverage: the evaluation suite holds **>= 200** cases covering every production task type with **>= 20** cases each, and a critical subset of **>= 50** cases for safety, compliance and the highest-value tasks; each metric is the pass rate for one task type, so metrics are comparable in percentage points; source: suite manifest; horizon: each suite revision.
- Fitness: before cutover, the candidate passes **100%** of the critical subset, meets the release threshold the suite defines for every metric — the same thresholds the incumbent must meet on every release — and scores no metric more than **5** percentage points below the incumbent on the same suite version; source: evaluation-suite report; horizon: before each cutover.
- Standing readiness: at least one alternative provider holds a passing fitness result no older than **90 days**, on a contracted account whose production quota covers **>= 100%** of peak load, with p95 latency **<= 1.5x** and unit cost **<= 1.5x** the incumbent's; the scheduled run repeats every **60 days**, so one failed run still leaves time to requalify; source: dated evaluation report, contract record, load-test record; horizon: monthly check of report age and contract status.
- Recovery: if a new provider fails within **14 days** of cutover, traffic returns to the previous provider — or, where that provider is no longer usable, moves to the standing-ready alternative — through a configuration change that takes effect within **<= 15 minutes** and requires no redeployment; source: switching-drill log; horizon: each provider switch or switching drill.

### Measurement & Verification

The dependency check and the secret scan run in the standard build and fail it, so confinement cannot erode unnoticed between switches. They establish that no code outside the adapter *depends on* a provider; whether prompts or tool-calling conventions silently *assume* one is what the fitness run reveals, which is why the evaluation suite, not the import graph, decides readiness. Switching effort and recovery are measured in a drill, not estimated: the alternative provider is put in front of production traffic in a canary and rolled back again; the work log records person-days, the drill log records elapsed time. Fitness results are compared per metric, never only in total, because an average can hide a single collapsed capability — the failure mode that makes a nominally compatible provider unusable — and the absolute thresholds keep two weak providers from qualifying each other.
