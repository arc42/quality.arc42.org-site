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

<div id="top"></div>

{% capture requirements_meta %}<b>{{ site.requirements | size }}</b> examples across <b>{{ dimensions_with_requirements }}</b> dimensions.{% endcapture %}

{% include section-hero.liquid
  section="requirements"
  title="Example Requirements"
  lede="Measurable targets you can lift into a real specification: scenarios with context, triggers, and acceptance criteria. Use dimension filters and A-Z jump links to narrow the list."
  meta=requirements_meta %}

Within the Software Engineering literature you might find the term "quality scenario" for such examples. That term was coined by authors from the Software Engineering Institute (SEI), especially [Len Bass et al.](/references/#bass2021software) Read more on the **[background of requirements](/articles/specify-quality-requirements)** in our short article.

<section id="requirements-explorer" class="index-explorer" data-section="requirements" data-baseurl="{{ site.baseurl }}">

  {% include index-explorer-panels.liquid prefix="requirements" results_heading="Example Requirements" %}

  <noscript>
    <style>
      #requirements-explorer .ix-panel {
        display: none;
      }
    </style>

    <ul class="req-explorer-facets" aria-label="Jump to dimension">
      {% for tag in valid_tags %}
        {% assign req_count_for_tag = 0 %}
        {% for requirement in site.requirements %}
          {% if requirement.tags contains tag %}
            {% assign req_count_for_tag = req_count_for_tag | plus: 1 %}
          {% endif %}
        {% endfor %}
        {% if req_count_for_tag > 0 %}
          <li>
            <a class="req-explorer-facet" href="#dimension-{{ tag | slugify }}">
              #{{ tag }}
              <span class="req-explorer-facet__count">{{ req_count_for_tag }}</span>
            </a>
          </li>
        {% endif %}
      {% endfor %}
    </ul>

    {% for tag in valid_tags %}
      {% assign reqs_for_tag = site.requirements | where_exp: "r", "r.tags contains tag" %}
      {% if reqs_for_tag.size > 0 %}
        <div class="req-explorer-section" id="dimension-{{ tag | slugify }}">
          <h2 class="section-heading requirements">Quality Requirements tagged with {{ tag }}</h2>

          <ul class="req-explorer-list">
            {% for requirement in reqs_for_tag %}
              <li class="req-explorer-item">
                <a class="req-explorer-item__link" href="{{ requirement.permalink }}">
                  <i class="fa fa-bullseye req-explorer-item__bullet" aria-hidden="true"></i>
                  <span class="req-explorer-item__title">{{ requirement.title }}</span>
                </a>
              </li>
            {% endfor %}
          </ul>
        </div>
      {% endif %}
    {% endfor %}
  </noscript>
</section>

<script id="requirements-explorer-data" type="application/json">
[
  {% for requirement in site.requirements %}
    {% assign requirement_slug = requirement.permalink | split: "/" | last %}
    {
      "id": {{ requirement_slug | jsonify }},
      "title": {{ requirement.title | jsonify }},
      "url": {{ requirement.url | prepend: site.baseurl | jsonify }},
      "tags": [
        {% if requirement.tags %}
          {% for tag in requirement.tags %}
            {{ tag | jsonify }}{% unless forloop.last %}, {% endunless %}
          {% endfor %}
        {% endif %}
      ],
      "relatedCount": {{ requirement.related | size }}
    }{% unless forloop.last %}, {% endunless %}
  {% endfor %}
]
</script>
<script defer src="{{ '/assets/js/requirements-explorer.js' | prepend: site.baseurl }}"></script>
