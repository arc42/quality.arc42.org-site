---
layout: page
title: Qualities, plain
permalink: /qualities-plain/
hide: true
---


{% assign qualities_unsorted = site.posts | where: "categories", "qualities" %}
{% assign qualities = qualities_unsorted | sort %}

{% for quali in qualities  %}
  {{quali.title}} 
{% endfor %}

