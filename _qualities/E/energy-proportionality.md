---
title: Energy Proportionality
tags: [efficient]
related: [energy-efficiency, resource-utilization, elasticity, scalability, sustainability, carbon-emission-efficiency]
permalink: /qualities/energy-proportionality
---

>Energy proportionality is a measure of the relationship between power consumed in a computer system, and the rate at which useful work is done (its utilization).
>If the overall power consumption is proportional to the computer's utilization, then the machine is said to be energy proportional.
>
>[Wikipedia: Energy proportional computing](https://en.wikipedia.org/wiki/Energy_proportional_computing)

Ideally, systems should consume power proportional to their utilization — using minimal energy at low load and scaling up smoothly under higher load.

The concept was introduced by Google engineers Luiz Andr&eacute; Barroso and Urs H&ouml;lzle:

>Energy-proportional designs would enable large energy savings in servers, potentially doubling their efficiency in real-life use.
>Achieving energy proportionality will require significant improvements in the energy usage profile of every system component, particularly the memory and disk subsystems.
>
>Barroso, L.A. and H&ouml;lzle, U. (2007). [The Case for Energy-Proportional Computing](https://doi.org/10.1109/MC.2007.443). _Computer_, vol. 40, no. 12, pp. 33-37.

### Why it matters

Traditional hardware often exhibits poor energy proportionality: a server at 10% utilization may already consume 50% of its peak power draw due to static power consumption.
Since servers in modern data centers typically operate at 10-50% utilization, this inefficiency has significant environmental and cost impact.

### Architectural relevance

Virtualization, containerization, and cloud-native architectures can improve energy proportionality by consolidating workloads onto fewer, more highly utilized servers.
However, achieving good energy proportionality requires deliberate architectural attention — it is a distinct quality concern beyond general energy efficiency.

>The operating system's role in enabling energy proportionality is a major area of investigation.
>Energy-aware scheduling algorithms consolidate workloads, allow CPU cores to enter deep sleep states, and coordinate power management across different system components.
>
>[Wikipedia: Energy proportional computing](https://en.wikipedia.org/wiki/Energy_proportional_computing)

### Further reading

* Sen, R. and Wood, D.A. (2017). [Energy-Proportional Computing: A New Definition](https://doi.org/10.1109/MC.2017.193). _Computer_, vol. 50, no. 8, pp. 26-33.
* Microsoft Learn: [Sustainable Software Engineering — Energy Proportionality](https://learn.microsoft.com/en-us/learn/modules/sustainable-software-engineering-overview/7-energy-proportionality)
