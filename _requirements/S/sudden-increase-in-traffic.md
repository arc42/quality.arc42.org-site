---
title: "Handle sudden increase in traffic"
tags: reliable
related: resilience, reliability, elasticity, scalability
permalink: /requirements/handle-sudden-increase-in-traffic
---

<div class="quality-requirement" markdown="1">

#### Stimulus

A sudden increase in traffic due to unexpected popularity or a temporary spike in user activity.

#### Environment

The web application is running in a cloud-based environment with multiple servers and data centers.

#### Response

The web application should gracefully handle the traffic surge without service disruption.
Performance degradation shall remain below 25% reduced response time.

It should automatically scale its resources to accommodate the increased load, distribute traffic evenly among servers, and ensure data consistency. 
In the event of server failures, it should seamlessly redirect traffic to healthy servers and recover lost data if necessary. 
Additionally, it should log and report any anomalies or failures for further analysis and improvement.


</div><br>

This requirement was created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality attribute scenario to describe a resilience requirement for a web application`.



