---
layout: page
title: "How to specify quality requirements"
permalink: /articles/specify-quality-requirements
---

**Quality** is such a vague and broad term, that it needs clarification for system development projects.

Consider the following examples of quality requirements:

>* An authenticated user requests generation of the daily sales report in PDF format via the graphical user interface. The system generates this report in less than 10 seconds.
>* When a user configures a health insurance contract, the system calculates a price estimate based on the currently available information. This estimate must be within a ±15% margin relative to the final price.
>* The user registration service must be available 7x24h 99%.
>* A new insurance tariff can be implemented in the system in less than 10 days.
>* A service crashed at runtime. It can be restarted to a fully operational state in less than 30 seconds.
>
>[Starke+2021, p. 141](/references/#starke2021software)

These sentences, in natural language, describe requirements or expectations of some stakeholder in a quite specific manner.
Formulating requirements in such a way allows a development team to know what needs to be achieved, and what is _good enough_.

Len Bass and his colleagues from the _Software Engineering Institute_ (SEI) coined the term "quality attribute scenarios" for such kinds of sentences.
See [Bass et al., 2021](/references/#bass2021software) for details.

Quality scenarios, in short, are a pragmatic, easy-to-use and general approach to specifying quality requirements.

>You find {{ requirement_posts | size }} examples of such quality requirements on this site (see [examples](/requirements)).


### General structure of quality scenarios (SEI-version)

![general form of quality scenarios](/images/articles/q-requirements/q-scenario.png){:width="50%"}


* **Event/stimulus**: Any condition or event arriving at the system.
* **Source of stimulus**: The entity (person, system, or other actor) that generates the stimulus.
* **Environment**:The conditions or context under which the stimulus occurs.
* **Artifact**: The part of the system that is affected by the stimulus.
* **Response**: How the system should react to the stimulus. The activity undertaken after the arrival of the stimulus.
* **Metric** (response measure): The response should be measurable in some fashion, so that this scenario (quality requirement) can be objectively assessed or tested.

Although this template is widely used, it suffers from some drawbacks:

* The template's detailed nature can make it time-consuming to complete, especially for numerous scenarios.
* Teams might feel compelled to fill out all sections in detail, even when not necessary for every scenario.
* The comprehensive approach might not align well with fast-paced, agile development methodologies.

In practice, a slightly reduced template proved to be sufficient, let's call it the Q42-Requirements template:

### Pragmatical Quality Scenario

**Context/Background**: A brief description of the situation. This includes the type of system, the relevant environment or operational setting, and the specific condition being considered.

**Source**: The origin of the event or stimulus that triggers the scenario. This could be a stakeholder action (e.g., user interaction, administrator action) or an external event (e.g., system load, security threat, API call).

**Metric/Acceptance Criteria**: A clear, measurable outcome that determines whether the system meets the desired quality attribute. This could be expressed as a specific performance metric, threshold, or success criterion that must be achieved under the given context.

Only three (instead of SEI six) attributes, but understandable and precise.

### Summary
**Quality scenarios** document and clarify the required quality attributes. 
They help to describe required or desired qualities of a system in a pragmatic and informal manner, making the abstract term “quality” more concrete, specific and tangible.

We propose you try the pragmatic and simple Q42-Quality-Scenario template for your own projects.
