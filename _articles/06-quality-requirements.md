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
>* A service crashed at runtime. It can be restarted to fully operational state in less than 30 seconds.
>
>[Starke+2021, p. 141](/references/#starke2021software)

These sentences, in natural language, describe requirements or expectations of some stakeholder in a quite specific manner.
Formulating requirements in such a way allows a development team to know what needs to be achieved, and what is _good enough_.

Len Bass and his colleagues from the _Software Engineering Institute_ (SEI) coined the term "quality attribute scenarios" for such kind of sentences.
See [Bass et al, 2021](/references/#bass2021software) for details.

Quality scenarios, for short, are a pragmatic, easy-to-use and general approach to specifying quality requirements.


### General structure of quality scenarios

![general form of quality scenarios](/images/articles/q-requirements/q-scenario.png){:width="50%"}

>This structure has been proposed by 

* **Event/stimulus**: Any condition or event arriving at the system.
* **Response**: The activity undertaken after the arrival of the stimulus.
* **System** (or part of the system): Some artifact is stimulated, which may be the whole system or some distinct pieces (artifacts) of it.
* **Metric** (response measure): The response should be measurable in some fashion, so that this scenario (quality requirement) can be objectively assessed or tested.





### Summary
**Quality scenarios** document and clarify the required quality attributes. They help to describe required or desired qualities of a system in a pragmatic and informal manner, making the abstract term “qual- ity” more concrete, specific and tangible.
