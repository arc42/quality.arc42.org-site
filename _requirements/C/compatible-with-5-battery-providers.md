---
title: Compatible with 5 different battery providers
tags: [flexible]
related: [flexibility, adaptability, interoperability, compatibility]
permalink: /requirements/compatible-with-5-battery-providers
---

#### Context

The system's energy is supplied by a rechargeable onboard battery mechanically attached to a circuit board (PCB). 
The current board version fits only batteries from _one specific_ supplier.


#### Metric / Acceptance Criteria

The circuit-board revision must support approved battery models from _five preferred suppliers_ without PCB redesign or supplier-specific firmware.

- ≥ 1 approved battery model from each of 5 preferred suppliers works with zero PCB changes, adapters, or firmware forks (hardware compatibility matrix, every board revision).
- 100% of critical functional tests pass per approved model under the reference operating profile and environmental test setup (hardware + system test report, every board revision).

- Battery-life variation across approved models ≤ 10% under the same load profile; any supplier missing a threshold is de-listed for that revision (endurance test report).
