---
title: Response time for image rendering
tags: [efficient]
related: [response-time, efficiency, performance, time-behaviour, speed, responsiveness]
permalink: /requirements/response-time-for-image-rendering
---

<div class="quality-requirement" markdown="1">

#### Context

Image manipulation software offers variety of image filters for users (shadows, greyscaling, resizing, background-removal and others). To achieve required response time, reducing resolution of image for preview is an option.

#### Trigger

User selects graphical filter and clicks or selects `apply filter` function.

#### Acceptance Criteria

- System displays changed image next to original
- Changed image displayed in less than 1 second
- Preview generation time remains under 1 second regardless of filter type

</div><br>


