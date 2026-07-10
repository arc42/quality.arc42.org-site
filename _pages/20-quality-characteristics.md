---
layout: page
title: Quality Characteristics
permalink: /qualities/
order: 20
no_layout_header: true
---

{% assign canonical_qualities = site.qualities | where_exp: "q", "q.alias_of == nil" | sort: "title" %}
{% assign alias_qualities = site.qualities | where_exp: "q", "q.alias_of != nil" | sort: "title" %}
{% assign quality_tags = "" | split: "" %}
{% for quality in canonical_qualities %}
{% if quality.tags %}
{% assign quality_tags = quality_tags | concat: quality.tags %}
{% endif %}
{% endfor %}
{% assign dimension_tags = quality_tags | uniq | sort %}

<div id="top"></div>

{% capture qualities_meta %}<b>{{ canonical_qualities | size }}</b> qualities, <b>{{ alias_qualities | size }}</b> aliases, across <b>{{ dimension_tags | size }}</b> dimensions.{% endcapture %}

{% include section-hero.liquid
  section="qualities"
  title="Quality Characteristics"
  lede="Definitions, aliases, related qualities, and the standards that back them up. Use dimension filters and A-Z jump links to narrow the list."
  meta=qualities_meta %}

<section id="qualities-explorer" class="index-explorer" data-section="qualities" data-baseurl="{{ site.baseurl }}">

  {% include index-explorer-panels.liquid prefix="qualities" results_heading="Quality Characteristics" %}

  <noscript>
    <style>
      #qualities-explorer .ix-panel {
        display: none;
      }

      #qualities-explorer .ix-fallback-panel {
        display: block;
      }
    </style>

    {% assign fallback_terms = site.qualities | sort: "title" %}
    <div class="ix-panel ix-fallback-panel">
      <div class="ix-panel-head">
        <h2>No-JS Fallback</h2>
        <span>alphabetic list of canonical and alias terms</span>
      </div>

      <div class="ix-letters ix-fallback-letters">
        {% assign previous_letter = "" %}
        {% for term in fallback_terms %}
          {% assign current_letter = term.title | slice: 0 | upcase %}
          {% if current_letter != previous_letter %}
            <a class="ix-letter-chip" href="#fallback-{{ current_letter | slugify }}">{{ current_letter }}</a>
            {% assign previous_letter = current_letter %}
          {% endif %}
        {% endfor %}
      </div>

      <div class="ix-fallback-list">
        {% assign previous_letter = "" %}
        {% for term in fallback_terms %}
          {% assign current_letter = term.title | slice: 0 | upcase %}
          {% if current_letter != previous_letter %}
            {% unless forloop.first %}
              <div class="ix-return-top">
                <a href="#top" title="Return to top"><i class="fa fa-arrow-up" aria-hidden="true"></i> Return to top</a>
              </div>
            {% endunless %}
            <h3 id="fallback-{{ current_letter | slugify }}" class="ix-letter-heading">&mdash; {{ current_letter }} &mdash;</h3>
            {% assign previous_letter = current_letter %}
          {% endif %}

          <div class="ix-item{% if term.alias_of %} is-alias{% endif %}">
            <h4 class="ix-item-title">
              <a href="{{ term.url | prepend: site.baseurl }}">{{ term.title }}</a>
            </h4>

            {% if term.alias_of %}
              {% assign canonical_path = "/qualities/" | append: term.alias_of %}
              {% assign canonical_term = site.qualities | where: "permalink", canonical_path | first %}
              <div class="ix-alias-meta">
                <span class="ix-alias-label">alias</span>
                of
                {% if canonical_term %}
                  <a href="{{ canonical_term.url | prepend: site.baseurl }}">{{ canonical_term.title }}</a>
                {% else %}
                  <span>{{ term.alias_of | replace: "-", " " }}</span>
                {% endif %}
              </div>
            {% else %}
              <div class="ix-item-meta">
                <span>related: {{ term.related | size }}</span>
                <span>standards: {{ term.standards | size }}</span>
              </div>

              {% if term.tags %}
                <div class="ix-item-tags">
                  <i class="fa fa-tags" aria-hidden="true"></i>
                  {% for tag in term.tags %}
                    <a href="{{ '/tag-' | append: tag | prepend: site.baseurl }}">#{{ tag }}</a>{% unless forloop.last %}, {% endunless %}
                  {% endfor %}
                </div>
              {% endif %}
            {% endif %}
          </div>
        {% endfor %}

        <div class="ix-return-top">
          <a href="#top" title="Return to top"><i class="fa fa-arrow-up" aria-hidden="true"></i> Return to top</a>
        </div>
      </div>
    </div>

  </noscript>
</section>

<script id="qualities-explorer-data" type="application/json">
[
  {% for quality in canonical_qualities %}
    {% assign canonical_slug = quality.permalink | remove: "/qualities/" | replace: "/", "" %}
    {% assign alias_docs = site.qualities | where: "alias_of", canonical_slug | sort: "title" %}
    {
      "id": {{ canonical_slug | jsonify }},
      "title": {{ quality.title | jsonify }},
      "url": {{ quality.url | prepend: site.baseurl | jsonify }},
      "tags": [
        {% if quality.tags %}
          {% for tag in quality.tags %}
            {{ tag | jsonify }}{% unless forloop.last %}, {% endunless %}
          {% endfor %}
        {% endif %}
      ],
      "relatedCount": {{ quality.related | size }},
      "standardsCount": {{ quality.standards | size }},
      "aliases": [
        {% for alias in alias_docs %}
          {% assign alias_slug = alias.permalink | remove: "/qualities/" | replace: "/", "" %}
          {
            "id": {{ alias_slug | jsonify }},
            "title": {{ alias.title | jsonify }},
            "url": {{ alias.url | prepend: site.baseurl | jsonify }}
          }{% unless forloop.last %}, {% endunless %}
        {% endfor %}
      ]
    }{% unless forloop.last %}, {% endunless %}
  {% endfor %}
]
</script>
<script defer src="{{ '/assets/js/qualities-explorer.js' | prepend: site.baseurl }}"></script>
