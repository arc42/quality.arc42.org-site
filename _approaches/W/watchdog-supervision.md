---
layout: approach
title: "Watchdog Supervision"
tags: [safe, reliable]
supported_qualities: [availability, fault-tolerance, recoverability, self-healing, mean-time-to-recovery, safety]
supported_qualities_notes:
  availability: Hung or unresponsive processes are detected and restarted automatically, reducing the window of unavailability.
  fault-tolerance: The system tolerates process-level failures by replacing the failed component rather than allowing the fault to persist.
  recoverability: Automated restart returns the supervised component to a functional state without waiting for human intervention.
  self-healing: The watchdog closes the detect-restart loop autonomously, making the system self-correcting for a class of failures.
  mean-time-to-recovery: Detection and restart happen on a fixed timer, bounding recovery time to a predictable interval.
  safety: In safety-critical systems, a missed heartbeat triggers a transition to a safe state, preventing a hung controller from causing harm.
tradeoffs: [availability, determinism, observability, code-complexity]
tradeoff_notes:
  availability: False-positive restarts caused by transient load spikes or GC pauses create unnecessary downtime and can trigger cascading restarts.
  determinism: In-flight work is lost on forced restart unless the supervised component checkpoints state, making behavior less predictable under failure.
  observability: The watchdog detects that a process is unresponsive but not why — root-cause diagnosis requires separate pre-restart telemetry capture.
  code-complexity: Supervised components must support clean shutdown, state checkpointing, and startup-after-restart semantics, adding implementation effort.
related_requirements: [server-fails-operation-without-downtime, unavailability-max-2-minutes, production-anomalies-detectable-within-2-minutes]
related_requirements_notes:
  server-fails-operation-without-downtime: Watchdog restart keeps the system operational when a server process hangs or crashes.
  unavailability-max-2-minutes: A watchdog with a short heartbeat interval bounds the detection-to-recovery window within tight availability targets.
  production-anomalies-detectable-within-2-minutes: Periodic health probes detect anomalies within the configured heartbeat interval.
intent: "Detect unresponsive or hung components through an independent monitor and trigger an automated restart or safe-state transition, bounding recovery time without relying on human intervention."
mechanism: "An independent supervisor process periodically checks the health of a monitored component — via heartbeat, liveness probe, or watchdog timer — and if the component fails to respond within the configured timeout, the supervisor initiates a restart, failover, or safe-state transition and raises an alert."
applicability: "Use for any long-running process where an undetected hang is worse than a restart — backend services, embedded controllers, infrastructure daemons, container orchestration. Avoid for short-lived batch jobs where the orchestrator already handles completion and retry, or where the restart cost (state loss, connection draining) exceeds the cost of brief unavailability."
permalink: /approaches/watchdog-supervision
---

Watchdog supervision places an independent monitor alongside a supervised component. The monitor expects a periodic signal — a heartbeat, a liveness-probe response, or a timer reset — and if that signal stops arriving within a configured timeout, the monitor concludes the component is hung and takes corrective action: restart the process, fail over to a standby, or transition to a safe state.

The pattern is fundamental to both safety-critical systems (hardware watchdog timers in embedded controllers that cut power or engage brakes on timeout) and cloud-native infrastructure (Kubernetes liveness probes that restart unresponsive pods). The key property is independence: the monitor runs in a separate failure domain from the supervised component, so it can act even when the component is completely unresponsive.

## How It Works

- The supervised component periodically sends a heartbeat or resets a watchdog timer to prove it is alive and making progress.
- The supervisor — a separate process, sidecar, orchestrator, or hardware timer — monitors the signal and starts a countdown on each expected interval.
- If the countdown expires without a signal (missed heartbeat), the supervisor declares the component unresponsive and initiates the configured action: process restart, container replacement, failover to a replica, or safe-state transition.
- Before forcing the restart, the supervisor optionally captures diagnostic state (thread dump, heap snapshot, last log lines) to support root-cause analysis.
- After restart, the supervisor monitors the component through a startup grace period before resuming normal heartbeat checks, avoiding restart loops during slow initialization.

## Failure Modes

- Heartbeat interval too short relative to normal processing variance (GC pauses, I/O bursts) causes false-positive restarts that reduce availability instead of improving it.
- Restart loops: the supervised component fails immediately after restart, the watchdog restarts it again, and the cycle repeats without recovery — an escalation strategy (backoff, circuit-break, alert) is missing.
- The watchdog itself fails or hangs, leaving the supervised component unmonitored — the monitor must be simpler and more reliable than the component it supervises.
- Restarts without pre-restart diagnostic capture destroy the evidence needed to find the root cause, turning a recoverable hang into a recurring mystery.
- Shared-fate deployment: the watchdog runs on the same host or in the same process as the supervised component, so a host-level failure takes out both.

## Verification

- Hang injection: pause the supervised component (for example `SIGSTOP` on Linux, simulated deadline miss on an embedded controller) and verify the watchdog detects the hang and triggers restart within the configured timeout plus a tolerance margin (for example timeout `30 s` + margin `5 s`).
- False-positive test: under peak load with realistic GC or I/O latency, verify zero spurious restarts over a representative test window (for example 24 hours of load-test traffic).
- Restart-loop protection: force the supervised component to crash immediately after startup and verify the watchdog applies backoff or stops restarting after the configured attempt limit (for example 3 attempts within 5 minutes) and escalates to an alert.
- Diagnostic capture: after a watchdog-triggered restart, verify that pre-restart diagnostics (thread dump, last N log lines) are persisted and accessible.
- Independence validation: kill the host or VM running the supervised component and verify the watchdog (running in a separate failure domain) still detects the failure and triggers failover.

## Variants and Related Tactics

- Hardware watchdog timers in embedded and safety-critical systems reset a physical timer; expiry triggers a hardware-level reset or safe-state relay.
- Kubernetes liveness probes are software watchdogs: the kubelet periodically checks an HTTP endpoint, TCP socket, or exec command and restarts the container on repeated failures.
- Erlang/OTP supervisors implement hierarchical watchdog trees with configurable restart strategies (one-for-one, one-for-all, rest-for-one).
- Heartbeat / ping-echo probes are the active variant where the supervisor sends a probe and expects a response, rather than passively waiting for a signal from the supervised component.
- Escalating restart increases the scope of the restart (process → container → node → zone) if repeated restarts at the current level do not restore health.

## References

- [IEC 61508: Functional Safety of E/E/PE Systems](https://www.iec.ch/functional-safety) — defines watchdog timer requirements for safety-instrumented systems
- [Kubernetes: Configure Liveness, Readiness and Startup Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) — the canonical reference for container-level watchdog probes
- [Erlang/OTP Supervisor Behaviour](https://www.erlang.org/doc/system/sup_princ.html) — hierarchical supervision trees with configurable restart strategies
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
