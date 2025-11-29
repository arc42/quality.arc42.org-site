---
title: "Data Throughput for Visual Test System"
tags: [efficient, usable]
related: [throughput, efficiency, performance, capacity] 
permalink: /requirements/data-throughput-for-visual-test-system
---

<div class="quality-requirement" markdown="1">
#### Context

The system consists of hardware boards that enhance simple webcams with image recognition capabilities. These boards contain proprietary advanced image recognition algorithms embedded in their firmware and are used in applications such as license-plate recognition systems in public parking facilities. A test and verification system is used to validate firmware updates prior to release. The quality requirement pertains to the performance of this firmware test and verification system.

#### Trigger

An update of the firmware is available, typically including additional functionality or improved recognition performance.

#### Acceptance Criteria

- Test and verification system processes 1000 real-hours of video and image playback in less than 72 hours
- Minimum playback speed of 14 times real-time maintained (1000 hours / 72 hours ≈ 14)
- At least 14x playback speed maintained throughout entire test process (or less if tests performed in parallel)
- Accurate data transmission to device-under-test at accelerated rate
- No loss of video frames or degradation of image quality during accelerated playback
- Updated firmware recognizes images with at least accuracy of previous versions
- Complete processing of all 1000 hours of test data within 72-hour timeframe
- Accurate logging and reporting of test results including any anomalies or performance issues detected
</div><br>







