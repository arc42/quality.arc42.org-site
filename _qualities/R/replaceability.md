---
title: Replaceability
tags: [operable, flexible]
related:
  [
    installability,
    analysability,
    operability,
    deployability,
    interchangeability,
    portability,
    flexibility,
    independence,
    modifiability,
    compatibility,
  ]
standards: [iso25010]
permalink: /qualities/replaceability
---

>Capability of a product to replace another specified product for the same purpose in the same environment
>
>[ISO-25010:2023](/references/#iso-25010-2023)

<hr class="with-no-margin"/>

>* Replaceability can include installability and adaptability.
>* Replaceability will reduce lock-in risk, so that other software products can be used in place of the present one, for example by the use of standardized file formats.
>
>[ISO-25010:2023](/references/#iso-25010-2023)

<hr class="with-no-margin"/>

### Replaceability, portability and interchangeability

The three are routinely confused, although they differ in *what* moves:

| Quality | What changes | What stays |
|:--- |:--- |:--- |
| [Portability](/qualities/portability) | the environment — platform, operating system, infrastructure | the product |
| **Replaceability** | the product | the environment and the purpose it serves |
| [Interchangeability](/qualities/interchangeability) | a component inside the product | the surrounding system and its behaviour |

In ISO/IEC 25010:2023, replaceability is a sub-characteristic of [Flexibility](/qualities/flexibility), which replaced the former *Portability* characteristic.

### Lock-in as an architectural concern

Lock-in is what low replaceability costs you: a supplier can raise prices, deprecate an interface, degrade a capability, or become unavailable for legal or geopolitical reasons, and the system has no affordable answer. The concern is old — mainframes, database engines, message brokers, cloud platforms — and it recurs with every new class of infrastructure.

The current instance is the **model provider** of AI-enabled systems. Swapping one large language model for another is a replaceability problem with the usual shape and two unusual twists:

- Provider-specific APIs, SDKs and authentication can be isolated behind an adapter, the way any external system can.
- Capability and behaviour cannot. Prompts, tool-calling conventions, context limits and output formats are tuned to one model, and an alternative can be *interface-compatible while behaving differently*. Equivalence therefore has to be established empirically, by running the evaluation suite against the candidate, rather than asserted from the interface.

Replaceability is not free, and rarely worth maximizing: an abstraction wide enough to cover every provider tends to expose only their common denominator. The design decision is how much of the current provider's advantage to trade for how much exit optionality — and that trade-off belongs in an architecture decision record, stated as a requirement with a measurable switching cost.

See [Swappable LLM Provider](/requirements/swappable-llm-provider) for one way to specify it.
