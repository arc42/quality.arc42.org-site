---
layout: approach
title: "Manage Event Arrival"
aka: [Service-Level Agreement]
tags: [efficient, reliable]
supported_qualities: [latency, resource-efficiency, energy-efficiency, stability]
supported_qualities_notes:
  latency: "Capping arrival keeps queues short, so per-event latency stays predictable instead of climbing as load builds."
  resource-efficiency: "Accepting fewer events per interval means less work, freeing CPU, memory, and I/O for the load that matters."
  energy-efficiency: "Doing less work when the inflow is capped directly lowers energy draw, the same lever used for performance."
  stability: "Bounding the input rate prevents overload, keeping the system inside the operating range where its behavior stays stable."
tradeoffs: [throughput, availability]
tradeoff_notes:
  throughput: "An arrival cap is a hard ceiling. A legitimate burst the system could actually absorb is still refused once it crosses the agreed rate, so spare capacity sits idle unless the rate is renegotiated or made adaptive."
  availability: "Sources whose events exceed the cap are rejected or delayed; from their side the service looks unavailable. Size the rate against real load patterns, or the cap sheds valid traffic and pushes back-pressure onto producers."
intent: "Cap or shape the rate at which events reach a component, so it only accepts work it can serve within its operating range."
mechanism: "Agree a maximum arrival rate with each event source — often as a service-level agreement — and pace, batch, or reject events at the boundary so the inflow stays at or below that rate."
applicability: "Use when event sources are known and contractable, and an agreed input ceiling keeps the system efficient and stable. Skip when arrival is intrinsically unbounded or anonymous — public internet traffic, DDoS — where edge rate limiting or admission control fits better than a negotiated rate."
related_requirements: [handle-sudden-increase-in-traffic, respond-to-15000-requests-per-workday, reduce-energy-consumption-with-new-version]
related_requirements_notes:
  handle-sudden-increase-in-traffic: "Capping or shaping arrival is a traffic-management response to a surge: shed or pace excess so accepted requests still meet their latency target."
  respond-to-15000-requests-per-workday: "Aligning the agreed arrival rate with sustained capacity keeps the inflow within the system's rate budget across the workday."
  reduce-energy-consumption-with-new-version: "Shaping arrival so the system does less work per interval lowers energy use, contributing to the per-version reduction target."
permalink: /approaches/manage-event-arrival
---

Manage Event Arrival is a control-resource-demand tactic. Rather than scaling to meet whatever load arrives, the system limits how much load is allowed to arrive. Each source agrees to a maximum rate, and the boundary holds the inflow to it.

The classic realization is a service-level agreement (SLA) with an upstream producer that caps the events per second it may send. The tactic shapes the input contract, not how an admitted event is processed.

![Event pipeline: events flow from sources through a bounded queue to a processing component. Manage Event Arrival caps the inflow at the source side; Limit Event Response caps the processing rate between the queue and the component, queuing or dropping the excess.](/assets/img/approaches/event-rate-tactics.svg)

## How It Works
- Characterize each source's arrival pattern — average rate, burst size, and peak.
- Agree a ceiling per source, as an SLA or a producer-side pacing limit.
- At the boundary, admit events up to the ceiling and pace, batch, or reject the excess.
- Where the source cooperates, push the limit upstream so surplus events are never generated — saving the most work.

## Failure Modes
- A ceiling below real demand sheds valid traffic; rejected producers retry, amplifying load.
- A ceiling above sustainable capacity defeats the tactic — the system still overloads when sources burst together.
- Per-source caps alone let aggregate arrival across many in-limit sources exceed capacity.

## Verification
- Load-test at the agreed ceiling; confirm p99 latency holds within target while inflow sits at the cap.
- Drive arrival past the ceiling and assert the excess is paced or rejected, never silently dropped.
- Monitor accepted-versus-offered rate in production; a persistent gap signals a mis-sized cap.

## Variants and Related Tactics
- Limit Event Response caps the processing rate once events have arrived — the response side of the same problem.
- Rate Limiting (Throttling) caps at an intermediary for anonymous or uncontractable sources.
- Bound Queue Sizes caps the buffer behind the boundary rather than the arrival rate itself.

## References
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
