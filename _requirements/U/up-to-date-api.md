---
title: "Up to date API"
tags: [reliable, suitable]
related: reliability, accuracy, correctness
permalink: /requirements/up-to-date-api
---

<div class="quality-requirement" markdown="1">

#### Background

API provides configuration data from multiple sources. These configurations can be changed and the API should always provide up to date information.

#### Source

Consumer of the API

#### Stimulus

Requests data

#### Reaction

Configuration returned is up to date

#### Metric

If the configuration is changed, only in 5% of the requests after 30 seconds, the data returned is still the previous configuration.


</div><br>




