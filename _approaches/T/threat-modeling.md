---
layout: approach
title: "Threat Modeling"
tags: [secure]
aka: [STRIDE, Attack Trees]
supported_qualities: [risk-identification, securability, confidentiality, integrity, intrusion-prevention]
supported_qualities_notes:
  risk-identification: "Systematic enumeration of attack paths exposes event sequences that put assets at unacceptable risk before code exists."
  securability: "Mapping trust boundaries shows where the design must support distinct access levels and which controls each boundary needs."
  confidentiality: "Data-flow analysis reveals where sensitive data crosses trust boundaries unprotected, so disclosure threats get targeted mitigations."
  integrity: "Tampering analysis at each entry point identifies where the design must verify origin and detect modification."
  intrusion-prevention: "Ranked attack paths show which entry points warrant blocking controls, so prevention effort concentrates where intrusions are credible."
tradeoffs: [cost, maintainability, time-to-market]
tradeoff_notes:
  cost: "Modeling sessions need architects, security expertise, and preparation, and every significant design change adds re-analysis effort. For a low-risk tool, a full workshop costs more than the risk it retires, so scale session depth to the assets at stake."
  maintainability: "Threat registers, assumptions, and mitigation traces become versioned artifacts the team owns. Once the architecture moves on and nobody updates them, a stale model misleads reviews and audits more than no model would."
  time-to-market: "Analysis precedes implementation, so the first release ships later than with a ship-then-patch strategy. Under deadline pressure teams skip the ranking and mitigation steps — exactly the part that produces the value."
intent: "Derive the security controls a system needs by systematically enumerating credible attacks against its assets, entry points, and trust boundaries."
mechanism: "Model assets, actors, data flows, and trust boundaries; apply STRIDE to relevant elements and interactions, or use attack trees to decompose attacker goals; rank threats; choose a disposition; and retain threats, assumptions, decisions, controls, and verification evidence as versioned artifacts."
applicability: "Use when compromise could cause meaningful harm; scale depth to risk. Skip a full workshop for low-risk changes only after recording a no-impact decision. Reassess when assets, actors, privileges, dependencies, exposure, controls, flows, boundaries, or trust assumptions change."
related: [least-privilege, input-sanitization-output-encoding]
related_notes:
  least-privilege: "Threat modeling ranks the paths along which broad permissions amplify damage; least privilege is a mitigation it frequently selects."
  input-sanitization-output-encoding: "The model's entry points mark where untrusted data enters a system — exactly where sanitization and encoding belong."
related_requirements: [avoid-common-vulnerabilities, public-api-intrusion-attempts-blocked, protect-data-by-security-procols]
related_requirements_notes:
  avoid-common-vulnerabilities: "Threat modeling shows where each listed vulnerability class is credible, turning the checklist into boundary-specific design decisions."
  public-api-intrusion-attempts-blocked: "Modeling the API's entry points and abuse paths justifies the brute-force, injection, and deny-mode controls this requirement quantifies."
  protect-data-by-security-procols: "The required review after each major architecture change is the natural trigger for re-running the threat model on patient-data flows."
permalink: /approaches/threat-modeling
---

Most security tactics are controls: least privilege, encryption, input sanitization. Threat modeling answers the prior question: which controls does this system need, at which boundary, against which attacks?

Its durable output is not the workshop diagram but the trace from every ranked threat to an owned disposition and its evidence.

![A data-flow model of a browser calling a payment API across an internet trust boundary, feeding a threat-modeling loop: enumerate threats with STRIDE per element or attack trees per attacker goal, rank by risk, choose dispositions, and trace each to its evidence. Design changes flow back into the model.](/assets/img/approaches/threat-modeling.svg)

## How It Works

- Model the system as data flows between actors, processes, and stores; mark every trust boundary where privilege or trustworthiness changes.
- Enumerate threats per element and interaction with STRIDE — spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege — and decompose high-value attacker goals with attack trees.
- Rank threats by impact and exploitability; give each a disposition: mitigate, remove the flow, transfer, or accept.
- Record threats, assumptions, and decisions under version control; re-model when assets, actors, privileges, dependencies, exposure, or boundaries change.

## Failure Modes

- The model describes last year's architecture: new services and flows stay unexamined.
- Taxonomy-driven sessions find what the taxonomy names; fraud through legitimate features passes every STRIDE category.
- A listed threat counts as handled: the register grows while mitigations stay unbuilt and untested.
- One wrong assumption, such as a trusted internal network, silently deflates an entire threat class.

## Verification

- Coverage: a diff between modeled entry points and the deployed system's routes and listeners yields zero unmodeled endpoints.
- Traceability: 100% of ranked threats have an owner, disposition, rationale, and review trigger; every mitigation links to an implemented control and security test.
- Freshness: the model's last revision postdates the last architecture-changing merge, checked at each release gate.
- Feedback: every penetration-test finding is classified as modeled or missed; each miss opens a re-modeling task.

## Variants and Related Tactics

- Attack trees follow one attacker goal in depth; abuse cases capture business-logic misuse that STRIDE-style taxonomies skip.
- Privacy threat modeling (LINDDUN) targets harms such as linkability and unawareness that occur even when access is authorized.
- Penetration testing observes a running implementation; threat modeling examines the design first. Zero-trust architecture is one possible response, not the analysis.

## Mini Example

One row of a threat register, traced end to end:

```text
Boundary:  internet → payment API (browser checkout)
Threat:    tampering — client manipulates the price field in the order payload
Rank:      high (direct financial impact, trivial to attempt)
Decision:  mitigate — server recomputes the price; the client value is display-only
Test:      integration test posts a manipulated price, expects rejection + alert
```

## References

- [Threat modeling — definition](https://csrc.nist.gov/glossary/term/threat_modeling) — NIST CSRC Glossary
- [*Threat Modeling: Designing for Security*](https://shostack.org/books/threat-modeling-book) — Adam Shostack (Wiley, 2014)
- [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/) — Braiterman et al.
- [Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) — OWASP
- [Attack Trees](https://www.schneier.com/academic/archives/1999/12/attack_trees.html) — Bruce Schneier (Dr. Dobb's Journal, 1999)
