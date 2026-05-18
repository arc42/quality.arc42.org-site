---
layout: page_requirements
title: Example Requirements
permalink: /requirements/
order: 30
no_layout_header: true
---

{% assign valid_tags = site.data.standard_tags.tags | sort %}
{% assign dimensions_with_requirements = 0 %}
{% for tag in valid_tags %}
  {% assign req_count_for_tag = 0 %}
  {% for requirement in site.requirements %}
    {% if requirement.tags contains tag %}
      {% assign req_count_for_tag = req_count_for_tag | plus: 1 %}
    {% endif %}
  {% endfor %}
  {% if req_count_for_tag > 0 %}
    {% assign dimensions_with_requirements = dimensions_with_requirements | plus: 1 %}
  {% endif %}
{% endfor %}

{% capture requirements_meta %}<b>{{ site.requirements | size }}</b> examples across <b>{{ dimensions_with_requirements }}</b> dimensions.{% endcapture %}

{% include section-hero.liquid
  section="requirements"
  title="Example Requirements"
  lede="Measurable targets you can lift into a real specification: scenarios with context, triggers, and acceptance criteria, sorted by dimension."
  meta=requirements_meta %}

Within the Software Engineering literature you might find the term "quality scenario" for such examples. That term was coined by authors from the Software Engineering Institute (SEI), especially [Len Bass et al.](/references/#bass2021software) Read more on the **[background of requirements](/articles/specify-quality-requirements)** in our short article.

<hr class="with-no-margin"/>

## Dimensions and Quality Requirements

<div id="tags">
  <ul class="tag-box inline">
  {% for tag in valid_tags %}
    {% assign req_count_for_tag = 0 %}
    {% for requirement in site.requirements %}
      {% if requirement.tags contains tag %}
        {% assign req_count_for_tag = req_count_for_tag | plus: 1 %}
      {% endif %}
    {% endfor %}
    <li>
      <a class="hov tags req" href="/tag-{{ tag | cgi_escape }}"><b>{{ tag }}</b>
        <span>{{ req_count_for_tag }}</span>
      </a>
    </li>

{% endfor %}

  </ul>
</div>

<div>
{% for tag in site.data.standard_tags.tags %}
  <h2 class="section-heading requirements">Quality Requirements tagged with {{ tag }}</h2>
  
    <ul class="posts no-bullets">
    {% for requirement in site.requirements %}
       {% if requirement.tags contains tag %}
           <li><a class="reqs" href="{{requirement.permalink}}"><i class="fa fa-bullseye fa-xs as-bullet" style="color: var(--req-text-color);"> </i> {{ requirement.title }}</a></li>
          
       {% endif %}
   {% endfor %}
   </ul>
 {% endfor %}
</div>
