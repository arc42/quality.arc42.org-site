---
title: "Reinterpret a domain concept from historical facts"
tags: [flexible, maintainable]
related: [evolvability, traceability, auditability]
permalink: /requirements/reinterpret-domain-concept-from-historical-facts
---

### Context

A production system contains historical business information from which a domain state or classification is derived. The business later introduces a revised interpretation of that concept while the underlying historical facts remain unchanged.

### Trigger

The revised interpretation must be applied retrospectively so that previous and revised results can be compared for historical cases.

### Acceptance Criteria

- The revised interpretation can be evaluated for **100% of a representative sample of at least 100 historical cases** using information captured before the revised interpretation existed
- **0 historical source facts are modified, deleted, or rewritten** to produce the revised interpretation
- **0 existing producers of those historical facts require modification** solely to support the retrospective interpretation
- The previous and revised interpretations can be evaluated **side by side for the same 100 historical cases**
- **100% of revised results** in the sample can be traced to the source facts used to derive them
- Where an explicit business policy determines the interpretation, **100% of sampled results** identify the policy version used
- Introducing the revised interpretation changes **no more than 3 existing modules or independently deployable components**, excluding tests, documentation, and the new interpretation itself
- Existing consumers that continue to use the previous interpretation require **0 modifications**

### Measurement & Verification

Select a domain concept whose business meaning changed after production history already existed. Run the previous and revised interpretations against a representative sample of at least 100 historical cases and verify the criteria through automated tests, version-control diff, migration history, and data lineage.
