---
title: "Parallel Data Modification"
tags: [usable, efficient, secure]
related: [performance] 
permalink: /requirements/parallel-data-modification
---

<div class="quality-requirement" markdown="1">

#### Context

In some multi-tenant systems several tenants may modify the same data at the same time. A possible solution is Optimistic Locking.

#### Trigger

User A modifies data shortly after user B has read the same data record.

#### Acceptance Criteria

- System displays conflict message when concurrent modification detected
- User B shown user A's modified data record
- User B can react to and resolve changes made by user A

</div><br>
