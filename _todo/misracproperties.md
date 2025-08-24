# MISRA C – Relevant Qualities (Draft)

This list captures qualities strongly supported or emphasized by MISRA C (esp. MISRA C:2023). Use it to tag or relate qualities to the MISRA C standard (standard_id: misra-c).

- Safety — Primary goal; reduce undefined behavior and hazardous failures in safety‑related systems
- Security — Many rules mitigate common vulnerabilities (e.g., buffer overflows, data corruption); CERT C coverage mapping available
- Reliability — Restricts dangerous constructs and promotes robust coding practices to reduce defect likelihood
- Maintainability — Enforces clarity, consistency, and structure; improves readability and reviewability
- Testability — Predictable subset and constraints improve analyzability and enable systematic testing
- Traceability — Supported via MISRA Compliance process and documented deviations/justifications
- Portability / Flexibility — Avoids implementation‑defined/undefined behavior; reduces platform/compiler dependencies
- Robustness — Discourages error‑prone patterns; encourages defensive coding and well‑defined behavior
- Integrity — Prevents unintended data/control flow and enforces strict typing and conversions
- Observability — Rules encourage explicitness, clear interfaces, and diagnosable code paths aiding analysis and debugging
- Auditability — Compliance artifacts (reports, deviations, permits) enable audits and assessments
- Modularity — Encourages well‑structured code with limited scope, reducing coupling and improving encapsulation
- Understandability — Naming, explicitness, and prohibition of obscure constructs improve comprehension
- Predictability — Eliminates undefined/unspecified behaviors to make runtime behavior deterministic where possible
- Performance Efficiency (conditional) — Not a goal, but predictability and avoidance of undefined behavior can reduce failure overhead; may conflict with some low‑level optimizations

Notes
- Compliance: Mandatory, Required, Advisory; deviations must be justified and documented per MISRA Compliance:2020
- Language versions: MISRA C:2023 consolidates MISRA C:2012 AMD2–4 and TC2; supports C11/C18

Suggested next steps
- Tag the relevant qualities with standards: ["misra-c"] so they show up under the MISRA C page’s related qualities section
- Consider adding cross-links to ISO 26262/IEC 61508 for safety and to ISO/IEC 27001 or ISO/SAE 21434 for security context
