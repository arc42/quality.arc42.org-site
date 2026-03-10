---
title: "Accessible User Interface"
tags: [usable]
related: [usability, inclusivity, compliance, accessibility, interaction-capability]
permalink: /requirements/accessible-user-interface
---

<div class="quality-requirement" markdown="1">

#### Context

Users who rely on keyboard navigation and assistive technologies must be able to complete core product journeys without barriers.

#### Trigger

A release candidate is built, or a quarterly accessibility review is due.

#### Acceptance Criteria

- 100% of pages in the top 20 user journeys are scanned in CI with zero critical WCAG 2.1 AA violations and ≤ 5 serious violations per release candidate (automated accessibility scan report).
- Quarterly manual audit of the top 10 journeys using keyboard-only plus ≥ 2 mainstream screen readers completes all critical journeys with zero critical blockers (manual audit report).
- Any open critical accessibility violation on a critical journey blocks release within 10 min (release gate log).

</div><br>
