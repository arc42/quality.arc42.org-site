---
layout: default
title: Home
permalink: /
---

>### ![](/images/ua-flag.svg){:width="5%"} We stand with the people of Ukraine ![](/images/ua-flag.svg){:width="5%"}
>
>Please assist humanitarian efforts for the Ukrainian people and those affected by the military invasion of Ukraine by supporting international aid organizations, including the [International Committee of the Red Cross](https://www.icrc.org/en). 

## arc42 Quality Model (v 1.0)
![arc42 Quality Model (v1.0)](/images/QM-42-v1.svg)

Information-technology systems have to meed required, desired and expected quality goals and requirements. 
Therefore, development teams we need such requirements in concrete, specific and operationalized ways.



On this site you find explanations to (currently {{ site.qualities | size }}) _qualities_ of software systems and -architectures.

These are organized along the following top-level tags (we like to call them _tags_ instead of properties or attributes, as a single quality attribute (like "availability") might have multiple tags (#reliable, #usable and #safe, in this case)).


{% assign tags_reliable = site.qualities | where_exp: "qualities", "qualities.tags contains 'reliable'" %}
{% assign tags_flexible = site.posts | where_exp: "post", "post.tags contains 'flexible'" %}

| Tag         | Explanation                   |
|:-----------------|:----------------------------|
| [**#reliable**](/tag_reliable/) ({{ tag_reliable | size }}) | definition of reliable |
|-----------------|----------------------------|
| [**#flexible**](/tag_flexible/) ({{ tags_flexible | size }})  |  definition of flexible |
|-----------------|----------------------------|




## <font color="#dd354b">We're offering architecture training!</font>

The _dynamic duo_, always two trainers in parallel, practically applicable knowledge from Peter Hruschka and Gernot Starke. 
See [arc42.de](https://www.arc42.de/termine) for details, and schedule.

We've successfully trained more than 1000 developers in software architecture, many of them passed the [iSAQB CPSA-F](https://isaqb.org) certification.
(sorry - public training currently German-only, English for inhouse trainings.)
