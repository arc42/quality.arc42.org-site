---
title: "Swappable LLM Provider"
tags: [flexible, maintainable]
related: [replaceability, portability, interchangeability, modifiability, independence]
permalink: /requirements/swappable-llm-provider
note: "Written as an example of [replaceability](/qualities/replaceability) rather than as a separate *vendor independence* quality: what changes is the supplier of a product, which is exactly the question replaceability asks. The AI framing is the current occasion, not a new characteristic — the same requirement shape has served for database engines, message brokers and cloud platforms."
---

### Context

The assistant calls a commercial large language model over a provider-specific API. Provider risk is concrete: prices change, model versions are deprecated on short notice, capabilities regress between releases, and regulatory or contractual conditions can make a provider unusable at short notice. The system must be able to change provider at a known, bounded cost.

Interface compatibility is not sufficient. Two models can accept the same request and return differently shaped, differently reasoned answers, so an alternative provider counts as available only once it has been measured against the incumbent.

### Trigger

The provider raises prices, deprecates or degrades the model in use, breaches its service-level agreement, or becomes legally or contractually unusable — and, independently of any such event, the scheduled qualification run that keeps an alternative ready.

### Acceptance Criteria

- Isolation: provider SDKs, request and response types, and provider credentials are referenced only inside the `llm-adapter` module; a build-time import check reports **0** references from any other module; source: dependency-lint report in CI; horizon: every merge to the main branch.
- Switching effort: moving production traffic to an already-qualified alternative provider takes **<= 3 person-days** and changes no source file outside `llm-adapter` and its configuration; source: engineering work log and the merged pull-request diff; horizon: each provider switch or switching drill.
- Behavioural equivalence: before cutover, the candidate provider scores **>= 95%** of the incumbent's aggregate result on the regression evaluation suite of **>= 200** cases, with no individual metric more than **5** percentage points below the incumbent; source: evaluation-suite report; horizon: before each cutover.
- Standing readiness: at least one alternative provider holds a passing evaluation result no older than **90 days**; source: scheduled evaluation run and its dated report; horizon: quarterly.
- Reversibility: after a cutover, returning to the previous provider is a configuration change that takes effect within **<= 15 minutes** and requires no redeployment; source: switching-drill log; horizon: each provider switch or switching drill.

### Measurement & Verification

The dependency-lint check runs in the standard build and fails it, so isolation cannot erode unnoticed between switches. Switching effort and reversibility are measured in a drill, not estimated: the alternative provider is put in front of production traffic in a canary and rolled back again, and the elapsed times are recorded. Aggregate evaluation results are compared per metric as well as in total, because an average can hide a single collapsed capability — the failure mode that makes a nominally compatible provider unusable.
