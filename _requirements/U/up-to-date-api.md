---
title: "Up to date API"
tags: [reliable, suitable]
related: [reliability, accuracy, correctness]
permalink: /requirements/up-to-date-api
---

<div class="quality-requirement" markdown="1">

#### Context

API provides configuration data from multiple sources. These configurations can be changed and the API should always provide up-to-date information.

#### Trigger

Consumer of the API requests configuration data.

#### Acceptance Criteria

- Configuration returned is up to date
- After configuration is changed, at most 5% of requests after 30 seconds may still return previous configuration
- 95% of requests return updated configuration within 30 seconds of change


</div><br>




