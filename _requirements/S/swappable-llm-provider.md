---
title: "Swappable LLM Provider"
tags: [flexible, maintainable]
related: [replaceability, portability, interchangeability, modifiability, independence]
permalink: /requirements/swappable-llm-provider
note: "An example of a [replaceability](/qualities/replaceability) requirement. The product being replaced is the language model behind an assistant; the assistant, its users and its purpose stay the same. An alternative model can be interface-compatible yet behave differently, so its fitness has to be measured rather than assumed, and the cost of the exit has to be bounded before the exit is needed."
---

### Context

The assistant calls a commercial large language model over a provider-specific API. Prices change, model versions are deprecated on short notice, capabilities regress between releases, and regulatory or contractual conditions can make a provider unusable. The system must be able to change provider at a known, bounded cost.

Interface compatibility is not sufficient. Two models can accept the same request and return differently shaped, differently reasoned answers. An alternative provider counts as available only once it has passed the evaluation suite that defines acceptable behaviour.

### Trigger

The provider raises prices, deprecates or degrades the model in use, breaches its service-level agreement, or becomes legally or contractually unusable.

### Acceptance Criteria

- Qualification effort: qualifying a new candidate provider, including evaluation, prompt adaptation and contract setup, takes **<= 15 person-days**; source: engineering work log; horizon: each qualification.
- Switching effort: moving production traffic to a qualified provider takes **<= 3 person-days** and **<= 2 working days** elapsed, and changes no application code outside the provider adapter; prompts, evaluation cases and tests may change; source: work log, drill log and pull-request diff; horizon: each provider switch or drill.
- Suite coverage: the evaluation suite holds **>= 200** cases, **>= 20** per production task type, plus a critical subset of **>= 50** cases for safety, compliance and the highest-value tasks; each metric is the pass rate of one task type; source: suite manifest; horizon: each suite revision.
- Fitness: before cutover, the candidate passes **100%** of the critical subset, meets the release threshold of every metric, and scores no metric more than **5** percentage points below the incumbent on the same suite version; source: evaluation report; horizon: before each cutover.
- Recovery: if a new provider fails within **14 days** of cutover, traffic returns to the previous provider, or to another qualified provider if the previous one is no longer usable, through a configuration change that takes effect within **<= 15 minutes**; source: drill log; horizon: each provider switch or drill.

### Measurement & Verification

Switching effort and recovery are measured in a drill, not estimated: the alternative provider is put in front of production traffic in a canary and rolled back again. Fitness is compared per metric, never only in total, because an average can hide a single collapsed capability. The absolute release thresholds keep two weak providers from qualifying each other.
