---
layout: page_standards
title: Quality Standards
permalink: /standards/
order: 40
---

{% assign allStandards = site.standards %}
{% assign category_order = "general,accessibility,usability,ai,trustworthiness,safety,security,privacy,data,governance,sector,coding,documentation" | split: "," %}

<div class="standards-page standards-overview">
  <div class="standards-view-switch">
    <a class="standards-view-switch-btn" href="{{ '/standards/explorer/' | prepend: site.baseurl }}">
      switch-to-standards-explorer
    </a>
  </div>

  <p class="standards-intro">
    Browse quality standards by category first, then jump to the detailed standard pages.
    Hover a standard chip to get a one-sentence orientation before clicking.
  </p>

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
