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

- User is informed about the 3 features that were most influential in the final decision
- Explanation provided immediately when decision is communicated to user
- Explanations support oversight and appeal processes for high-risk scenarios

</div><br>
