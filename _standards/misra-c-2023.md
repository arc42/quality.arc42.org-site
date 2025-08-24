---
layout: page_standard
title: "MISRA C - Guidelines for the use of the C language in critical systems"
permalink: /standards/misra-c
standard_id: misra-c
---

MISRA C is a widely adopted set of guidelines (aka "standard") for developing software in the C language, especially for safety‑ and security‑related embedded systems. 
It defines a safer, more predictable subset of C and practices to reduce undefined behavior, increase analyzability, and improve assurance.

Current edition: MISRA C:2023 (Third edition, Second revision), which consolidates and updates MISRA C:2012 and its amendments and corrigenda. 


### Scope and core concepts
- Safer C subset: rules and directives restrict dangerous or ambiguous language features and usage patterns.
- Classification: guidance is categorized as Mandatory, Required, or Advisory; rules are also marked as Decidable or Undecidable and as Single Translation Unit or System level.
- Compliance and deviations: projects can deviate from Required/Advisory items with documented rationale; Mandatory items must always be met. 
  MISRA Compliance:2020 gives the authoritative compliance process.
- Tool support: many guidelines are checkable by static analysis, but there is no official MISRA certification of tools; judgment and review remain essential.

### Quality attributes emphasized

The guidelines enforce a safer subset of C and structured practices that directly support several software qualities:

| Attribute | Relevance in MISRA C |
|:--- |:--- |
| **[Safety](/qualities/safety)** | The primary goal. The rules are designed to prevent undefined behavior and common programming errors that can lead to safety hazards. |
| **[Reliability](/qualities/reliability)** | Enforced by rules that reduce the likelihood of defects and unexpected behavior. |
| **[Maintainability](/qualities/maintainability)** | Promoted through rules that improve code clarity, consistency, traceability, and comprehensibility. |
| **[Flexibility](/qualities/flexibility)** | Addresses portability aspects by avoiding implementation‑defined behavior and reducing compiler-/platform‑specific constructs. |
| **[Security](/qualities/security)** | Many rules that enhance safety also contribute to security by preventing vulnerabilities such as buffer overflows and data corruption. |
| **[Testability](/qualities/testability)** | Indirectly supported by rules that lead to simpler, more modular, and deterministic code, which is easier to test. |
| **[Analyzability](/qualities/analyzability)** | A key goal. The guidelines are designed to make the code more analyzable by static analysis tools. |
| **[Efficiency](/qualities/efficiency)** | Indirectly supported by catching errors early in the development cycle, which leads to a more efficient development process. |
| **[Understandability](/qualities/understandability)** | Promoted through rules that improve code clarity, consistency, and comprehensibility. |

Note: Compliance with MISRA C is often required or strongly recommended in safety‑critical industries such as automotive, aerospace, rail, industrial, and medical devices.

### When to use
- Safety‑ and security‑related embedded software in C where high assurance is required.
- To meet or demonstrate alignment with sector standards (e.g., automotive, medical, industrial) that reference or permit MISRA C as a suitable C subset.

## References

### Official
- MISRA C:2023 announcement (overview): https://misra.org.uk/misra-c2023-released/
- MISRA Publications (free guidance and addenda): https://misra.org.uk/publications/
- MISRA Compliance:2020 (free PDF): https://misra.org.uk/app/uploads/2021/06/MISRA-Compliance-2020.pdf
- MISRA FAQs: https://misra.org.uk/faqs/

### Related standards and guidance
- [ISO 26262 - Road vehicles — Functional safety](/standards/iso-26262)
- [IEC 62304 - Medical device software](/standards/iec-62304)
- ISO/IEC 9899 — Programming Languages — C (language standard)

### Additional overview
- Wikipedia: MISRA C — https://en.wikipedia.org/wiki/MISRA_C
