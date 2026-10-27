---
layout: approach
title: "Dead Man's Switch"
tags: [safe, operable]
aka: [Vigilance Control, Hold-to-Run, Confirmed Commit]
supported_qualities: [safety, fail-safe, controllability, user-error-protection, recoverability]
supported_qualities_notes:
  safety: "An incapacitated or absent operator cannot keep confirming, so the hazardous operation stops instead of running on uncontrolled."
  fail-safe: "Silence is the trigger: a crashed client, a lost link, and an absent operator all lead to the same predefined safe state."
  controllability: "A person stays the authority over continuation; the system never extends a hazardous operation on its own initiative."
  user-error-protection: "A remote change that locks the operator out reverts by itself, because the locked-out operator cannot send the confirmation."
  recoverability: "Expiry restores the last confirmed configuration automatically, without console access or manual rollback steps."
tradeoffs: [usability, availability, operability]
tradeoff_notes:
  usability: "Periodic confirmation adds workload and interrupts the main task. Over long shifts operators habituate and acknowledge by reflex, so the switch proves presence rather than attention; randomised intervals or task-linked confirmations counter this at the price of more friction."
  availability: "Every missed confirmation stops the operation, whether or not the operator was attentive: a train brakes to a standstill, a line halts, a valid change reverts. Frequent nuisance stops cost throughput and push teams to lengthen the interval or bypass the switch."
  operability: "The confirmation must come from the accountable party, so a fully automated pipeline cannot use the switch as-is. A script that confirms its own change defeats the tactic; teams need an independent health check or a human in the loop."
intent: "Keep a hazardous operation or provisional change in force only while a responsible party keeps confirming it; any lapse ends in a safe state."
mechanism: "Each deliberate confirmation resets a bounded timer held by an independent enforcer. A warning precedes expiry; on expiry the enforcer stops the operation or reverts the change to the last confirmed state, using only local means, so it works even when the confirmer's channel is gone."
applicability: "Use when an unattended hazardous operation causes harm, or when a remote change can cut off the person applying it (firewall rules, network configuration, firmware). Skip for fully automated processes without an accountable confirmer, and where stopping abruptly is more dangerous than continuing."
related: [watchdog-supervision, fail-safe-defaults, safety-interlocks]
related_notes:
  watchdog-supervision: "Both act on a missing periodic signal: the watchdog on the component's own heartbeat, the dead man's switch on the accountable party's confirmation."
  fail-safe-defaults: "A dead man's switch is one trigger for a fail-safe default: an expired confirmation moves the system into its predefined safe state."
  safety-interlocks: "Interlocks check preconditions before a hazardous operation starts; a dead man's switch keeps checking for the operator while it runs."
related_requirements: [fleet-ota-updates-with-safe-rollback]
related_requirements_notes:
  fleet-ota-updates-with-safe-rollback: "Trial boot with self-confirmation delivers the automatic rollback when an updated device never confirms its own health."
permalink: /approaches/dead-mans-switch
---

A dead man's switch keeps a hazardous operation or a risky change in force only while a responsible party keeps confirming it. Each confirmation arms a timer; on expiry the system stops or reverts to the last confirmed state. Silence, incapacity, a crashed client, and a lost connection all end safe.

It reverses the burden of proof of [Watchdog Supervision](/approaches/watchdog-supervision): a watchdog continues until it detects a failure; a dead man's switch stops unless someone vouches for continuation. The confirmer is the party accountable for the operation — driver, machine operator, engineer applying a remote change — not the component doing the work.

![Timeline: each confirmation resets a timer. After the last confirmation the timer keeps rising, crosses a warning level, and on expiry the enforcer moves the system into the safe state or restores the last confirmed configuration.](/assets/img/approaches/dead-mans-switch.svg)

## How It Works

- Define the fallback per operation: stop the motion, cut the drive, or restore the previous configuration.
- Size the interval to how long the hazard may run unattended — seconds for machinery, minutes for a remote change.
- Make each confirmation a deliberate act an absent person cannot produce: a pedal, a button, a confirm command.
- Warn before expiry, so attentive operators confirm in time.
- An independent enforcer executes the fallback locally — brake controller, safety relay, configuration daemon.
- Remote changes apply provisionally with a scheduled rollback and commit only on explicit confirmation.

## Failure Modes

- Operators defeat the switch — a weight on the pedal, a confirming script — and the operation runs unattended.
- Confirmation becomes a reflex, proving presence, not attention.
- Intervals too short for the task cause nuisance stops, which invite bypasses.
- Fallback and confirmation share one channel, so a lost link leaves an unconfirmed change in force.
- The fallback is unsafe in context, e.g. a rollback reverting a security fix.
- A startled operator clamps the control instead of releasing it.

## Verification

- Lapse test: withhold confirmation; the fallback completes within interval + warning + actuation tolerance (e.g. `30 s + 5 s + 1 s`).
- Channel-loss test: drop the confirmer's session mid-change; the enforcer still reverts locally.
- Revert fidelity: after expiry, the running configuration equals the last confirmed one.
- Defeat check: zero sessions with machine-regular confirmation timing.
- Nuisance-stop rate below an agreed threshold (e.g. `< 1` per 100 operating hours).

## Variants and Related Tactics

- Rail vigilance control: a missed acknowledgement triggers a warning, then the emergency brake.
- Three-position enabling switches stop on release *and* on full squeeze, countering the panic grip.
- Confirmed commit (RFC 6241) rolls back remote changes that cut off the operator.
- Trial boot: new firmware confirms its own health, or the bootloader falls back to the previous image.
- Leases apply the same expiry to machine authority (locks, leadership) — a distributed-coordination tactic.

## References

- [RFC 6241: Network Configuration Protocol (NETCONF), §8.4 Confirmed Commit Capability](https://www.rfc-editor.org/rfc/rfc6241#section-8.4) — R. Enns, M. Bjorklund, J. Schoenwaelder, A. Bierman (2011)
- [Ironies of Automation](https://doi.org/10.1016/0005-1098%2883%2990046-8) — Lisanne Bainbridge, Automatica 19(6) (1983)
- IEC 60947-5-8: Low-voltage switchgear and controlgear — Three-position enabling switches
- [IEC 61508](/standards/iec-61508) — functional safety of electrical/electronic/programmable electronic safety-related systems
