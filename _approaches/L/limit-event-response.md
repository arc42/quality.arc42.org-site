---
layout: approach
title: "Limit Event Response"
tags: [efficient, reliable]
supported_qualities: [stability, time-behaviour, resource-efficiency, energy-efficiency]
supported_qualities_notes:
  stability: "Processing at a bounded rate keeps the system inside its stable operating range even when arrivals spike past capacity."
  time-behaviour: "A fixed maximum response rate makes processing time predictable for the events that are serviced."
  resource-efficiency: "Capping work per interval bounds CPU, memory, and I/O regardless of how fast events arrive."
  energy-efficiency: "Servicing fewer events per interval under load lowers the energy spent on surplus work."
tradeoffs: [latency, availability]
tradeoff_notes:
  latency: "Excess events wait in a queue rather than process at once, so under sustained overload queued events see growing delay — the bounded rate trades per-event latency for a predictable, survivable processing rate."
  availability: "When the queue fills and overflow is discarded, those callers get no response and the service looks unavailable to them; the drop policy must separate sheddable events from ones that must not be lost."
intent: "Process arriving events only up to a set maximum rate, queuing or discarding the excess, so processing stays predictable under overload."
mechanism: "Place a rate limiter and a bounded queue in front of the handler. Service events up to the configured rate, hold the surplus in the queue, and shed or back-pressure once the queue is full."
applicability: "Use when event arrival is outside your control and bursts can outrun capacity. Skip when every event must be processed and none may be delayed or dropped, where adding capacity fits better than bounding the rate."
related_requirements: [handle-sudden-increase-in-traffic, respond-to-15000-requests-per-workday, reduce-energy-consumption-with-new-version]
related_requirements_notes:
  handle-sudden-increase-in-traffic: "Servicing at a sustainable rate while queuing the surge lets accepted requests keep meeting their latency target during the spike."
  respond-to-15000-requests-per-workday: "Bounding the response rate to sustainable capacity keeps the system inside its daily rate budget without thrashing."
  reduce-energy-consumption-with-new-version: "Processing fewer events per interval under load cuts surplus work, contributing to the per-version energy-reduction target."
permalink: /approaches/limit-event-response
---

Limit Event Response is the response-side sibling of [Manage Event Arrival](/approaches/manage-event-arrival). When you cannot control how fast events arrive, you control how fast you respond to them: process up to a fixed maximum rate, and hold or shed the rest.

A bounded queue absorbs short bursts while a rate limiter drains it at the set rate. Processing stays predictable under overload — at the cost of latency for queued events, or loss when the queue overflows.

![Event pipeline: events flow from sources through a bounded queue to a processing component. Manage Event Arrival caps the inflow at the source side; Limit Event Response caps the processing rate between the queue and the component, queuing or dropping the excess.](/assets/img/approaches/event-rate-tactics.svg)

## How It Works
- Set a maximum response rate the handler can sustain without degrading.
- Buffer arriving events in a bounded queue ahead of the handler.
- Drain the queue at the set rate so events wait their turn, not overwhelm the handler.
- When the queue fills, apply a policy: shed lowest-priority events, drop the newest, or back-pressure the source.

## Failure Modes
- A response rate set above sustainable capacity defeats the tactic — the handler still degrades under load.
- An oversized queue hides overload and inflates latency until events time out.
- A blind drop policy sheds critical events alongside disposable ones.

## Verification
- Drive arrivals at 2–3× the response rate; confirm throughput holds at the set rate and latency stays within target.
- Fill the queue and assert the overflow policy fires as configured — shed, drop, or back-pressure — with no silent loss.
- Monitor queue depth and shed count in production; sustained growth signals an under-provisioned rate.

## Variants and Related Tactics
- Manage Event Arrival caps the inflow at the source instead of the response — use it when sources are contractable.
- Rate Limiting (Throttling) places the same cap at an intermediary, per client.
- Bound Queue Sizes fixes the buffer so shedding decisions stay explicit.

## References
- [Software Architecture in Practice](https://www.sei.cmu.edu/library/software-architecture-in-practice-fourth-edition/) — Bass, Clements & Kazman ([full citation](/references/#bass2021software))
