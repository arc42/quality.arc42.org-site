---
layout: page
title: Solution Approaches
permalink: /approaches/
order: 70
---

Solution approaches are **architectural tactics and patterns** that help achieve specific quality attributes. They describe *how* to implement qualities, bridging the gap from quality requirements to concrete solutions.

Each approach documents:
- **Intent** -- what it aims to achieve
- **Mechanism** -- how it works
- **Supported qualities** -- which qualities it helps
- **Trade-offs** -- which qualities it may negatively affect

{% assign approaches = site.approaches | sort: 'title' %}

<ul class="posts no-bullets">
{% for approach in approaches %}
  <li>
    <a href="{{ approach.permalink }}"><i class="fa fa-puzzle-piece fa-xs as-bullet" style="color: var(--approaches-text-color);"> </i> {{ approach.title }}</a>
    {% if approach.intent %}<br><small>{{ approach.intent }}</small>{% endif %}
  </li>
{% endfor %}
</ul>
