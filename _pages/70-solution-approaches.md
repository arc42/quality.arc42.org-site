---
layout: page
title: Solution Approaches
permalink: /approaches/
order: 35
no_layout_header: true
---

{% assign approaches_sorted = site.approaches | sort: "title" %}
{% assign approach_tags = "" | split: "" %}
{% for approach in approaches_sorted %}
{% if approach.tags %}
{% assign approach_tags = approach_tags | concat: approach.tags %}
{% endif %}
{% endfor %}
{% assign dimension_tags = approach_tags | uniq | sort %}
{% assign approach_alias_count = 0 %}
{% for approach in approaches_sorted %}{% if approach.aka %}{% assign approach_alias_count = approach_alias_count | plus: approach.aka.size %}{% endif %}{% endfor %}

<div id="top"></div>

{% capture approaches_meta %}<b>{{ approaches_sorted | size }}</b> approaches, <b>{{ approach_alias_count }}</b> aliases, across <b>{{ dimension_tags | size }}</b> dimensions.{% endcapture %}

{% include section-hero.liquid
  section="approaches"
  title="Solution Approaches"
  lede="Architectural tactics and patterns that bridge quality requirements and concrete implementation decisions. Use dimension filters and A-Z jump links to narrow the list."
  meta=approaches_meta %}

<section id="approaches-explorer" class="index-explorer" data-section="approaches" data-baseurl="{{ site.baseurl }}">

  {% include index-explorer-panels.liquid prefix="approaches" results_heading="Solution Approaches" %}

  <noscript>
    <style>
      #approaches-explorer .ix-panel {
        display: none;
      }

      #approaches-explorer .ix-fallback-panel {
        display: block;
      }
    </style>

    <div class="ix-panel ix-fallback-panel">
      <div class="ix-panel-head">
        <h2>No-JS Fallback</h2>
        <span>alphabetic list of solution approaches</span>
      </div>

      <div class="ix-letters ix-fallback-letters">
        {% assign previous_letter = "" %}
        {% for approach in approaches_sorted %}
          {% assign current_letter = approach.title | slice: 0 | upcase %}
          {% if current_letter != previous_letter %}
            <a class="ix-letter-chip" href="#fallback-{{ current_letter | slugify }}">{{ current_letter }}</a>
            {% assign previous_letter = current_letter %}
          {% endif %}
        {% endfor %}
      </div>

      <div class="ix-fallback-list">
        {% assign previous_letter = "" %}
        {% for approach in approaches_sorted %}
          {% assign current_letter = approach.title | slice: 0 | upcase %}
          {% if current_letter != previous_letter %}
            {% unless forloop.first %}
              <div class="ix-return-top">
                <a href="#top" title="Return to top"><i class="fa fa-arrow-up" aria-hidden="true"></i> Return to top</a>
              </div>
            {% endunless %}
            <h3 id="fallback-{{ current_letter | slugify }}" class="ix-letter-heading">&mdash; {{ current_letter }} &mdash;</h3>
            {% assign previous_letter = current_letter %}
          {% endif %}

          <div class="ix-item">
            <h4 class="ix-item-title">
              <a href="{{ approach.url | prepend: site.baseurl }}"><i class="fa fa-puzzle-piece fa-xs as-bullet" aria-hidden="true"></i> {{ approach.title }}</a>
            </h4>

            <div class="ix-item-meta">
              <span>supports: {{ approach.supported_qualities | size }}</span>
              <span>trade-offs: {{ approach.tradeoffs | size }}</span>
            </div>

            {% if approach.tags %}
              <div class="ix-item-tags">
                <i class="fa fa-tags" aria-hidden="true"></i>
                {% for tag in approach.tags %}
                  <a href="{{ '/tag-' | append: tag | prepend: site.baseurl }}">#{{ tag }}</a>{% unless forloop.last %}, {% endunless %}
                {% endfor %}
              </div>
            {% endif %}

            {% if approach.aka %}
              {% for alias in approach.aka %}
                <div class="ix-item is-alias">
                  <h4 class="ix-item-title">{{ alias }}</h4>
                  <div class="ix-alias-meta">
                    <span class="ix-alias-label">alias</span>
                    of
                    <a href="{{ approach.url | prepend: site.baseurl }}">{{ approach.title }}</a>
                  </div>
                </div>
              {% endfor %}
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

<script id="approaches-explorer-data" type="application/json">
[
  {% for approach in approaches_sorted %}
    {% assign approach_slug = approach.permalink | remove: "/approaches/" | replace: "/", "" %}
    {
      "id": {{ approach_slug | jsonify }},
      "title": {{ approach.title | jsonify }},
      "url": {{ approach.url | prepend: site.baseurl | jsonify }},
      "tags": [
        {% if approach.tags %}
          {% for tag in approach.tags %}
            {{ tag | jsonify }}{% unless forloop.last %}, {% endunless %}
          {% endfor %}
        {% endif %}
      ],
      "supportedCount": {{ approach.supported_qualities | size }},
      "tradeoffsCount": {{ approach.tradeoffs | size }},
      "aliases": [
        {% if approach.aka %}
          {% for alias in approach.aka %}
            {{ alias | jsonify }}{% unless forloop.last %}, {% endunless %}
          {% endfor %}
        {% endif %}
      ]
    }{% unless forloop.last %}, {% endunless %}
  {% endfor %}
]
</script>
<script defer src="{{ '/assets/js/approaches-explorer.js' | prepend: site.baseurl }}"></script>
