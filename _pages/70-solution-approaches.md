---
layout: page
title: Solution Approaches
permalink: /approaches/
order: 35
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

<section id="approaches-explorer" class="approaches-explorer" data-baseurl="{{ site.baseurl }}">
  <div class="approaches-explorer-hero">
    <p class="approaches-explorer-text">
      Solution approaches are <strong>architectural tactics and patterns</strong> that bridge
      quality requirements and concrete implementation decisions.
      Use <strong>dimension filters</strong> and <strong>A-Z jump links</strong> to
      quickly narrow down this list.
    </p>
    <p class="approaches-explorer-stats">
      We currently explain <strong>{{ approaches_sorted | size }}</strong> solution approaches
      (plus <strong>{{ approach_alias_count }}</strong> aliases), across
      <strong>{{ dimension_tags | size }}</strong> dimensions.
    </p>
  </div>

  <div class="approaches-explorer-panel">
    <div class="approaches-explorer-head">
      <h2>Dimensions</h2>
      <span id="approaches-facet-summary"></span>
    </div>
    <div id="approaches-facets" class="approaches-explorer-facets"></div>
  </div>

  <div class="approaches-explorer-panel">
    <div class="approaches-explorer-head">
      <h2>Jump to Letter</h2>
      <span id="approaches-letters-summary"></span>
    </div>
    <div id="approaches-letter-nav" class="approaches-explorer-letters"></div>
  </div>

  <div class="approaches-explorer-panel">
    <div class="approaches-explorer-head">
      <h2>Solution Approaches</h2>
      <span id="approaches-results-summary"></span>
    </div>
    <div id="approaches-results" class="approaches-explorer-results"></div>
  </div>

  <noscript>
    <style>
      #approaches-explorer .approaches-explorer-panel {
        display: none;
      }

      #approaches-explorer .approaches-fallback-panel {
        display: block;
      }
    </style>

    <div class="approaches-explorer-panel approaches-fallback-panel">
      <div class="approaches-explorer-head">
        <h2>No-JS Fallback</h2>
        <span>alphabetic list of solution approaches</span>
      </div>

      <div class="approaches-explorer-letters approaches-fallback-letters">
        {% assign previous_letter = "" %}
        {% for approach in approaches_sorted %}
          {% assign current_letter = approach.title | slice: 0 | upcase %}
          {% if current_letter != previous_letter %}
            <a class="approaches-letter-chip" href="#fallback-{{ current_letter | slugify }}">{{ current_letter }}</a>
            {% assign previous_letter = current_letter %}
          {% endif %}
        {% endfor %}
      </div>

      <div class="approaches-fallback-list">
        {% assign previous_letter = "" %}
        {% for approach in approaches_sorted %}
          {% assign current_letter = approach.title | slice: 0 | upcase %}
          {% if current_letter != previous_letter %}
            {% unless forloop.first %}
              <div class="approaches-return-top">
                <a href="#top" title="Return to top"><i class="fa fa-arrow-up" aria-hidden="true"></i> Return to top</a>
              </div>
            {% endunless %}
            <h3 id="fallback-{{ current_letter | slugify }}" class="approaches-letter-heading">&mdash; {{ current_letter }} &mdash;</h3>
            {% assign previous_letter = current_letter %}
          {% endif %}

          <div class="approaches-item">
            <h4 class="approaches-item-title">
              <a href="{{ approach.url | prepend: site.baseurl }}"><i class="fa fa-puzzle-piece fa-xs as-bullet" aria-hidden="true"></i> {{ approach.title }}</a>
            </h4>

            <div class="approaches-item-meta">
              <span>supports: {{ approach.supported_qualities | size }}</span>
              <span>trade-offs: {{ approach.tradeoffs | size }}</span>
            </div>

            {% if approach.tags %}
              <div class="approaches-item-tags">
                <i class="fa fa-tags" aria-hidden="true"></i>
                {% for tag in approach.tags %}
                  <a href="{{ '/tag-' | append: tag | prepend: site.baseurl }}">#{{ tag }}</a>{% unless forloop.last %}, {% endunless %}
                {% endfor %}
              </div>
            {% endif %}

            {% if approach.aka %}
              {% for alias in approach.aka %}
                <div class="approaches-item is-alias">
                  <h4 class="approaches-item-title">{{ alias }}</h4>
                  <div class="approaches-alias-meta">
                    <span class="approaches-alias-label">alias</span>
                    of
                    <a href="{{ approach.url | prepend: site.baseurl }}">{{ approach.title }}</a>
                  </div>
                </div>
              {% endfor %}
            {% endif %}
          </div>
        {% endfor %}

        <div class="approaches-return-top">
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

<style>
  .approaches-explorer {
    --ax-border: rgba(56, 133, 50, 0.34);
    --ax-border-soft: rgba(56, 133, 50, 0.2);
    --ax-surface: #f8fff5;
    --ax-surface-2: #f2fde9;
    --ax-text: #1b5e20;
    --ax-muted: #496346;
    --ax-accent: #2f7727;
    --ax-accent-2: #5ec552;
    --ax-chip: #eaf7e6;
    --ax-chip-text: #1b5e20;
    --ax-chip-border: #b9dcb1;
    --ax-heading-bg: #e7f6e1;
    margin-top: 0.75rem;
  }

  .approaches-explorer-hero {
    border: 1px solid var(--ax-border);
    border-radius: 12px;
    padding: 0.92rem 1rem;
    background:
      radial-gradient(circle at 0% 0%, rgba(146, 239, 128, 0.24), transparent 54%),
      radial-gradient(circle at 100% 100%, rgba(94, 197, 82, 0.18), transparent 58%),
      var(--ax-surface);
  }

  .approaches-explorer-text {
    margin: 0;
    color: var(--ax-muted);
  }

  .approaches-explorer-stats {
    margin: 0.48rem 0 0;
    color: var(--ax-muted);
    font-size: 0.92rem;
    font-weight: 600;
  }

  .approaches-explorer-stats strong {
    color: var(--ax-accent);
  }

  .approaches-explorer-panel {
    margin-top: 0.72rem;
    border: 1px solid var(--ax-border);
    border-radius: 12px;
    background: #fff;
    padding: 0.78rem 0.82rem;
  }

  .approaches-explorer-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.42rem;
    margin-bottom: 0.55rem;
  }

  .approaches-explorer-head h2 {
    margin: 0;
    color: var(--ax-text);
    font-size: 1.04rem;
  }

  .approaches-explorer-head span {
    color: var(--ax-muted);
    font-size: 0.84rem;
  }

  .approaches-explorer-facets,
  .approaches-explorer-letters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.42rem;
  }

  .approaches-facet-chip,
  .approaches-letter-chip {
    border: 1px solid var(--ax-chip-border);
    border-radius: 999px;
    background: var(--ax-chip);
    color: var(--ax-chip-text);
    font-size: 0.82rem;
    font-weight: 700;
    padding: 0.22rem 0.62rem;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.24rem;
  }

  .approaches-facet-chip.active {
    border-color: transparent;
    background: linear-gradient(180deg, #b9f0ac, var(--ax-accent-2));
    color: #0d3b09;
  }

  .approaches-count {
    font-size: 0.8em;
    opacity: 0.85;
  }

  .approaches-explorer-results {
    display: grid;
    gap: 0.68rem;
  }

  .approaches-fallback-panel {
    margin-top: 0.72rem;
  }

  .approaches-fallback-letters {
    margin-bottom: 0.62rem;
  }

  .approaches-fallback-list {
    border: 1px solid var(--ax-border);
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }

  .approaches-letter-section {
    border: 1px solid var(--ax-border);
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
  }

  .approaches-letter-heading {
    margin: 0;
    padding: 0.54rem 0.76rem;
    background: var(--ax-heading-bg);
    color: var(--ax-text);
    font-size: 1rem;
    border-bottom: 1px solid var(--ax-border);
    scroll-margin-top: 0.8rem;
  }

  .approaches-letter-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .approaches-item {
    padding: 0.68rem 0.76rem;
    border-top: 1px solid #eaf3e6;
  }

  .approaches-item:first-child {
    border-top: 0;
  }

  .approaches-item.is-alias {
    background: var(--ax-surface);
    border-left: 3px solid var(--ax-chip-border);
    padding-left: 0.66rem;
  }

  .approaches-item-title {
    margin: 0;
    font-size: 1.12rem;
    line-height: 1.28;
    color: var(--ax-text);
  }

  .approaches-item-title a {
    color: var(--ax-accent);
    text-decoration: none;
    font-weight: 700;
    display: inline-flex;
    align-items: baseline;
    gap: 0.35rem;
  }

  .approaches-item-title a:hover {
    text-decoration: underline;
  }

  .approaches-item.is-alias .approaches-item-title {
    font-size: 1rem;
  }

  .approaches-item.is-alias .approaches-item-title a {
    color: var(--ax-muted);
  }

  .approaches-item-title .as-bullet {
    color: var(--ax-accent);
    flex: 0 0 auto;
  }

  .approaches-item-meta {
    margin-top: 0.22rem;
    color: var(--ax-muted);
    font-size: 0.83rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.7rem;
  }

  .approaches-item-tags {
    margin-top: 0.25rem;
    color: var(--ax-muted);
    font-size: 0.95rem;
  }

  .approaches-item-tags .fa-tags {
    color: var(--ax-accent);
    margin-right: 0.2rem;
  }

  .approaches-item-tags a {
    color: var(--ax-accent);
    text-decoration: none;
    font-weight: 700;
  }

  .approaches-item-tags a:hover {
    text-decoration: underline;
  }

  .approaches-alias-meta {
    margin-top: 0.24rem;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
    color: var(--ax-muted);
    font-size: 0.8rem;
  }

  .approaches-alias-label {
    border-radius: 999px;
    border: 1px solid var(--ax-chip-border);
    background: var(--ax-chip);
    color: var(--ax-muted);
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    padding: 0.06rem 0.3rem;
  }

  .approaches-alias-meta a {
    color: var(--ax-muted);
    text-decoration: underline;
    text-decoration-style: dotted;
    text-underline-offset: 2px;
  }

  .approaches-return-top {
    border-top: 1px solid #eaf3e6;
    text-align: right;
    padding: 0.62rem 0.76rem;
  }

  .approaches-return-top a {
    display: inline-flex;
    align-items: center;
    gap: 0.34rem;
    color: #60666b;
    font-size: 1.25rem;
    text-decoration: none;
  }

  .approaches-return-top a:hover {
    color: #3f5564;
  }

  .approaches-empty {
    border: 1px dashed var(--ax-border);
    border-radius: 10px;
    padding: 1rem 0.82rem;
    color: var(--ax-muted);
    background: var(--ax-surface-2);
  }
</style>
