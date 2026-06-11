---
layout: approach
title: "Externalized Business Rules"
tags: [flexible]
aka: [Rule Engine, Decision Tables]
supported_qualities: [changeability, adaptability, time-to-market, explainability, auditability]
supported_qualities_notes:
  changeability: "Pricing, eligibility, and routing rules change by editing the decision model; the application code and its release cycle stay untouched."
  adaptability: "Different markets, regions, or tenants run different rule sets against the same application binary."
  time-to-market: "A policy update ships on the decision model's own deployment cadence instead of waiting for the next application release train."
  explainability: "The engine reports which rules fired for a decision, giving case workers and auditors a concrete explanation per outcome."
  auditability: "Versioned decision models record which policy was in force when; each decision links to the exact rule version that produced it."
tradeoffs: [maintainability, testability, debuggability, performance]
tradeoff_notes:
  maintainability: "The rule base becomes a second programming environment with its own versioning, review, and deployment discipline. The promise that business users maintain rules rarely survives production — developers usually end up owning both worlds, plus the engine."
  testability: "Rules bypass the application's test suite. Without a dedicated harness that runs every decision table against expected outcomes, a rule edit reaches production with less scrutiny than any code change."
  debuggability: "A wrong outcome emerges from the interplay of matching rules, hit policies, and evaluation order. Tracing why a rule fired — or silently lost to a higher-priority one — requires engine-specific tooling."
  performance: "Every decision call pays engine-evaluation overhead, plus a network hop when rules run as a separate decision service on the request path."
intent: "Move volatile decision logic out of application code into declarative, separately deployed rules, so policy changes ship without touching or redeploying the application."
mechanism: "The application sends input facts to a rule engine; the engine evaluates a declarative decision model — decision tables, DMN with FEEL expressions, or policy rules — and returns the outcome plus the rules that fired. The decision model is versioned, tested, and deployed on its own cadence."
applicability: "Use for decision logic that changes faster than the codebase — pricing, eligibility, risk scoring, routing, compliance — especially when domain experts own the policy. Skip for stable logic, decisions needing complex data access mid-evaluation, or teams unwilling to govern a second artifact lifecycle."
related_requirements: [annual-tax-update, governance-policy-enforcement]
related_requirements_notes:
  annual-tax-update: "Yearly tax-rule changes localize to the decision model, keeping the update well inside the 80-person-hour budget."
  governance-policy-enforcement: "Policy-as-code engines distribute updated rules to every enforcement point within the required 15-minute window."
permalink: /approaches/externalized-business-rules
---

Some logic changes faster than software ships: pricing, eligibility, risk scoring, routing, compliance. Externalizing it into a declarative decision model lets domain experts read — and change — the policy on its own lifecycle.

The application decides *when*; the rules decide *what*.

![Externalized business rules: the application sends input facts to a rule engine, which evaluates a versioned decision model maintained by domain experts and returns the outcome plus the rules that fired.](/assets/img/approaches/externalized-business-rules.svg)

## How It Works

- The application gathers input facts (applicant age, order value, region) and calls the engine.
- The engine matches facts against the decision model and returns the outcome plus the rules that fired.
- The decision model lives in its own repository with review, tests, and versioned deployment.
- Standard notation (OMG DMN) keeps models portable and readable by non-programmers.

## Mini Example

| Applicant age | Prior claims | Risk class |
|---------------|--------------|------------|
| < 25 | any | high |
| 25–65 | > 2 | high |
| 25–65 | ≤ 2 | standard |
| > 65 | any | manual review |

Hit policy *unique*: exactly one row may match; overlaps fail validation.

## Failure Modes

- Rules grow into a shadow application: calculations, loops, and data lookups creep in until the model is unreviewed code.
- Overlapping rows under a lenient hit policy make outcomes order-dependent; a harmless edit changes results for unrelated cases.
- Engine and model versions drift: a model authored for one engine version evaluates differently on the next.
- A separate decision service adds a failure point and latency to every request.

## Verification

- Static validation in CI checks every table for completeness and overlapping rows.
- A regression suite replays recorded production decisions against every new model version; outcome diffs block deployment.
- Decision latency p99 stays inside its budget under production load.
- An audit query returns the rule version behind any past decision.

## Variants and Related Tactics

- Decision tables suit explicit policy; production-rule engines add chained inference at predictability's cost.
- Policy-as-code engines apply the tactic to authorization and governance decisions.
- Externalized configuration changes values, feature toggles select code paths; this tactic changes decision logic.
- A domain-specific language is the general case when tables turn rigid.

## References

- [Decision Model and Notation (DMN)](https://www.omg.org/dmn/) — Object Management Group
- [RulesEngine](https://martinfowler.com/bliki/RulesEngine.html) — Martin Fowler (2009)
- *Real-World Decision Modeling with DMN* — James Taylor, Jan Purchase (Meghan-Kiffer, 2016)
