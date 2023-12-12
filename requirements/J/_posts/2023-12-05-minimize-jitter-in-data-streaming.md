---
title: "Minimize jitter in real-time data streaming"
tags: reliable
related: jitter, predictability, latency
permalink: /requirements/minimize-jitter
---

<div class="quality-requirement" markdown="1">

### Overall goal: Reduce and control [jitter](/qualities/jitter) in the real-time streaming of data.


**Stimulus**: Continuous transmission of real-time data (from sensors) over a network,.

**Environment**: Operational phase under standard network conditions.

**Response**: The system handles variations in delay of data packet delivery.

**Response Measure**:

* The variance in delay between data packets (jitter) should not exceed 5 milliseconds for 95% of the transmitted packets
* In instances where jitter exceeds this threshold, the system should employ buffering mechanisms to smooth the data flow, ensuring that the effective jitter experienced by the end-user remains below 7 milliseconds
* The system must detect and log instances of high jitter (above 5 milliseconds) in real-time, triggering alerts for the technical team when such instances exceed 5% of the total packets in any 10-minute window
* During peak load times, the allowable jitter can increase to a maximum of 10 milliseconds, but such instances should not exceed 2% of the total packets transmitted in a 24-hour period.

</div><br>