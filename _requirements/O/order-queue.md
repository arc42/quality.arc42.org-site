---
title: "Order queue"
tags: [reliable] 
related: [fault-tolerance, recoverability]
permalink: /requirements/order-queue
---

<div class="quality-requirement" markdown="1">

#### Context

The database is down, so orders received from the shop cannot be processed immediately.

#### Trigger

User sends an order to the shop while database is unavailable.

#### Acceptance Criteria

- System detects database is down and queues the order
- Orders queued for up to 1 day
- Queued orders are processed as soon as database is back up
- If database downtime is less than 1 day, 100% of orders received are queued (number of orders received equals number of orders queued)


</div><br>




