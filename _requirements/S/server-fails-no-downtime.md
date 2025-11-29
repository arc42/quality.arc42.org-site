---
title: "Server fails, system continues to operate without downtime"
tags: [reliable]
related: [reliability, availability, high-availability, fault-tolerance, stability]
permalink: /requirements/server-fails-operation-without-downtime
---

<div class="quality-requirement" markdown="1">

#### Requirement

The system must maintain continuous operation despite server failures in a server farm.

#### Acceptance Criteria

- System continues to operate with no downtime when a server fails during normal operation
- Operator is informed of server failure
- Zero downtime during server farm node failures
- Automatic failover to redundant servers

>Source: [Len Bass et al., 2021, p. 76](/references/#bass2021software)

</div>



