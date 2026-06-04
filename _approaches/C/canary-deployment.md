---
layout: approach
title: "Canary Deployment"
tags: [operable, reliable]
supported_qualities: [releasability, deployability, recoverability, availability]
supported_qualities_notes:
  releasability: "Traffic shifts in graded steps gated on live metrics, so exposure stays controlled and decoupled from deploy."
  deployability: "The new version runs in production beside the stable one, validated against real user traffic before full rollout."
  recoverability: "Aborting a bad release routes the small canary share back to stable in seconds, with no rebuild or redeploy."
  availability: "Request-path failures from a faulty release stay confined to the canary slice; the majority of users remain on the proven version."
tradeoffs: [code-complexity, cycle-time]
tradeoff_notes:
  code-complexity: "Canary needs traffic-splitting at the router, automated comparison of canary-versus-baseline metrics, and — because canary and stable share one datastore — expand/contract schema migrations that stay compatible across both versions at once. The step sizes, thresholds, and bake windows are configuration the team owns and tunes long after the release."
  cycle-time: "Each release shifts traffic in steps with a bake-and-observe window at every stage, so a change takes minutes to hours to reach all users instead of an instant flip. Shortening the windows to release faster trades away the early-warning signal canary exists to provide."
intent: "Release a new version to a small slice of production traffic first, then widen exposure step by step only while live metrics stay healthy."
mechanism: "Deploy the new version alongside the stable one and route a small percentage of traffic to it. Compare the canary's error, latency, and saturation metrics against the stable baseline. If they hold, raise the share in stages to 100%; if they regress, route all traffic back."
applicability: "Use when you have enough production traffic to read canary metrics quickly, metrics labeled by version so canary and baseline separate cleanly, and a router that can split traffic by percentage. Skip when traffic is too low for a timely signal, when releases must be all-or-nothing, or when canary and stable cannot share state safely."
related_requirements: [low-change-failure-rate, available-7-24-99, production-anomalies-detectable-within-2-minutes]
related_requirements_notes:
  low-change-failure-rate: "Catching a regression on a small traffic slice and aborting before full rollout keeps deployment-caused failures from reaching most users."
  available-7-24-99: "Confining a faulty release to the canary slice keeps the bulk of traffic on the proven version, protecting the uptime objective."
  production-anomalies-detectable-within-2-minutes: "Promotion gates on fast anomaly detection — canary metrics surfaced within minutes decide whether to widen the rollout or abort it."
permalink: /approaches/canary-deployment
---

Canary deployment releases a new version to a small fraction of production traffic before exposing everyone to it. The new version runs beside the stable one, and a router sends it a few percent of requests. Automated analysis compares the canary's health against the stable baseline: if it holds, traffic shifts over in stages until the canary serves everyone; if it regresses, all traffic returns to the stable version and the canary is withdrawn. That rollback is immediate for traffic; restoring correctness also depends on the canary's writes to shared state staying compatible.

![Canary deployment: a router sends most live traffic to the stable v1 instances and a small share to the canary v2; automated analysis compares canary metrics against the baseline and promotes the rollout or routes traffic back.](/assets/img/approaches/canary-deploy.webp)

## How It Works
- Deploy the new version beside the stable one; both read and write the same datastore.
- Configure the router or service mesh to send a small share — often 1–5% — of traffic to the canary.
- Compare canary error rate, latency, and saturation against the stable baseline over a fixed bake window.
- Raise the canary's share in stages while metrics hold; route all traffic back to stable on any regression.

## Failure Modes
- Low traffic or a tiny canary share yields too few samples, so the analysis reads noise as signal — or the bake window stretches for hours.
- The canary and stable versions share a datastore, and an incompatible schema change from the canary corrupts data the stable version reads.
- Session-affinity gaps route a user between versions mid-flow, exposing inconsistent behaviour.

## Verification
- A seeded bad build (e.g. an injected 5% error rate) trips automated canary analysis and rolls back before the share passes the first step.
- The canary collects enough samples before each promotion step, and the analysis compares normalized rates or an equal-sized baseline cohort — not raw fleet totals — so the decision has statistical power.
- A rollback drill confirms traffic returns to the stable version within the recovery-time objective (e.g. under 60 s).

## Variants and Related Tactics
- Blue-green deployment switches all traffic at once rather than in graded steps — simpler, but with no progressive exposure.
- Feature flags gate a release per user or cohort inside one running version, complementing traffic-level canarying.
- Shadow traffic mirrors live requests to the new version without serving its responses, validating behaviour at zero user risk.

## References
- [Canary Release](https://martinfowler.com/bliki/CanaryRelease.html) — Danilo Sato
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) — Michael Nygard ([full citation](/references/#nygard2018release))
- [Accelerate](https://itrevolution.com/product/accelerate/) — Forsgren, Humble & Kim ([full citation](/references/#forsgren-accelerate))
