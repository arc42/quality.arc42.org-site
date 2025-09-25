---
layout: page_standards
title: Standards
permalink: /standards/
order: 50
---

{::comment}
Overview of quality standards
{:/comment}

{% assign standards = site.standards %}

{::comment}
Group standards by categories
{:/comment}
{% assign categories = "general,ai,safety,security,privacy,data,sector" | split: "," %}
{% assign category_names = "General,AI,Safety,Security,Privacy,Data,Sector-Specific" | split: "," %}

{% for i in (0..6) %}
  {% assign category = categories[i] %}
  {% assign category_name = category_names[i] %}
  
  {::comment}Filter standards for current category{:/comment}
  {% assign category_standards = "" | split: "," %}
  {% for standard in standards %}
    {% if standard.categories contains category %}
      {% assign category_standards = category_standards | push: standard %}
    {% endif %}
  {% endfor %}
  
  {% if category_standards.size > 0 %}
## {{ category_name }}
{: style="background-color: var(--standard-background-color); color: var(--standard-text-color); padding: 10px; border-radius: 5px; margin: 20px 0 10px 0;"}

<ul class="posts">
    {% for standard in category_standards %}
     <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
    {% endfor %}
</ul>
  {% endif %}
{% endfor %}

{::comment}
Keep the current complete list as requested
{:/comment}
## All Standards

<ul class="posts">
  {% for standard in standards %}
   <li><i class="fas fa-solid fa-award" style="color: var(--standard-text-color);"></i> <a href="{{standard.url}}">{{standard.title}}</a></li>
  {% endfor %}
</ul>