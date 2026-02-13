---
title: Data Residency
tags: [suitable]
related: [data-sovereignty, data-localization, compliance, privacy]
permalink: /qualities/data-residency
---

> Data residency refers to the physical or geographic location of where an organization's data or information is stored.
>
>[Cloudian](https://cloudian.com/blog/data-residency-vs-data-sovereignty-vs-data-localization/)

<hr>

### Overview

Data residency is often a business decision or a policy requirement rather than a legal mandate (though it often overlaps with legal requirements). Organizations may choose specific residency for:
*   **Performance**: Reducing latency by keeping data close to the users.
*   **Tax/Business**: Benefiting from local tax laws or business incentives.
*   **Operational Control**: Ensuring physical access to hardware if necessary.

### Architectural Relevance

To support data residency, systems must be designed to:
*   **Pin data to regions**: Use cloud "availability zones" or "regions" effectively.
*   **Control Replication**: Ensure that backup and disaster recovery sites also respect the residency constraints.
*   **Traffic Routing**: Ensure that processing happens in the same region where the data resides to avoid unintended "data in flight" residency violations.
