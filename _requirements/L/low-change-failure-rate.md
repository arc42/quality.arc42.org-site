---
title: Low change-failure rate
tags: [reliable]
related: [change-failure-rate, reliability]
permalink: /requirements/low-change-failure-rate
---

<div class="quality-requirement" markdown="1">

#### Requirement

Software development team deploys new versions to production with low failure rate.

#### Acceptance Criteria

All metrics measured over three-month period:

- At least 98% of successful deployments where all changes rolled out without causing production incidents
- Severe incidents directly caused by deployments (e.g., application crashes, data loss) do not exceed 1 per month on average
- Minor incidents (e.g., non-critical bugs, minor performance issues) directly caused by deployments do not exceed 2 per month on average
- Rollback rate due to deployment issues does not exceed 2% of all deployments
- Average time to resolve deployment-related incidents does not exceed 4 hours for severe incidents and 2 hours for minor incidents
- Customer complaints related to degraded service or deployment issues do not exceed 1 per month on average

</div><br>

Source: This scenario has been created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality scenario to describe a change-failure-rate requirement`.

