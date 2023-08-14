---
title: Access control is enforced
tags: secure suitable
related: access-control  
permalink: /requirements/access-control
---

<div class="quality-requirement" markdown="1">

**Stimulus**: A user attempts to access a sensitive feature or confidential information within the system.

**Environment**: Multi-user environment with varying levels of user roles and permissions.

**Response**: The system should enforce appropriate access controls based on the user's role and permissions. 
If the user's role grants access to the requested feature or information, the system should allow access without any impediments. 
However, if the user's role does not have the required permissions, the system should deny access and display a relevant and user-friendly error message. 
Additionally, any access control violations should be logged and reported to authorized personnel for further investigation.

**Background:** In this scenario, the access control requirement is defined for a multi-user system with different levels of user roles and permissions. When a user attempts to access a sensitive feature or confidential information, the system should respond by enforcing appropriate access controls.
</div><br>



Source: This scenario has been created with help from [ChatGPT](https://chat.openai.com) by using the prompt `create a quality scenario to describe an access control requirement`.



