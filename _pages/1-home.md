---
layout: default
title: Home
permalink: /
order: 1
---

<div class="ua-background" markdown="1">

>### We stand with the people of Ukraine <span class="parent"><span class="ua-text"><i class="fas fa-heart children"></i></span><span class="ua-size children"><i class="fas fa-heart beat heart children"></i></span></span>
>
>Please assist humanitarian efforts for the Ukrainian people and those affected by the military invasion of Ukraine by supporting international aid organizations, including the [International Committee of the Red Cross](https://www.icrc.org/en).

</div>


## System and product quality, made easy

Information-technology systems have to meet required, desired and expected quality requirements. 
Therefore, development teams need such requirements in concrete, specific and operationalized ways.
The current quality standards, like ISO-25010, [lack practical guidance and pragmatism](/articles/iso-25010-shortcomings), therefore we propose a usable and simple alternative:

![arc42 Quality Model (v1.0)](/images/arc42-system-qualities-overview.svg){:width="90%"}

[(click here for the interactive graphical version)](/home-new)

The arc42 quality model Q42 (pronounced "Kju-Fortytwo" or "Kju-Four-Two") is a simple, pragmatic yet effective approach to product and system quality.
It starts with stakeholders' expectations and requirements. 
From these, it derives 8 important system properties, which are sufficient to cover most, if not all, required, desirable or expected of the more than 100 _traditional_ qualities.

Find out more in our **[introduction to the Q42 quality model](/articles/arc42-quality-model)**

<hr class="with-no-margin"/>

## Explanations, Examples and Cross-References

{% assign qualities = site.posts | where: "categories", "qualities" %}
{% assign requirements = site.posts | where: "categories", "requirements" %}

On this site you find: 


* <font style="background-color:var(--quality-color)">explanations to (currently {{ qualities | size }}) <i>qualities</i> of software systems and -architectures, which are blueish in color.</font>
* <font style="background-color:var(--qual-req-color)">{{ requirements | size }} examples for specific quality <b>requirements</b>, which are greenish in color.</font>
* several [articles with background information](/articles) on quality
* a brief glossary of quality-related terms

Qualities and example-requirements are organized along the following top-level properties (attributes or _tags_), and cross-referenced. 
A single quality attribute (like "availability") might have multiple properties (#reliable, #usable and #safe, in this case).


{% assign tags_reliable = site.posts | where_exp: "posts", "posts.tags contains 'reliable'" %}
{% assign tags_flexible = site.posts | where_exp: "posts", "posts.tags contains 'flexible'" %}
{% assign tags_efficient = site.posts | where_exp: "posts", "posts.tags contains 'efficient'" %}
{% assign tags_usable = site.posts | where_exp: "posts", "posts.tags contains 'usable'" %}
{% assign tags_safe = site.posts | where_exp: "posts", "posts.tags contains 'safe'" %}
{% assign tags_secure = site.posts | where_exp: "posts", "posts.tags contains 'secure'" %}
{% assign tags_suitable = site.posts | where_exp: "posts", "posts.tags contains 'suitable'" %}
{% assign tags_operable = site.posts | where_exp: "posts", "posts.tags contains 'operable'" %}

| Top-level property | Explanation          |
| :--- | :--- |
| [**#reliable**](/tag-reliable/) ({{ tags_reliable | size }}) | Perform specified functions under specified conditions without interruptions or failures  |
|-|----------------------------|
| [**#flexible**](/tag-flexible/) ({{ tags_flexible | size }})  |  Serve a different or expanded set of requirements, the ease with which the product can be adapted to changes in its requirements, contexts of use, or system environment. Synonyms: modifiable, adjustable, changeable, versatile |
| [**#efficient**](/tag-efficient/) ({{ tags_efficient | size }})  |  Perform functions within specified time, capacity and throughput parameters, using appropriate resources (like memory, network bandwith, threads) |
| [**#usable**](/tag-usable/) ({{ tags_usable | size }})  |  Enable users to perform their tasks safely, effectively and efficiently while enjoying the experience |
| [**#safe**](/tag-safe/) ({{ tags_safe | size }})  |  Avoid states in which human life, health, property or the environment is endangered, detects and warns of risks and hazards.  |
| [**#secure**](/tag-secure/) ({{ tags_secure | size }})  |  Protect information and data so that persons or other products have only access to an extend appropriate to their types and levels, and to defend against attack patterns by malicious actors |
| [**#suitable**](/tag-suitable/) ({{ tags_suitable | size }})  | An abstract property, applicable to various objects. Provide properties that meet stated and implied needs of intended stakeholders.  |
| [**#operable**](/tag-operable/) ({{ tags_operable | size }})  |  Easy to deploy, operate, monitor and control |





<!--
## <font color="#dd354b">We're offering architecture training!</font>

The _dynamic duo_, always two trainers in parallel, practically applicable knowledge from Peter Hruschka and Gernot Starke. 
See [arc42.de](https://www.arc42.de/termine) for details, and schedule.

We've successfully trained more than 1000 developers in software architecture, many of them passed the [iSAQB CPSA-F](https://isaqb.org) certification.
(sorry - public training currently German-only, English for in-house trainings.)

-->
