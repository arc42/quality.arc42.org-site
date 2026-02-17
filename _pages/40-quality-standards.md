---
layout: page_standards
title: Quality Standards
permalink: /standards/
order: 40
---

{% assign allStandards = site.standards %}
{% assign category_order = "general,accessibility,usability,ai,trustworthiness,safety,security,privacy,data,governance,sector,coding,documentation" | split: "," %}
{% assign overview_href = '/standards/' | prepend: site.baseurl %}
{% assign explorer_href = '/standards/explorer/' | prepend: site.baseurl %}

<div class="standards-page standards-overview">
  {% include standards-hero.liquid
    standards=allStandards
    category_order=category_order
    active_mode="category"
    category_href=overview_href
    explorer_href=explorer_href
  %}

  <div class="standards-category-card-grid">
    {% for category in category_order %}
      {% assign filtered_standards = allStandards | where_exp: "std", "std.categories contains category" %}
      {% if filtered_standards.size > 0 %}
        {% include standards-category-card.liquid category=category standards=filtered_standards %}
      {% endif %}
    {% endfor %}
  </div>

  <hr class="with-no-margin" />

  <p class="standards-intro standards-intro-secondary">
    Full standards list grouped by category:
  </p>

  <div class="standards-categories-list">
    {% for category in category_order %}
      {% assign filtered_standards = allStandards | where_exp: "std", "std.categories contains category" %}
      {% if filtered_standards.size > 0 %}
        {% capture section_title %}{% include standards-category-title.liquid category=category %}{% endcapture %}
        {% assign section_title = section_title | strip %}
        {% include standards-category-section.liquid category=category title=section_title standards=allStandards %}
      {% endif %}
    {% endfor %}
  </div>
</div>
