---
title: "Fast startup time (less than 90 sec)"
tags: [efficient]
related: [time-behaviour, speed, performance, startup-time, elasticity, scalability]
permalink: /requirements/fast-startup-time
---

<div class="quality-requirement" markdown="1">

#### Requirement

The system must reach a defined ready-for-use state quickly after a cold start from the fully powered-off state.

#### Acceptance Criteria

- Startup latency: on supported production hardware or runtime profiles, the system reaches ready state within **<= 90 s at p95** after the start command; source: startup timing report; horizon: each release affecting startup or deployment.
- Ready-state completeness: the startup success rate is **>= 99%** for cold starts, where ready state means that all mandatory services are initialized and the first health check or representative user transaction succeeds; source: startup test report; horizon: each release affecting startup or deployment.
- Gate behavior: if either threshold is missed, release of startup-affecting changes is blocked; source: release gate log; horizon: every qualifying release.

</div><br>
