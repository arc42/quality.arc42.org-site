---
layout: default
title: Home
permalink: /
order: 1
---

<div class="ua-background" markdown="1">

> ### We stand with the people of Ukraine <span class="parent"><span class="ua-text"><i class="fas fa-heart children"></i></span><span class="ua-size children"><i class="fas fa-heart beat heart children"></i></span></span>
>
>Please assist humanitarian efforts for the Ukrainian people and those affected by the military invasion of Ukraine by
> supporting international aid organizations, including
> the [International Committee of the Red Cross](https://www.icrc.org/en).

</div>

## System and product quality, made easy

Information-technology systems have to meet required, desired and expected quality requirements.
Therefore, development teams need such requirements in concrete, specific and operationalized ways.
The current quality standards, like
ISO-25010, [lack practical guidance and pragmatism](/articles/iso-25010-shortcomings), therefore we propose a usable and
simple alternative:

<div id="q-graph-container"></div>
<script src="{{ '/assets/js/homepage/main.js' | prepend: site.baseurl }}"></script>

Double-click a node in the graph above to view its definition, related qualities and requirements.
View the full interactive quality graph **[here](/full-quality-graph)**.

The arc42 quality model Q42 (pronounced "Kju-Fortytwo" or "Kju-Four-Two") is a simple, pragmatic yet effective approach
to product and system quality.
It starts with stakeholders' expectations and requirements.
From these, it derives 8 important system properties, which are sufficient to cover most, if not all, required,
desirable or expected of the more than 100 _traditional_ qualities.

Find out more in our **[introduction to the Q42 quality model](/articles/arc42-quality-model)**

<hr class="with-no-margin"/>

## Explanations, Examples and Cross-References

{% assign qualities = site.qualities %}
{% assign requirements = site.requirements %}
{% assign standards = site.standards %}

On this site you find:

* <font style="background-color:var(--quality-background-color)">explanations to (currently {{ qualities | size }}) <i> qualities</i> of software systems and -architectures, which have blueish background.</font>
* <font style="background-color:var(--reqs-background-color)">{{ requirements | size }} examples for specific quality <b> requirements</b>, with reddish background.</font>
* <font style="background-color:var(--standard-background-color)">{{ standards | size }} <b> standards </b> related to system and product quality, with yellowish background.</font>
* several [articles with background information](/articles) on quality
* a brief glossary of quality-related terms

Qualities and example-requirements are organized along the following top-level properties (attributes or _tags_), and cross-referenced.
A single quality attribute (like "availability") might have multiple properties (#reliable, #usable and #safe, in this case).

{% comment %}Count tags from both qualities and requirements collections{% endcomment %}

{% assign tags_reliable_qualities = site.qualities | where_exp: "item", "item.tags contains 'reliable'" %}
{% assign tags_reliable_requirements = site.requirements | where_exp: "item", "item.tags contains 'reliable'" %}
{% assign tags_reliable_count = tags_reliable_qualities.size | plus: tags_reliable_requirements.size %}

{% assign tags_flexible_qualities = site.qualities | where_exp: "item", "item.tags contains 'flexible'" %}
{% assign tags_flexible_requirements = site.requirements | where_exp: "item", "item.tags contains 'flexible'" %}
{% assign tags_flexible_count = tags_flexible_qualities.size | plus: tags_flexible_requirements.size %}

{% assign tags_efficient_qualities = site.qualities | where_exp: "item", "item.tags contains 'efficient'" %}
{% assign tags_efficient_requirements = site.requirements | where_exp: "item", "item.tags contains 'efficient'" %}
{% assign tags_efficient_count = tags_efficient_qualities.size | plus: tags_efficient_requirements.size %}

{% assign tags_usable_qualities = site.qualities | where_exp: "item", "item.tags contains 'usable'" %}
{% assign tags_usable_requirements = site.requirements | where_exp: "item", "item.tags contains 'usable'" %}
{% assign tags_usable_count = tags_usable_qualities.size | plus: tags_usable_requirements.size %}

{% assign tags_safe_qualities = site.qualities | where_exp: "item", "item.tags contains 'safe'" %}
{% assign tags_safe_requirements = site.requirements | where_exp: "item", "item.tags contains 'safe'" %}
{% assign tags_safe_count = tags_safe_qualities.size | plus: tags_safe_requirements.size %}

{% assign tags_secure_qualities = site.qualities | where_exp: "item", "item.tags contains 'secure'" %}
{% assign tags_secure_requirements = site.requirements | where_exp: "item", "item.tags contains 'secure'" %}
{% assign tags_secure_count = tags_secure_qualities.size | plus: tags_secure_requirements.size %}

{% assign tags_suitable_qualities = site.qualities | where_exp: "item", "item.tags contains 'suitable'" %}
{% assign tags_suitable_requirements = site.requirements | where_exp: "item", "item.tags contains 'suitable'" %}
{% assign tags_suitable_count = tags_suitable_qualities.size | plus: tags_suitable_requirements.size %}

{% assign tags_operable_qualities = site.qualities | where_exp: "item", "item.tags contains 'operable'" %}
{% assign tags_operable_requirements = site.requirements | where_exp: "item", "item.tags contains 'operable'" %}
{% assign tags_operable_count = tags_operable_qualities.size | plus: tags_operable_requirements.size %}

| Top-level property                                   | Explanation                  |
|:-----------------------------------------------------|:-----------------------------|
| [**#reliable**](/tag-reliable/) ({{ tags_reliable_count }}) | Perform specified functions under specified conditions without interruptions or failures |
| [**#flexible**](/tag-flexible/) ({{ tags_flexible_count }}) | Serve a different or expanded set of requirements, the ease with which the product can be adapted to changes in its requirements, contexts of use, or system environment. Synonyms: modifiable, adjustable, changeable, versatile |
| [**#efficient**](/tag-efficient/) ({{ tags_efficient_count }}) | Perform functions within specified time, capacity and throughput parameters, using appropriate resources (like memory, network bandwith, threads) |
| [**#usable**](/tag-usable/) ({{ tags_usable_count }}) | Enable users to perform their tasks safely, effectively and efficiently while enjoying the experience |
| [**#safe**](/tag-safe/) ({{ tags_safe_count }}) | Avoid states in which human life, health, property or the environment is endangered, detects and warns of risks and hazards.|
| [**#secure**](/tag-secure/) ({{ tags_secure_count }}) | Protect information and data so that persons or other products have only access to an extend appropriate to their types and levels, and to defend against attack patterns by malicious actors |
| [**#suitable**](/tag-suitable/) ({{ tags_suitable_count }}) | An abstract property, applicable to various objects. Provide properties that meet stated and implied needs of intended stakeholders. |
| [**#operable**](/tag-operable/) ({{ tags_operable_count }}) | Easy to deploy, operate, monitor and control |

<small>The numbers at the tags denote the qualities plus the requirements that carry that tag.</small>


## <font color="#dd354b">We're offering architecture training!</font>

The _dynamic duo_, always two trainers in parallel, practically applicable knowledge from Peter Hruschka and Gernot Starke. 
See [arc42.de](https://www.arc42.de/termine) for details, and schedule.

We've successfully trained more than 3000 developers in software architecture, many of them passed the [iSAQB CPSA-F](https://isaqb.org) certification. 
