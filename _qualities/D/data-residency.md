---
title: Data Residency
tags: [suitable]
related: [data-sovereignty, data-localization, compliance, privacy]
permalink: /qualities/data-residency
---

> Data residency is the physical or geographical location of an organization's digital information.
>
>[Government of Canada White Paper: Data Sovereignty and Public Cloud](https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/cloud-services/digital-sovereignty/gc-white-paper-data-sovereignty-public-cloud.html), 2018 (ISBN 978-0-660-27233-7)

<hr>

>Data Residency (DaR) is one such regulation that deals with the location and movement of data across geographies and jurisdictions, and protection against unintended access.
>
>Rao, K.R. and Nayak, A. (2019). Data residency as a service: a secure mechanism for storing data in the cloud. _International Journal of Embedded Systems_, Vol. 11, No. 4, pp. 397-418. [DOI: 10.1504/IJES.2019.100875](https://doi.org/10.1504/IJES.2019.100875)

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

### Further reading

* Baudoin, C.R. (2018). The Impact of Data Residency on Cloud Computing. _32nd International Conference on Advanced Information Networking and Applications Workshops (WAINA)_, pp. 430-435. [DOI: 10.1109/WAINA.2018.00124](https://doi.org/10.1109/WAINA.2018.00124)
* [Wikipedia: Data localization](https://en.wikipedia.org/wiki/Data_localization) (closely related concept)
