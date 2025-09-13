---
title: Vehicle's position validity influences accuracy
tags: [reliable, usable]
related: [preciseness, precision, reliability, functional-correctness]
permalink: /requirements/accurate-vehicle-position-gps
---

<div class="quality-requirement" markdown="1">

#### Scenario

The vehicle's position on the map of the navigation system

#### Stimulus

is updated.

#### Reaction

The current position of the vehicle is determined by extrapolation and not GPS data.

#### Metric

The extrapolated position is recalculated with a frequency greater than 10Hz.

#### Background

The GPS position retrieval rate via satellite might be insufficient low, such that in-between positions are determined using extrapolation.

#### Context/Background

The system is a vehicle navigation system that displays the vehicle's position on a map.
GPS data might be retrieved at an insufficient rate for smooth position updates.
To compensate for this, the system uses extrapolation to determine in-between positions.
This extrapolation is crucial for providing a smooth and accurate representation of the vehicle's movement on the map.

#### Source

The vehicle's position on the map of the navigation system is being updated.
The current position is determined by extrapolation rather than direct GPS data.

#### Metric/Acceptance Criteria

The extrapolated position of the vehicle must be recalculated with a frequency greater than 10Hz.

This requirement will be considered met when:

* The system consistently maintains a position update rate higher than 10 times per second
* This update rate is maintained under various driving conditions (e.g., different speeds, urban vs. rural environments)
* The transition between extrapolated positions and new GPS data is smooth, with no visible jumps on the map

</div><br>
