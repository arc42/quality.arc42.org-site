---
layout: default
title: Home
permalink: /
order: 1
---

>### ![](/images/ua-flag.svg){:width="5%"} We stand with the people of Ukraine ![](/images/ua-flag.svg){:width="5%"}
>
>Please assist humanitarian efforts for the Ukrainian people and those affected by the military invasion of Ukraine by supporting international aid organizations, including the [International Committee of the Red Cross](https://www.icrc.org/en). 

## arc42 Quality Model (v 1.0)
![arc42 Quality Model (v1.0)](/images/QM-42-v1.svg)

Information-technology systems have to meed required, desired and expected quality goals and requirements. 
Therefore, development teams we need such requirements in concrete, specific and operationalized ways.



On this site you find explanations to (currently {{ site.posts | size }}) _qualities_ of software systems and -architectures.

These are organized along the following top-level tags (properties or attributes). 
A single quality attribute (like "availability") might have multiple tags (#reliable, #usable and #safe, in this case)).


{% assign tags_reliable = site.posts | where_exp: "posts", "posts.tags contains 'reliable'" %}
{% assign tags_flexible = site.posts | where_exp: "posts", "posts.tags contains 'flexible'" %}
{% assign tags_efficient = site.posts | where_exp: "posts", "posts.tags contains 'efficient'" %}
{% assign tags_usable = site.posts | where_exp: "posts", "posts.tags contains 'usable'" %}
{% assign tags_safe = site.posts | where_exp: "posts", "posts.tags contains 'save'" %}
{% assign tags_secure = site.posts | where_exp: "posts", "posts.tags contains 'secure'" %}
{% assign tags_testable = site.posts | where_exp: "posts", "posts.tags contains 'testable'" %}
{% assign tags_operable = site.posts | where_exp: "posts", "posts.tags contains 'operable'" %}

| Tag (quality) | Explanation          |
| :--- | :--- |
| [**#reliable**](/tag_reliable/) ({{ tags_reliable | size }}) | Perform specified functions under specified conditions without interruptions and failures.  |
|-|----------------------------|
| [**#flexible**](/tag_flexible/) ({{ tags_flexible | size }})  |  Serve a different or expanded set of requirements; the ease with which the product can be adapted to changes in its requirements, contexts of use, or system environment. Synonyms: modifiable, adjustable, changeable, versatile. |
| [**#efficient**](/tag_efficient/) ({{ tags_efficient | size }})  |  Perform functions within specified time, capacity and throughput parameters, using appropriate resources (like memory, network bandwith, threads). |
| [**#usable**](/tag_usable/) ({{ tags_usable | size }})  |  Enable users to perform their tasks safely, effectively, and efficiently while enjoying the experience. |
| [**#safe**](/tag_safe/) ({{ tags_safe | size }})  |  Avoid states in which human life, health, property, or the environment is endangered, detects and warns of risks and hazards.  |
| [**#secure**](/tag_secure/) ({{ tags_secure | size }})  |  Protect information and data so that persons or other products have only access to an extend appropriate to their types and levels, and to defend against attack patterns by malicious actors. |
| [**#testable**](/tag_testable/) ({{ tags_testable | size }})  |  Enable an objective and feasible test to be designed and performed to determine whether requirements are met. |
| [**#operable**](/tag_operable/) ({{ tags_operable | size }})  |  Easy to deploy, operate, monitor and control. |





<!--
## <font color="#dd354b">We're offering architecture training!</font>

The _dynamic duo_, always two trainers in parallel, practically applicable knowledge from Peter Hruschka and Gernot Starke. 
See [arc42.de](https://www.arc42.de/termine) for details, and schedule.

We've successfully trained more than 1000 developers in software architecture, many of them passed the [iSAQB CPSA-F](https://isaqb.org) certification.
(sorry - public training currently German-only, English for inhouse trainings.)

-->