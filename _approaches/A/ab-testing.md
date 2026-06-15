---
layout: approach
title: "A/B Testing"
tags: [suitable, usable]
aka: [Split Testing, Online Controlled Experiment]
supported_qualities: [functional-appropriateness, effectiveness, user-experience, user-engagement]
supported_qualities_notes:
  functional-appropriateness: "Each variant is judged on whether it actually helps users accomplish the target task, so only changes that demonstrably improve task outcomes ship."
  effectiveness: "Controlled comparison quantifies whether users complete their goals more accurately and completely under a variant before it reaches everyone."
  user-experience: "Design and flow changes are decided by observed user behaviour on live traffic, grounding UX choices in evidence rather than opinion."
  user-engagement: "Variants compete on real engagement metrics, so the version that measurably increases interaction is the one promoted to all users."
tradeoffs: [code-complexity, cycle-time]
tradeoff_notes:
  code-complexity: "An experiment needs variant-assignment logic, per-user event tracking, and a statistics pipeline to compute significance — infrastructure the team builds and maintains. Each live test also forks the code into branches that must be cleaned up after the verdict, or stale variants accumulate and obscure the real behaviour."
  cycle-time: "A change reaches production but stays unproven until the experiment gathers enough samples for a trustworthy verdict, often days or weeks. Cutting that window short to decide faster invites false positives from peeking — the very error A/B testing exists to prevent."
intent: "Split live traffic between variants with randomized assignment, then ship the version that measurably improves the target metric."
mechanism: "Randomly assign incoming users to a control (A) and one or more treatments (B), each seeing a different variant. Log a predefined success metric per user, run until the sample reaches statistical power, then compare variants with a significance test and promote the winner."
applicability: "Use when you have enough traffic to reach significance quickly, a clear quantitative success metric, and reliable per-user logging. Skip when traffic is too low for a timely verdict, the change has no measurable outcome, or ethics or safety forbid withholding it from a group."
related: [canary-deployment]
related_notes:
  canary-deployment: "Same traffic-splitting infrastructure, different question: a canary asks whether the new version is safe to roll out; an A/B test asks which variant serves users better."
related_requirements: [first-time-onboarding-without-errors, user-tries-primary-function, new-features-introduct-no-bugs]
related_requirements_notes:
  first-time-onboarding-without-errors: "Onboarding-flow variants are A/B tested on real first-time users, and the version with the higher completion rate and fewer errors is kept."
  user-tries-primary-function: "Competing designs for the primary task are compared on first-attempt success and satisfaction, so the variant that lifts those metrics ships."
  new-features-introduct-no-bugs: "Guardrail metrics in the experiment — errors, crashes, latency — flag a feature that degrades quality on its treatment slice before full rollout."
permalink: /approaches/ab-testing
---

A/B testing compares two or more variants of a feature by serving them to randomly assigned slices of live users at the same time. Each variant logs a predefined success metric — conversion, task completion, time on task, revenue per user — and a statistical test decides whether the difference between variants is real or noise. The variant that wins on the metric becomes the default for everyone.

The defining property is the randomized, concurrent comparison: because users are split at random and measured over the same period, differences in the metric can be attributed to the variant rather than to seasonality, traffic mix, or chance.

![A/B testing: a randomized splitter sends half of live user traffic to Variant A (control) and half to Variant B (treatment), both served in the same time window; per-user metrics feed an experiment-analysis panel that compares a primary metric against guardrails and promotes the winning variant to 100% of users.](/assets/img/approaches/ab-testing.webp)

*Both variants run at the same time on a random, even split, so the measured difference reflects the change itself — and the variant that wins the primary metric without breaching its guardrails is promoted to everyone.*

## How It Works
- Define one primary success metric and the guardrail metrics that must not regress before the test starts.
- Randomly assign each user to control or a treatment, keeping assignment sticky so a user always sees the same variant.
- Serve the variants concurrently and log the metric per user; calculate the required sample size up front.
- When the sample reaches statistical power, run a significance test, promote the winner, and remove the losing variant.

## Failure Modes
- Peeking: stopping the test the moment it looks significant inflates false positives, so a real-looking win fails to replicate.
- Underpowered tests: too little traffic or too short a run reads noise as a result, and the "winner" is chance.
- Metric myopia: optimizing a narrow metric (clicks) while a guardrail (revenue, retention) quietly regresses ships a net-negative change.

## Variants and Related Tactics
- Canary deployment also splits live traffic between versions, but it gates on operational health (errors, latency) to release safely — A/B testing gates on a business or user metric to learn which variant is better.
- Feature flags are the delivery mechanism both share: they route users to variants inside one running version.
- Multivariate testing varies several factors at once to measure their interactions, at the cost of needing far more traffic.
- Interleaving compares ranking variants within a single user's result list, reaching significance with less traffic than A/B for search and recommendation.

## References
- [Trustworthy Online Controlled Experiments](https://experimentguide.com/) — Kohavi, Tang & Xu ([full citation](/references/#kohavi2020trustworthy))
- [Practical Guide to Controlled Experiments on the Web](https://doi.org/10.1145/1281192.1281295) — Kohavi, Henne & Sommerfield (KDD 2007)
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
