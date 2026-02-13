---
title: Data Localization
tags: [suitable, secure]
related: [data-sovereignty, data-residency, compliance, privacy]
permalink: /qualities/data-localization
---

> Data localization is the requirement that data about a nation's citizens or residents be collected, processed, and/or stored inside the country.
>
>[Wikipedia](https://en.wikipedia.org/wiki/Data_localization)

<hr>

### Overview

Data localization is a legal or regulatory requirement where a country mandates that data generated within its borders remain within those borders. This is often driven by concerns over:
*   **National Security**: Protecting critical data from foreign surveillance.
*   **Law Enforcement**: Ensuring local authorities can access data for investigations.
*   **Economic Protectionism**: Encouraging the growth of local data centers and IT services.

### Difference from Data Residency

While **Data Residency** is the choice of where to store data (often for performance or business reasons), **Data Localization** is a mandatory legal requirement. You might *choose* residency, but you are *compelled* to localization.

### Architectural Challenges

Implementing data localization often requires:
*   **Geofencing**: Technical controls to prevent data from leaving a specific boundary.
*   **Siloed Architectures**: Maintaining separate infrastructure stacks for different jurisdictions.
*   **Data Sharding**: Partitioning user data based on their citizenship or location.
