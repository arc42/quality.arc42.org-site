---
title: "Scale up in 2 Minutes"
tags: [efficient, reliable]
related: [elasticity, scalability, performance]
permalink: /requirements/scale-up-in-2-minutes
---

<div class="quality-requirement" markdown="1">


#### Background

A cloud-based web application, with a sudden increase in user traffic, such as during a promotional event or a major product launch. 
Auto-scaling features are available and configured.


#### Response

The system automatically detects the increase in load and provisions additional resources to handle the increased traffic, without human intervention.

#### Metric


* Time to Scale: The system should begin scaling up additional resources within 2 minutes of detecting a 50% increase in traffic load.
* Resource Utilization: After scaling, CPU and memory utilization should stabilize at approximately 70%, ensuring that resources are neither underutilized (wasteful) nor overburdened (which could degrade performance).
* Performance Maintenance: The response time of the web application should not exceed 3 seconds for 95% of the requests, even during peak traffic.
Cost Efficiency: The cost of scaled resources should not exceed a 150% increase despite a 200% increase in traffic, emphasizing cost-effective scaling.

</div><br>

This requirement was created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality attribute scenario to describe a elasticity requirement for a web application`.



