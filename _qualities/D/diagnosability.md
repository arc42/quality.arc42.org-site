---
title: Diagnosability
tags: [operable, reliable]
related: [analysability, debuggability, observability, recoverability, fault-tolerance]
permalink: /qualities/diagnosability
---

> Diagnosability is the degree to which a system provides clear, accurate, and timely information to identify and localize the cause of a failure from its observed symptoms.
>
> [IEEE 1232: Standard for Artificial Intelligence Exchange and Service Tie to All Test Environments](https://standards.ieee.org/ieee/1232/1655/) (Context: System Diagnostics)

<hr>

Diagnosability enables efficient fault identification and localization—directly impacting Mean Time to Repair (MTTR) and reducing operational costs. It bridges the gap between raw **[Observability](/qualities/observability)** and effective **[Recoverability](/qualities/recoverability)**.

### Key Performance Indicators: MTTD vs MTTI

To measure diagnosability, organizations typically distinguish between detection and identification:

*   **MTTD (Mean Time to Detect)**: The average time between the occurrence of a fault and its detection (e.g., an alert firing). High detection capability is driven by monitoring coverage and threshold tuning.
*   **MTTI (Mean Time to Identify/Isolate)**: The average time between detection and the successful identification of the root cause or specific faulty component. **Diagnosability is the primary driver of MTTI.**

Reducing MTTI requires a system that provides actionable failure signatures rather than just generic "error 500" states.

### Comparison with Related Qualities

*   **[Analysability](/qualities/analysability)**: ISO 25010 defines this broadly, including impact analysis for changes. Diagnosability is more narrowly focused on the *fault diagnosis* aspect during operations.
*   **[Debuggability](/qualities/debuggability)**: While debuggability often emphasizes the *process* and *tools* (e.g., interactive debuggers, dumps), diagnosability emphasizes the *system's inherent property* to signal its internal health and failure reasons autonomously.

### Diagnosability Criteria

A highly diagnosable system meets several criteria:
1.  **Observability**: Sufficient data (logs, traces, metrics) is emitted.
2.  **Contextuality**: Signals include correlation IDs, tenant context, and transaction history.
3.  **Accuracy**: Low false-positive/false-negative rates in error reporting.
4.  **Localization**: The system can pinpoint the failing component or service boundary (Isolation).
5.  **Interpretability**: Error messages are human-readable and map to specific corrective actions.
