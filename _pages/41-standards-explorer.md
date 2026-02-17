---
layout: page_standards
title: Standards Explorer
permalink: /standards/explorer/
order: 41
hide: true
---

{% assign allStandards = site.standards | sort: "shortname" %}
{% assign category_order = "general,accessibility,usability,ai,trustworthiness,safety,security,privacy,data,governance,sector,coding,documentation" | split: "," %}
{% assign overview_href = '/standards/' | prepend: site.baseurl %}
{% assign explorer_href = '/standards/explorer/' | prepend: site.baseurl %}

<div class="standards-page standards-explorer-view">
  {% include standards-hero.liquid
    standards=allStandards
    category_order=category_order
    active_mode="explorer"
    category_href=overview_href
    explorer_href=explorer_href
  %}

  <div class="standards-explorer-controls">
    <label class="standards-search-label" for="standards-search">Search standards</label>
    <input
      id="standards-search"
      class="standards-search-input"
      type="search"
      placeholder="Try ISO, security, privacy, AI, medical..."
    />
    <button type="button" id="standards-reset-filters" class="standards-reset-btn">reset-filters</button>
    <div id="standards-result-counter" class="standards-result-counter" aria-live="polite"></div>
  </div>

  <div class="standards-facet-list" role="toolbar" aria-label="Filter by standard category">
    {% for category in category_order %}
      {% assign filtered_standards = allStandards | where_exp: "std", "std.categories contains category" %}
      {% if filtered_standards.size > 0 %}
        {% capture category_title %}{% include standards-category-title.liquid category=category %}{% endcapture %}
        {% assign category_title = category_title | strip %}
        <button
          type="button"
          class="standards-facet-btn"
          data-category="{{ category }}"
          aria-pressed="false"
        >
          #{{ category_title }}
          <span class="standards-facet-count">{{ filtered_standards.size }}</span>
        </button>
      {% endif %}
    {% endfor %}
  </div>

  <div id="standards-explorer-grid" class="standards-explorer-grid">
    {% for std in allStandards %}
      {% assign summary = std.summary | default: std.excerpt | strip_html | strip_newlines | normalize_whitespace | truncate: 170 %}
      {% if summary == "" %}
        {% assign summary = "Open standard detail page." %}
      {% endif %}
      {% capture searchable %}
        {{ std.shortname }} {{ std.title }} {{ summary }}
        {% for category in std.categories %}{{ category }} {% endfor %}
      {% endcapture %}
      <article
        class="standards-explorer-card"
        tabindex="0"
        data-categories="{{ std.categories | join: ' ' }}"
        data-search="{{ searchable | strip_html | strip_newlines | normalize_whitespace | downcase | escape }}"
      >
        <div class="standards-explorer-card-head">
          <a class="standards-explorer-shortname" href="{{ std.url | prepend: site.baseurl }}">{{ std.shortname }}</a>
        </div>

        <h3 class="standards-explorer-title">
          <a href="{{ std.url | prepend: site.baseurl }}">{{ std.title }}</a>
        </h3>

        <ul class="standards-explorer-tags">
          <li><i class="fa fa-tags" aria-hidden="true"></i></li>
          {% for category in std.categories %}
            <li>#{{ category }}</li>
          {% endfor %}
        </ul>

        <div class="standards-explorer-hover">{{ summary }}</div>
      </article>
    {% endfor %}
  </div>
</div>

<script src="{{ '/assets/js/standards-explorer.js' | prepend: site.baseurl }}"></script>
