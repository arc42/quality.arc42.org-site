---
title: Fault tolerance
tags: reliable usable
related: robustness, reliability, usability, availability, recoverability, faultlessness, graceful-degradation
permalink: /qualities/fault-tolerance
---

>Capability of a product to operate as intended despite the presence of hardware or software faults.
>
>[ISO-25010:2023](/references/#iso-25010-2023)

<hr class="with-no-margin"/>

>Fault tolerance is the property that enables a system to continue operating properly in the event of the failure of one or more faults within some of its components. 
>If its operating quality decreases at all, the decrease is proportional to the severity of the failure, as compared to a naively designed system, in which even a small failure can cause total breakdown. 
>Fault tolerance is particularly sought after in high-availability, mission-critical, or even life-critical systems. 
>The ability of maintaining functionality when portions of a system break down is referred to as [_graceful degradation_](/qualities/graceful-degradation).
>
>[Wikipedia](https://en.wikipedia.org/wiki/Fault_tolerance)

<hr>

A special case is the _byzantine fault tolerance_ (BFT): 
In that case, some components may fail, but there is imperfect information on whether a component has failed.

See the detailed explanation on [Wikipedia on BFT](https://en.wikipedia.org/wiki/Byzantine_fault).

