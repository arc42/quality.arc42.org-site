---
title: Controllability
aka: [Human Controllability, Human Oversight]
tags: [usable, operable]
related: [usability, autonomy, operability, interaction-capability, governability, intervenability, auditability]
standards: [ieee2857, iso25059, iso42001, nistairmf]
permalink: /qualities/controllability
---

### In context of Usability

> The interface will allow the user to perceive that they are in control and will allow appropriate control.
>
> [Stanford University Usability Principles](https://improvement.stanford.edu/resources/usability-principles)

### In context of DevOps

> In the context of DevOps, controllability refers to the ability to effectively manage, manipulate, and influence the behavior of systems and processes throughout the software development and deployment lifecycle. Key aspects are:
>
> - Infrastructure Control
> - Deployment Control
> - Monitoring and Observability
>
> [Devops.com](https://devops.com/the-devops-pendulum-agility-vs-control/)

### In context of Quality for AI Systems

> Degree to which a user can appropriately intervene in an AI system’s functioning in a timely manner.
>
> [ISO-25059](/references/#iso-25059)

User controllability is a property of an AI system such that a controller can intervene in its functioning in a timely manner.

<hr class="with-no-margin"/>

### Human Oversight in AI Systems

Where a system acts with a degree of autonomy, controllability is what keeps a person able to understand, direct, and if necessary stop that action. Regulation and management standards treat this as an explicit design obligation, not as an incidental property of the user interface.

> High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which they are in use.
>
> [EU AI Act, Article 14: Human oversight](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-14)

Article 14(4) names the capabilities that oversight requires: understanding the system's capacities and limitations, remaining aware of automation bias, correctly interpreting the output, being able to decide not to use the system or to disregard or override its output, and being able to intervene or interrupt operation through a stop button or comparable procedure that halts the system in a safe state.

<hr class="with-no-margin"/>

ISO/IEC 42001 places oversight in the organizational dimension: an AI management system defines accountability for each AI system, which decisions require human involvement, and how that oversight is documented and reviewed. Controllability therefore has a governance side — see [governability](/qualities/governability) — as well as a technical one.

[ISO/IEC 42001](/standards/iso-42001)

<hr class="with-no-margin"/>

NIST AI RMF covers oversight in two places. GOVERN 3.2 asks for policies that "define and differentiate roles and responsibilities for human-AI configurations and oversight of AI systems". MANAGE 2.4 asks that mechanisms be in place and applied "to supersede, disengage, or deactivate AI systems that demonstrate performance or outcomes inconsistent with intended use".

[NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/)

<hr class="with-no-margin"/>

### Typical Oversight Mechanisms

- Human-in-the-loop approval before an action with material consequences
- Human-on-the-loop monitoring, with the ability to intervene while the system runs
- Override or correction of a system decision, with the override itself recorded
- Stop function that halts operation in a defined, safe state
- Rollback to a previous state after an unwanted action
- Escalation to a human when confidence, novelty, or risk thresholds are exceeded
- Audit trail that makes past decisions and interventions reconstructable — see [auditability](/qualities/auditability)

Oversight is only real if the intervention point is reachable in time: a control that cannot be exercised before the system's action takes effect does not make the system controllable.
