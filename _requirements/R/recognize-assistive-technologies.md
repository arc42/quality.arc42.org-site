---
title: "Recognize Assistive Technologies"
tags: [usable]
related: [usability, inclusivity, accessibility, interaction-capability]
permalink: /requirements/recognize-assistive-technology
---

#### Context

Users with visual or motor impairments interact through screen readers, keyboard navigation, and custom accessibility preferences. The interface must expose correct semantics.

#### Trigger

A release candidate is built, or a quarterly accessibility review is due.

#### Acceptance Criteria

- ≥ 95% of interactive elements on the top 20 screens expose correct accessible name, role, and state; zero critical workflow controls lack announcements (accessibility test report, every release).
- Keyboard-only task success ≥ 90% and median completion time ≤ 120% of mouse baseline for the top 10 user tasks (comparative usability study, quarterly).
- Text contrast ≥ 4.5 : 1 (normal) and ≥ 3 : 1 (large) on the top 20 journeys; persisted accessibility preferences restored in 100% of returning-user sessions (automated contrast audit + session-restoration test, every release).
