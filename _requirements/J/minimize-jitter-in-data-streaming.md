---
title: "Minimize jitter in real-time data streaming"
tags: [reliable]
related: [jitter, predictability, latency]
permalink: /requirements/minimize-jitter
---

<div class="quality-requirement" markdown="1">

#### Context

Reduce and control [jitter](/qualities/jitter) in the real-time streaming of data. System operates under standard network conditions during operational phase.

#### Trigger

Continuous transmission of real-time data from sensors over network.

#### Acceptance Criteria

- Variance in delay between data packets (jitter) does not exceed 5 milliseconds for 95% of transmitted packets
- When jitter exceeds 5ms threshold, system employs buffering mechanisms to smooth data flow, ensuring effective jitter experienced by end-user remains below 7 milliseconds
- System detects and logs instances of high jitter (above 5 milliseconds) in real-time
- Alerts triggered for technical team when high jitter instances exceed 5% of total packets in any 10-minute window
- During peak load times, allowable jitter can increase to maximum of 10 milliseconds, but such instances do not exceed 2% of total packets transmitted in 24-hour period

</div><br>
