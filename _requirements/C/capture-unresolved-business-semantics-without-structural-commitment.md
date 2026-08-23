---
title: "Capture unresolved business semantics without structural commitment"
tags: [flexible, maintainable]
related: [evolvability, traceability]
permalink: /requirements/capture-unresolved-business-semantics-without-structural-commitment
---

### Context

A business feature must be implemented while a relevant business distinction or rule is explicitly unresolved. The observable information needed by the feature is understood, but the final interpretation has not yet been agreed.

### Trigger

Implementation and release must proceed before the unresolved business interpretation is finalized.

### Acceptance Criteria

- The system can record **100% of the agreed observable information** for a representative sample of at least 100 cases without assigning the unresolved final interpretation
- At least **2 plausible interpretations** can later be evaluated against the same captured sample without changing those recorded facts
- Applying either candidate interpretation modifies **0 previously captured source facts**
- **0 existing producers** of the captured source facts require modification solely to evaluate or finalize the interpretation
- Finalizing the interpretation requires **no migration that rewrites previously captured cases** and **no breaking change to the capture interface used by existing producers**
- Finalizing the interpretation changes **no more than 3 existing modules or independently deployable components**, excluding tests, documentation, and the interpretation implementation itself
- **100% of derived results** in the sample can be traced to the source facts used to calculate them

### Measurement & Verification

Select a business distinction that is explicitly unresolved while implementation proceeds. Capture at least 100 representative cases before the final interpretation is agreed, then evaluate two plausible candidate interpretations against the unchanged sample. Verify the criteria through automated tests, version-control diff, migration history, interface compatibility checks, and data lineage.
