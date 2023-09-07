---
title: Low change-failure rate
tags: reliable
related: change failure rate, reliability, 
permalink: /requirements/low-change-failure-rate
---

<div class="quality-requirement" markdown="1">

### Stimulus
A software development team deploys a new version of a web application to a production environment.

### Response 
The change failure rate requirement will be considered met when the following precise metrics are achieved over a three-month period:

**Successful Deployments**: The percentage of successful deployments, where all changes are rolled out without causing production incidents, should be at least 98%.

**Severe Incidents**: The number of severe incidents directly caused by deployments (e.g., application crashes, data loss) should not exceed 1 per month on average.

**Minor Incidents**: The number of minor incidents (e.g., non-critical bugs, minor performance issues) directly caused by deployments should not exceed 2 per month on average.

**Rollback Rate**: The rate of rollbacks due to deployment issues should not exceed 2% of all deployments.

**Incident Resolution Time**: The average time to resolve deployment-related incidents should not exceed 4 hours for severe incidents and 2 hours for minor incidents.

**Customer Complaints**: The number of customer complaints related to degraded service or issues caused by deployments should not exceed 1 per month on average.

</div><br>


Source: This scenario has been created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality scenario to describe a change-failure-rate requirement`.



