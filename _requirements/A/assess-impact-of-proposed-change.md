---
title: Assess impact of proposed change
tags: [suitable, reliable]
related: [analysability, reliability]
permalink: /requirements/assess-impact-of-proposed-change
---

<div class="quality-requirement" markdown="1">

#### Context

The system is a financial software application with multiple modules. The system's analysability is crucial for efficient change management and maintenance, supported by tools and practices for code documentation, dependency mapping, and change simulation.

#### Trigger

A software development team initiates an impact analysis for a proposed change to a specific module of the financial software application.

#### Acceptance Criteria

- Change Impact Assessment Time:
  - Team assesses impact of proposed change within 2 hours
  - Time starts from beginning of documentation and source code review
  - Assessment covers all potential areas affected by change
- Code Comment Density:
  - Affected module has minimum 20% code comment density
  - Measured using automated code analysis tools
  - Comments are meaningful and explain code functionality clearly
- Dependency Mapping:
  - System provides visual dependency map showing all dependencies to/from other components
  - Dependency map generation completes within 5 minutes
  - Map shows 100% of actual dependencies accurately
- Overall Compliance:
  - All three criteria must be met
  - Compliance verified through at least 3 different change scenarios
  - Failures documented and addressed
  - System maintains this analysability level for at least 90% of all modules

</div><br>



Source: This scenario has been created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality scenario to describe an analysability requirement`.



