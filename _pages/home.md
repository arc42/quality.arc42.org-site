---
layout: default
title: Home
order: 0
permalink: /home/
---

>### ![](/images/ua-flag.svg){:width="5%"} We stand with the people of Ukraine ![](/images/ua-flag.svg){:width="5%"}
>
>Please assist humanitarian efforts for the Ukrainian people and those affected by the military invasion of Ukraine by supporting international aid organizations, including the [International Committee of the Red Cross](https://www.icrc.org/en). 

## arc42 Quality Model (v 1.0)
![arc42 Quality Model (v1.0)](/images/QM-42-v1.svg)

{% assign categoryA_posts = site.posts | where: "category", "general" %}

{% assign categoryB_posts = site.posts | where: "category", "method" %}
{% assign categoryC_posts = site.posts | where_exp: "post", "post.category contains 'section'" %}


On this site you find explanations to (currently {{ site.posts | size }}) _qualities_ of software systems and -architectures.

These are organized along the following top-level tags (we like to call them _tags_ instead of properties or attributes, as a single quality attribute (like "availability") might have multiple tags (#reliable, #usable and #safe, in this case)).


| Tag         | Explanation                   |
|:-----------------|:----------------------------|
| [**#reliable**](/tag_reliable/) ({{ tag_reliable }}) | definition of reliable |
|-----------------|----------------------------|
| [**#flexible**](/tag_flexible/) ({{ categoryB_posts | size }})  |  definition of flexible |
|-----------------|----------------------------|




## <font color="#dd354b">We're offering architecture training!</font>

The _dynamic duo_, always two trainers in parallel, practically applicable knowledge from Peter Hruschka and Gernot Starke. 
See [arc42.de](https://www.arc42.de/termine) for details, and schedule.

We've successfully trained more than 1000 developers in software architecture, many of them passed the [iSAQB CPSA-F](https://isaqb.org) certification.
(sorry - public training currently German-only, English for inhouse trainings.)
