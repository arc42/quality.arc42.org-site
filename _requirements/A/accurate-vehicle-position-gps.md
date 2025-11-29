---
title: Vehicle's position validity influences accuracy
tags: [reliable, usable]
related: [preciseness, precision, reliability, functional-correctness]
permalink: /requirements/accurate-vehicle-position-gps
---

<div class="quality-requirement" markdown="1">

#### Context

The system is a vehicle navigation system that displays the vehicle's position on a map. GPS data might be retrieved at an insufficient rate for smooth position updates. To compensate for this, the system uses extrapolation to determine in-between positions, which is crucial for providing a smooth and accurate representation of the vehicle's movement on the map.

#### Trigger

The vehicle's position on the map is being updated when the current position is determined by extrapolation rather than direct GPS data.

#### Acceptance Criteria

- Extrapolated position recalculated with frequency greater than 10Hz
- System consistently maintains position update rate higher than 10 times per second
- Update rate maintained under various driving conditions (different speeds, urban vs. rural environments)
- Transition between extrapolated positions and new GPS data is smooth with no visible jumps on the map

</div><br>
