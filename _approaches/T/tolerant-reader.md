---
layout: approach
title: "Tolerant Reader"
tags: [flexible, reliable, operable]
aka: [Postel's Law, Robustness Principle]
supported_qualities: [backward-compatibility, interoperability, robustness, evolvability]
supported_qualities_notes:
  backward-compatibility: "Consumers built against an older schema keep working when producers add fields, elements, or enum values."
  interoperability: "Extracting only the needed elements lets one consumer work with many producers whose payloads differ in detail."
  robustness: "Unknown fields, extra elements, or reordered content leave the consumer functioning instead of failing the whole message."
  evolvability: "Producers extend schemas without coordinating a lockstep upgrade of every consumer, so contracts evolve at low cost."
tradeoffs: [correctness, maintainability]
tradeoff_notes:
  correctness: "A renamed or repurposed field no longer raises a parse error — the reader substitutes its default and processes wrong data silently. Contract drift then surfaces downstream, in reports or invoices, instead of at the integration boundary where a strict parser would have stopped it."
  maintainability: "Every consumer owns a hand-curated subset model, its defaults, and drift monitoring instead of one generated full-schema binding. The tolerated field set must be documented and contract-tested per consumer, or it decays into guesswork about what producers may still change."
intent: "Read only what you need from a message and ignore the rest, so producer-side schema changes leave consumers working."
mechanism: "Consumers bind only the fields they use — a subset DTO with unknown properties ignored, or name/path extraction — apply explicit defaults for absent optional elements, validate the extracted values, and treat an unknown value in a read enum field as an error."
applicability: "Use where producers and consumers evolve independently: public APIs, event streams, third-party integrations, long-lived document formats. Skip where the contract is the protection and every deviation must fail loudly — financial postings, safety commands, security-sensitive input."
related: [open-host-service, event-driven-architecture]
related_notes:
  open-host-service: "The host publishes a stable contract for many consumers; tolerant readers on the consumer side absorb the additive changes that contract still permits."
  event-driven-architecture: "Consumers that read events tolerantly let producers extend payloads without a lockstep upgrade of every subscriber."
related_requirements: [crm-data-synchronization]
related_requirements_notes:
  crm-data-synchronization: "The mapping layer keeps synchronizing when a connected CRM adds fields to its payloads, instead of failing every sync run."
permalink: /approaches/tolerant-reader
---

In 1980 Jon Postel wrote into the TCP specification: be conservative in what you do, be liberal in what you accept from others. Tolerant Reader applies this robustness principle to integration. A consumer reads only the fields it uses, ignores the rest, and treats absent optional data as a case to handle, not an error. Strict schema binding does the opposite, turning every producer-side addition into a consumer-side parse failure.

Tolerance applies to structure the consumer never reads, not to values it does read. Producers still owe additive-only discipline, pinned down by consumer-driven contract tests.

![Tolerant Reader: a producer's payload grows from four fields to six; the tolerant reader binds only the four fields it uses, ignores the additions, and keeps working — no consumer deployment needed. A new value in an enum field it does read fails loudly instead of defaulting silently.](/assets/img/approaches/tolerant-reader.svg)

## How It Works

- Bind only a subset DTO of the fields the consumer uses; configure the deserializer to ignore unknown properties (e.g. Jackson's ignoreUnknown).
- Path extraction (JSON pointer, XPath) serves the same end for document-oriented formats.
- An unknown value in an enum field the consumer does read is an error: reject, alert, or route to a manual fallback queue — never a silent default.
- Apply explicit defaults for absent optional elements; fail only when required data is missing or invalid.
- Validate the extracted values — types, ranges, invariants — not the document structure around them.

## Failure Modes

- A producer renames a field: the reader substitutes its default and processes wrong data without an error; drift surfaces downstream.
- A new enum value falls back to a default: a `PARTIALLY_REFUNDED` payment reads as unpaid, and refund logic misfires.
- Tolerance masks producer bugs: malformed payloads that a strict parser would reject flow into the domain.

## Verification

- Contract tests run each consumer against current and previous producer schemas; all pass (CI gate per release).
- Unknown-field injection passes with zero errors; an injected unknown enum value lands in the fallback path, never a silent default.
- Production monitors the default-substitution rate per field; an alert past a threshold (e.g. > 1% of messages) signals contract drift.

## Variants and Related Tactics

- **Schema registry with compatibility rules** — rejects breaking producer changes at publish time, complementing consumer-side tolerance with a producer-side gate.

## Example

A payment provider's webhook initially sends `id`, `amount`, `currency`, and `status`. The shop's reader binds exactly those four fields to a small DTO, unknown properties ignored. Over two years the provider adds `fee_breakdown`, `risk_score`, and a nested `metadata` object — the shop deploys nothing. When the provider later renames `status` to `state`, a breaking change, the contract tests catch it before production does.

## References

- [TolerantReader](https://martinfowler.com/bliki/TolerantReader.html) — Martin Fowler, bliki, 2011
- [RFC 761: Transmission Control Protocol](https://www.rfc-editor.org/rfc/rfc761) — Jon Postel (ed.), IETF, 1980 — origin of the robustness principle
- [RFC 9413: Maintaining Robust Protocols](https://www.rfc-editor.org/rfc/rfc9413) — Martin Thomson, David Schinazi, IETF, 2023 — a critical counterpoint: tolerance without active protocol maintenance ossifies ecosystems
