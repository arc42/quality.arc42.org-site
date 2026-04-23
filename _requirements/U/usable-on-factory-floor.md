---
title: "Usable on Factory Floor"
tags: [usable, suitable]
related: [anticipated-workplace-environment, usability, interaction-capability]
permalink: /requirements/usable-on-factory-floor
---

#### Requirement

The interactive system must remain operable for trained production workers under representative factory-floor conditions, including required protective gloves, high ambient noise, and poor or uneven lighting.

#### Acceptance Criteria

- Critical-task completion: in a qualification test with **>= 12 trained operators**, **>= 95%** complete the top **5** operational tasks without assistance within **<= 75 s per task**; scope: representative factory-floor environment with required gloves, ambient noise **>= 80 dB(A)**, and illuminance between **100 and 500 lux**; source: moderated usability test log; horizon: each release affecting UI, input devices, or workflow.
- Input accuracy: under the same test conditions, the interaction error rate is **<= 2%** across all attempts for the top **5** operational tasks; scope: tap, key, and selection actions required to complete the tested tasks; source: session recordings and task-observation protocol; horizon: each release affecting UI or input devices.
- Gate behavior: if either threshold is missed, rollout to factory-floor use is blocked within **<= 1 business day** after the validation report is available; scope: all releases affecting UI, display behavior, or input handling; source: release gate log; horizon: every qualifying release.
