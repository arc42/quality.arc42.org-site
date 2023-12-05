---
title: Vehicle's position validity influences accuracy
tags: reliable usable
related: preciseness, precision, reliability, functional correctness 
permalink: /requirements/accurate-vehicle-position-gps
---

<div class="quality-requirement" markdown="1">

**Scenario**: The vehicle's position on the map of the navigation system

**Stimulus**: is updated.

**Reaction**: The current position of the vehicle is determined by extrapolation and not GPS data.

**Metric**: The extrapolated position is recalculated with a frequency greater than 10Hz.

**Background**: The GPS position retrieval rate via satellite might be insufficient low, such that in-between positions are determined using extrapolation.

</div><br>
