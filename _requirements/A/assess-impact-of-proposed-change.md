---
title: Assess impact of proposed change
tags: suitable reliable
related: analysability, reliability
permalink: /requirements/assess-impact-of-proposed-change
---

<div class="quality-requirement" markdown="1">

#### Context/Background

The system is a financial software application with multiple modules.
A software development team needs to analyze and assess the impact of a proposed change to a specific module.
The system's analysability is crucial for efficient change management and maintenance.
Tools and practices are in place to support code documentation, dependency mapping, and change simulation.

#### Source

A software development team initiates an impact analysis for a proposed change to a specific module of the financial software application.

#### Metric/Acceptance Criteria

The system's analysability requirement will be considered met when the following precise metrics are achieved:

* Change Impact Assessment Time:
  * The team must be able to assess the impact of the proposed change within 2 hours
  * This time starts from the moment the team begins reviewing relevant documentation and source code
  * The assessment should cover all potential areas affected by the change

* Code Comment Density:
  * The affected module must have a minimum code comment density of 20%
  * This density should be measured using automated code analysis tools
  * Comments should be meaningful and provide clear explanations of code functionality

* Dependency Mapping:
  * The system must provide a visual dependency map of the module, that indicates all dependencies on and from other components
  * Generation time for the dependency map must not exceed 5 minutes
  * The map should be accurate, showing 100% of actual dependencies


* Overall Compliance:
  * All three criteria (assessment time, comment density, and dependency mapping) must be met for the requirement to be satisfied
  * Compliance should be verified through at least 3 different change scenarios
  * Any failures in meeting these criteria should be documented and addressed
  * The system should maintain this level of analysability for at least 90% of all modules

</div><br>



Source: This scenario has been created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality scenario to describe an analysability requirement`.



