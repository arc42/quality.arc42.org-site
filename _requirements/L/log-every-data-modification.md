---
title: "Every data modification is logged"
tags: [secure]
related: [security, privacy, traceability, recoverability]
permalink: /requirements/every-data-modification-is-logged
---

<div class="quality-requirement" markdown="1">

#### Requirement

Every data modification must be logged in an immutable audit trail.

#### Acceptance Criteria

- All data modifications (create, update, delete operations) are logged
- Logs stored in a data store that cannot be erased by system users
- Logs cannot be modified by system users
- 100% of data modification operations captured in audit log

</div><br>




