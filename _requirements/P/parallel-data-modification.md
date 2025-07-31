---
title: "Parallel Data Modification"
tags: usable efficient secure
related: performance 
permalink: /requirements/parallel-data-modification
---

<div class="quality-requirement" markdown="1">

#### Context/Background

In some multi-tenant systems several tenants may modify the same data at the same time. A possible solution is Optimistic Locking.

#### Source

User A modifies shortly after user B has read the same data record.

#### Metric/Acceptance Criteria

The system display a conflict message and displays user B the data record of user A so that user B can react to the changes of user A.

</div><br>
