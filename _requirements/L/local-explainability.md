---
title: Local Explainability
tags: [suitable, safe, reliable]
related: [explainability]  
permalink: /requirements/local-explainability
---

<div class="quality-requirement" markdown="1">

#### Context

Using AI to generate decisions involves finding patterns in large sets of data. Individual results are subject to statistical noise and may be erroneous. Specifically for systems in high risk scenarios, giving users an explanation is necessary to allow additional oversight and appeal processes. User has submitted a request and the system used Artificial Intelligence (AI) to decide if the request should be approved or not.

#### Trigger

User was subject of an AI-generated decision by the system and is informed of the decision.

#### Acceptance Criteria

- The explanation shows the top 3 decision factors that drove the outcome, each with its direction of influence and a normalized contribution score.
- The explanation is rendered within 2 seconds and is shown in the same response or screen as the decision, without additional user action.
- The explanation uses plain language, and is no longer than 150 words.
- If no valid explanation can be generated, the system must not issue a final automated decision and must route the case for human review.

</div><br>
