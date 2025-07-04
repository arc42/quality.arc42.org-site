---
layout: page
title: Standards
permalink: /standards/
order: 50
---

{::comment}
Overview of quality standards
{:/comment}



{% assign standards_unsorted = site.posts | where: "categories", "standards" %}
{% assign standards = standards_unsorted | sort %}


<ul>
  {% for standard in standards %}
   <li><a href="{{standard.url}}">{{standard.title}}</a></li>
  {% endfor %}
</ul>


