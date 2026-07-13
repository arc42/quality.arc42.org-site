---
layout: approach
title: "Reconciliation Loops"
tags: [operable, reliable]
aka: [Controller Pattern, Reconciler Pattern]
supported_qualities: [autonomy, recoverability, drift-detectability, operability]
supported_qualities_notes:
  autonomy: "The controller restores declared intent without an operator by detecting drift and applying corrective actions until observed state converges."
  recoverability: "After a managed resource fails or disappears, repeated reconciliation recreates or repairs it from the durable desired-state description."
  drift-detectability: "Every comparison exposes the delta between declared and observed state, making configuration and runtime drift explicit."
  operability: "Operators change one declarative specification while the controller handles ordering, retries, and repeated correction across managed resources."
tradeoffs: [eventual-consistency, code-complexity, resource-utilization]
tradeoff_notes:
  eventual-consistency: "Desired and observed state differ while actions run or observations lag. Callers must tolerate the convergence window; a controller that needs five minutes to repair drift cannot satisfy a requirement that assumes immediate consistency."
  code-complexity: "Each controller needs idempotent actions, ownership rules, retry and backoff, status reporting, and safe handling of partial progress. Interacting controllers multiply the state space and can turn a simple deployment workflow into a distributed system."
  resource-utilization: "Polling, repeated reads, and unsuccessful corrections consume API, network, and compute capacity. A tight retry loop during a dependency outage can overload the control plane and slow every controller sharing it."
intent: "Continuously drive observed system state toward declared intent, so failures and drift trigger automatic correction instead of manual repair."
mechanism: "Store desired state durably; a level-triggered controller observes current state, computes the delta, and applies idempotent actions. It records status and repeats with backoff until current state matches intent, regardless of missed events, restarts, or partial progress."
applicability: "Use for long-lived resources whose desired state can be declared and observed, especially infrastructure, fleets, policies, and service topology. Skip one-off commands, irreversible side effects without compensating actions, and domains where a human must approve every state transition."
related: [watchdog-supervision]
related_notes:
  watchdog-supervision: "Both restore operation automatically: a watchdog reacts to missed liveness with restart; reconciliation repeatedly compares and corrects the resource's complete state."
related_requirements: [scale-up-in-2-minutes, governance-policy-enforcement, fleet-ota-updates-with-safe-rollback]
related_requirements_notes:
  scale-up-in-2-minutes: "An autoscaling controller observes demand, changes target capacity, and reconciles the serving pool to that target within the two-minute bound."
  governance-policy-enforcement: "A policy controller repeatedly compares active versions across enforcement points and corrects missing or stale deployments within the distribution deadline."
  fleet-ota-updates-with-safe-rollback: "A rollout controller drives devices toward the target version, records progress, and reconciles failures toward the declared rollback state."
permalink: /approaches/reconciliation-loops
---

Imperative automation runs a sequence once. A reconciliation loop keeps asking: what differs between declared intent and reality now? It then makes one correction and asks again.

Because the loop is level-triggered, correctness depends on current state rather than seeing every event. After a restart, a missed notification, or a half-completed action, remaining state becomes the next input to the loop—not a special recovery path.

![A declarative state store supplies desired state to a controller loop. The controller observes managed resources, compares desired and current state, applies idempotent corrections, reports status, and repeats until the states converge.](/assets/img/approaches/reconciliation-loops.svg)

## How It Works

- Store desired state durably and keep controller-written status separate from owner-written intent.
- Reconcile on change notifications and periodic resynchronization, so a missed event delays correction but cannot lose it permanently.
- Compute the smallest correction from current state; make it idempotent.
- Assign each field or resource to one controller.
- Report conditions and retry with bounded backoff until reality matches intent.

## Failure Modes

- Two controllers own the same field and overwrite each other; the resource oscillates and both loops consume their retry budgets.
- A stale observation triggers a correction against superseded state; newer intent is temporarily rolled back.
- An edge-triggered controller misses an event and never revisits the resource, leaving permanent drift.
- Invalid or unreachable desired state causes unbounded retry attempts at maximum backoff, saturating control-plane capacity while status stays unready.

## Verification

- Replica-controller convergence SLO: with target `N`, deleting one instance returns the observed count to `N` within `60 s`.
- Idempotency check: reconciling an already-converged resource twice produces zero external writes and no status change.
- Crash check: stop the controller after its first side effect; after restart it converges without duplicate resources or skipped steps.
- Steady-state signal: failed reconciliations stay below `1%` per 15-minute window; every failure exposes a reason and next retry time.

## Variants and Related Tactics

- The MAPE-K loop separates monitoring, analysis, planning, and execution when adaptation needs richer decisions than a direct state diff.
- GitOps uses a version-controlled declaration as desired state and a reconciliation loop as its enforcement mechanism.
- A watchdog checks liveness and usually restarts. A reconciler checks full state and can create, update, delete, or repair resources.

## References

- [The Vision of Autonomic Computing](https://doi.org/10.1109/MC.2003.1160055) — Jeffrey O. Kephart and David M. Chess (2003)
- [Borg, Omega, and Kubernetes](https://research.google/pubs/borg-omega-and-kubernetes/) — Brendan Burns et al. (2016)
- [Anvil: Verifying Liveness of Cluster Management Controllers](https://www.usenix.org/conference/osdi24/presentation/sun-xudong) — Xudong Sun et al. (OSDI 2024)
