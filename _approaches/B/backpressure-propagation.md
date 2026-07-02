---
layout: approach
title: Backpressure Propagation
aka: [Flow Control]
tags: [reliable]
supported_qualities: [stability, availability, latency, reliability]
supported_qualities_notes:
  stability: "Bounded buffers keep load inside the operating range: overload slows intake instead of pushing the system into runaway queue growth."
  availability: "The pipeline keeps serving at its capacity limit during overload instead of collapsing under runaway queues."
  latency: "Short, bounded queues bound waiting time, so processing delay stays predictable under load instead of growing with queue depth."
  reliability: "No work is silently lost to overflowing buffers: excess is refused explicitly at the edge, where the caller can react."
tradeoffs: [loose-coupling, code-complexity, throughput]
tradeoff_notes:
  loose-coupling: "Consumer state now steers producers at runtime through an explicit control channel. Every intermediary must forward the signal, so stages that messaging deliberately decoupled become operationally coupled again during overload."
  code-complexity: "Each stage needs bounded buffers, a demand or signaling protocol, and a policy for being slowed — buffer, degrade, or reject. Pull-based streaming code is harder to write, test, and debug than fire-and-forget publishing."
  throughput: "Producers run at the slowest stage's pace, and offered load above capacity is delayed or refused at the source. A mis-tuned buffer or an overly eager signal throttles the pipeline below its real capacity."
intent: "Signal overload upstream, stage by stage, so producers slow down at the source before queues grow past collapse."
mechanism: "Bound every buffer between stages. When a buffer fills, the stage signals its upstream neighbor — by demand requests, slowed acknowledgements, or explicit rejection — and the neighbor forwards the pressure until it reaches a component that can pace, degrade, or shed work."
applicability: "Use in pipelines and streaming systems where producers can outpace consumers and every stage is under your control or speaks a pressure-aware protocol. Skip when sources cannot slow down — then shed load explicitly at the edge instead of propagating a signal nobody can honor."
related: [asynchronous-messaging, rate-limiting, limit-event-response]
related_notes:
  asynchronous-messaging: "Queues decouple stages in time, but an unbounded queue only hides overload; bounded queues plus a propagated signal keep the decoupling honest."
  rate-limiting: "Rate limiting caps admission with a static budget at the edge; backpressure adjusts the rate dynamically from live downstream capacity."
  limit-event-response: "Limit Event Response bounds one stage's inflow; backpressure propagation chains that signal upstream so the whole pipeline slows together."
related_requirements: [handle-sudden-increase-in-traffic]
related_requirements_notes:
  handle-sudden-increase-in-traffic: "Propagated slow-down keeps queues bounded through the 300% surge, so the system serves at capacity instead of collapsing past it."
permalink: /approaches/backpressure-propagation
---

In a pipeline, data flows downstream and trouble flows upstream. When one stage slows, its producers keep sending at full rate: queues grow, memory and latency climb, and the failure surfaces far from the actual bottleneck. Backpressure propagation carries an overload signal against the data direction — every stage tells its upstream neighbor how much it can accept, hop by hop, until a component can slow, degrade, or reject at the source.

![Backpressure propagation: data flows from sources through bounded buffers and a processing stage into a slowed data store; a dashed pressure signal travels the opposite way, hop by hop, until the sources pace their intake, degrade fidelity, or reject work at the edge.](/assets/img/approaches/backpressure-propagation.svg)

## How It Works

- Bound every buffer between stages; a full buffer is a signal, not a failure.
- Prefer pull over push: the consumer requests n items, the producer sends at most n — the demand model of Reactive Streams and TCP receive windows.
- Translate pressure across push hops explicitly: slowed acknowledgements, a paused poll loop, or rejection with a retry-after hint.
- At the edge, convert pressure into action: pace intake, degrade fidelity by sampling or batching, or reject with an explicit error.

## Failure Modes

- One unbounded queue mid-pipeline swallows the signal: upstream looks healthy while that queue eats memory toward an out-of-memory crash.
- Rejected producers that retry immediately amplify load exactly when capacity is lowest.
- When pressure reaches a source that cannot slow (sensors, user clicks), a missing shedding policy loses data at an uncontrolled point.
- Tiny buffers plus request cycles deadlock: two stages each wait for the other's demand.

## Verification

- Drive offered load past capacity: goodput plateaus at capacity and memory stays bounded — the load curve flattens, never folds.
- Halve one stage's speed in a chaos test: producers converge to the new pace inside the agreed window, no buffer exceeds its bound.
- Alert on time-at-full per buffer; sustained pressure past its threshold pages before latency breaches the SLO.

## Variants and Related Tactics

- **[Rate Limiting](/approaches/rate-limiting)** — a static admission ceiling at the edge; backpressure adjusts dynamically to live capacity.
- **[Limit Event Response](/approaches/limit-event-response)** — bounds a single stage; propagation chains the signal end to end.
- **[Asynchronous Messaging](/approaches/asynchronous-messaging)** — supplies the queues; consumer lag and bounded topics become the pressure signal.

## Example

A telemetry pipeline moves metrics from thousands of agents through a broker into a stream processor and a time-series store. During store compaction, writes slow: the processor's bounded buffer fills, so it stops pulling from the broker; consumer lag grows, and the agents — seeing slower acknowledgements — switch to coarser sampling. The pipeline runs at the store's pace until compaction finishes, then drains the backlog. No queue grew without bound, and nothing crashed.

## References

- [Release It! Design and Deploy Production-Ready Software (2nd ed.)](https://pragprog.com/titles/mnee2/release-it-second-edition/) — Michael T. Nygard, Pragmatic Bookshelf, 2018 — Back Pressure stability pattern ([full citation](/references/#nygard2018release))
- [Reactive Streams Specification](https://www.reactive-streams.org/) — the demand-based backpressure contract for asynchronous stream processing (2015)
- [RFC 9293: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc9293) — flow control via the receive window, the protocol-level original
- [Site Reliability Engineering, ch. 21 "Handling Overload"](https://sre.google/sre-book/handling-overload/) — Beyer, Jones, Petoff, Murphy (eds.), O'Reilly, 2016
