---
title: "Data Throughput for Visual Test System"
tags: efficient usable
related: throughput, efficiency, performance, capacity 
permalink: /requirements/data-throughput-for-visual-test-system
---

<div class="quality-requirement" markdown="1">

**Background**: Our hardware boards enhance simple webcams with image recognition capabilities.
Our (proprietory) advanced image recognition algorithms are embedded in the firmware of these boards.

These boards are used for example in license-plate recognition systems in many public parking facilities.

The quality requirement relates to the firmware test and verification system.

**Scenario**: An update of the firmware is available (usually with additional functionality of improved recognition performance). Prior to release, we need to verify that this updated firmware recognizes with at least the accuracy of the previous versions.
The test and verification process needs approximately 1000 hours of video and image playback.

**Metric**: The 1000 real-hours of video need to be played back to the device-under-test in less than 72 hours.

That means that a video taken in real-time needs to be played back to the device-under-test in at least 14-fold speed. The test and verification system needs to ensure this throughput from both software and hardware (I/O, network and processing capabilities).

</div><br>







