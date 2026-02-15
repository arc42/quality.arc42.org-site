---
layout: page
title: Quality Aliases and Synonyms
permalink: /aliases/
order: 45
---

{% assign synonym_map = site.data.quality-synonyms %}
{% assign canonical_count = synonym_map.size %}
{% assign synonym_count = 0 %}
{% for entry in synonym_map %}
  {% assign synonym_count = synonym_count | plus: entry[1].size %}
{% endfor %}

{% assign canonical_rows = "" | split: "" %}
{% for entry in synonym_map %}
  {% assign canonical_slug = entry[0] %}
  {% assign canonical_path = "/qualities/" | append: canonical_slug %}
  {% assign canonical_page = site.qualities | where: "permalink", canonical_path | first %}
  {% if canonical_page %}
    {% assign canonical_name = canonical_page.title %}
  {% else %}
    {% assign canonical_name = canonical_slug | replace: "-", " " %}
  {% endif %}
  {% assign canonical_row = canonical_name | downcase | append: "||" | append: canonical_slug %}
  {% assign canonical_rows = canonical_rows | push: canonical_row %}
{% endfor %}
{% assign canonical_rows = canonical_rows | sort_natural %}

<div class="aliases-page">
  <section class="aliases-hero">
    <h2 class="aliases-hero-title">Canonical Terms, Clear Navigation</h2>
    <p class="aliases-hero-text">
      This page maps alias terms to canonical quality characteristics in the arc42 quality model.
      Use canonical names in requirements, reviews, and links; aliases remain discoverable and redirect to the same concept.
    </p>
    <div class="aliases-stats">
      <div class="aliases-stat">
        <span class="aliases-stat-value">{{ canonical_count }}</span>
        <span class="aliases-stat-label">Canonical Terms</span>
      </div>
      <div class="aliases-stat">
        <span class="aliases-stat-value">{{ synonym_count }}</span>
        <span class="aliases-stat-label">Aliases</span>
      </div>
    </div>
  </section>

  <div class="synonym-grid">
  {% for row in canonical_rows %}
    {% assign row_parts = row | split: "||" %}
    {% assign canonical_slug = row_parts[1] %}
    {% assign synonyms = synonym_map[canonical_slug] %}

    {% assign canonical_path = "/qualities/" | append: canonical_slug %}
    {% assign canonical_page = site.qualities | where: "permalink", canonical_path | first %}

    {% assign alias_rows = "" | split: "" %}
    {% for synonym_slug in synonyms %}
      {% assign synonym_path = "/qualities/" | append: synonym_slug %}
      {% assign synonym_page = site.qualities | where: "permalink", synonym_path | first %}
      {% if synonym_page %}
        {% assign synonym_name = synonym_page.title %}
      {% else %}
        {% assign synonym_name = synonym_slug | replace: "-", " " %}
      {% endif %}
      {% assign alias_row = synonym_name | downcase | append: "||" | append: synonym_slug %}
      {% assign alias_rows = alias_rows | push: alias_row %}
    {% endfor %}
    {% assign alias_rows = alias_rows | sort_natural %}

    <article class="synonym-card">
      <div class="synonym-canonical">
        {% if canonical_page %}
          <a href="{{ canonical_page.permalink }}">{{ canonical_page.title }}</a>
        {% else %}
          {{ canonical_slug | replace: "-", " " }}
        {% endif %}
      </div>

      {% if canonical_page.tags and canonical_page.tags.size > 0 %}
      <ul class="tags synonym-tags">
        <li><i class="fa fa-tags" style="color: var(--blue-text-color);"></i></li>
        {% assign sorted_tags = canonical_page.tags | sort_natural %}
        {% for tag in sorted_tags %}
          <li><a class="tag" href="/tag-{{ tag }}">#{{ tag }}</a></li>
        {% endfor %}
      </ul>
      {% endif %}

      <ul class="synonym-list">
        {% for alias_row in alias_rows %}
          {% assign alias_parts = alias_row | split: "||" %}
          {% assign synonym_slug = alias_parts[1] %}
          {% assign synonym_path = "/qualities/" | append: synonym_slug %}
          {% assign synonym_page = site.qualities | where: "permalink", synonym_path | first %}
          <li class="synonym-item">
            <span class="synonym-prefix">alias:</span>
            {% if synonym_page %}
              <a href="{{ synonym_page.permalink }}">{{ synonym_page.title }}</a>
            {% else %}
              {{ synonym_slug | replace: "-", " " }}
            {% endif %}
          </li>
        {% endfor %}
      </ul>

      <div class="synonym-footer">
        Canonical concept with {{ synonyms.size }} alias{% if synonyms.size > 1 %}es{% endif %}
      </div>
    </article>
  {% endfor %}
  </div>
</div>
