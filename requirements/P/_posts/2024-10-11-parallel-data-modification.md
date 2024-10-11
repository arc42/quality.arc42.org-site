---
title: "Parallel Data Modification"
tags: usable efficient secure
related: performance 
permalink: /requirements/parallel-data-modification
---

<div class="quality-requirement" markdown="1">

**Background**: In some multi-tenant systems several tenants may modify the same data at the same time. A possible solution is Optimistic Locking.

**Source**: User A

**Stimulus**: modifies shortly after user B has read

**Artifact**: the same data record.

**Reaction**: The system reports the conflict and handles it.

**Metric**: The system displays user B the data record of user A so that user B can react to the changes of user A.

</div><br>