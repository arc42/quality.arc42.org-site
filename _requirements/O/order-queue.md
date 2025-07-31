---
title: "Order queue"
tags: reliable 
related: fault-tolerance, recoverability
permalink: /requirements/order-queue
---

<div class="quality-requirement" markdown="1">

**Background**: The database is down, so orders received from the shop cannot be processed immediately

#### Source

User

**Stimulus**: Sends an order to the shop

**Reaction**: The system detects the database is down and queues the order for 1 day. As soon as the database is back up, the queued orders are processed

**Metric**: If the database downtime is less than 1 day, the number of orders received must be equals to the number of orders queued.


</div><br>




